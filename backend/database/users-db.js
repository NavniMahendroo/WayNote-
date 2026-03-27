import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, "users.json");

const readUsers = async () => {
  const file = await readFile(usersFilePath, "utf-8");
  return JSON.parse(file);
};

const writeUsers = async (users) => {
  await writeFile(usersFilePath, JSON.stringify(users, null, 2) + "\n", "utf-8");
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const geocodeCache = new Map();

const isValidCoord = (coord) => {
  if (!coord || typeof coord !== "object") {
    return false;
  }

  const latitude = Number(coord.latitude);
  const longitude = Number(coord.longitude);

  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180
  );
};

const normalizeCoord = (coord) => {
  if (!isValidCoord(coord)) {
    return undefined;
  }

  return {
    latitude: Number(coord.latitude),
    longitude: Number(coord.longitude),
  };
};

const modeToIcon = (mode) => {
  const normalizedMode = String(mode || "other").trim().toLowerCase();
  if (["walk", "walking"].includes(normalizedMode)) return "🚶";
  if (["cycle", "cycling", "bicycle"].includes(normalizedMode)) return "🚴";
  if (normalizedMode === "bus") return "🚌";
  if (normalizedMode === "car") return "🚗";
  if (normalizedMode === "train") return "🚂";
  if (["motorcycle", "bike"].includes(normalizedMode)) return "🏍️";
  return "🧭";
};

const normalizeTrip = (trip) => {
  if (!trip || typeof trip !== "object") {
    return null;
  }

  const normalizedMode = String(trip.mode || "other").trim().toLowerCase();
  const rawIcon = String(trip.icon || "").trim();

  return {
    id: typeof trip.id === "number" ? trip.id : Date.now(),
    title: String(trip.title || "Untitled Trip").trim(),
    route: String(trip.route || "Unknown - Unknown").trim(),
    time: String(trip.time || "").trim(),
    mode: normalizedMode,
    icon: !rawIcon || rawIcon === "?" ? modeToIcon(normalizedMode) : rawIcon,
    numberOfPeople: trip.numberOfPeople ? String(trip.numberOfPeople) : undefined,
    notes: trip.notes ? String(trip.notes) : undefined,
    dateLabel: trip.dateLabel ? String(trip.dateLabel) : undefined,
    startCoord: normalizeCoord(trip.startCoord),
    endCoord: normalizeCoord(trip.endCoord),
  };
};

const geocodePlace = async (place) => {
  const query = String(place || "").trim();
  if (!query) {
    return undefined;
  }

  const cacheKey = query.toLowerCase();
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=1`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "NATPAC-WayNote/1.0",
      },
    });

    if (!response.ok) {
      geocodeCache.set(cacheKey, undefined);
      return undefined;
    }

    const data = await response.json();
    const first = Array.isArray(data) ? data[0] : undefined;
    const latitude = Number(first?.lat);
    const longitude = Number(first?.lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      geocodeCache.set(cacheKey, undefined);
      return undefined;
    }

    const coord = { latitude, longitude };
    geocodeCache.set(cacheKey, coord);
    return coord;
  } catch {
    geocodeCache.set(cacheKey, undefined);
    return undefined;
  }
};

const splitRoutePlaces = (route) => {
  const parts = String(route || "")
    .split("-")
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    start: parts[0],
    end: parts.length > 1 ? parts[parts.length - 1] : parts[0],
  };
};

export const backfillMissingTripCoordinates = async () => {
  const users = await readUsers();
  let hasChanges = false;

  for (const user of users) {
    if (user.role !== "user" || !Array.isArray(user.trips)) {
      continue;
    }

    for (let i = 0; i < user.trips.length; i += 1) {
      const originalTrip = user.trips[i];
      if (!originalTrip || typeof originalTrip !== "object") {
        continue;
      }

      const trip = normalizeTrip(originalTrip);
      if (!trip) {
        continue;
      }

      const hasStart = isValidCoord(trip.startCoord);
      const hasEnd = isValidCoord(trip.endCoord);
      if (hasStart && hasEnd) {
        continue;
      }

      const { start, end } = splitRoutePlaces(trip.route);
      const [startCoord, endCoord] = await Promise.all([
        hasStart ? Promise.resolve(trip.startCoord) : geocodePlace(start),
        hasEnd ? Promise.resolve(trip.endCoord) : geocodePlace(end),
      ]);

      if (startCoord || endCoord) {
        user.trips[i] = {
          ...trip,
          startCoord: startCoord || trip.startCoord,
          endCoord: endCoord || trip.endCoord,
        };
        hasChanges = true;
      }
    }
  }

  if (hasChanges) {
    await writeUsers(users);
  }

  return hasChanges;
};

export const getAllUsers = async () => readUsers();

export const findUserByEmail = async (email) => {
  const users = await readUsers();
  const target = normalizeEmail(email);
  return users.find((user) => normalizeEmail(user.email) === target) || null;
};

export const createUser = async ({ name, email, password, role = "user" }) => {
  const users = await readUsers();
  const normalizedEmail = normalizeEmail(email);

  const alreadyExists = users.some((user) => normalizeEmail(user.email) === normalizedEmail);
  if (alreadyExists) {
    throw new Error("USER_EXISTS");
  }

  const createdUser = {
    id: `u${Date.now()}`,
    name: String(name || "").trim() || normalizedEmail.split("@")[0],
    email: normalizedEmail,
    password: String(password || ""),
    role,
    trips: [],
  };

  users.push(createdUser);
  await writeUsers(users);

  return createdUser;
};

export const validateUserCredentials = async ({ email, password, role }) => {
  const users = await readUsers();
  const normalizedEmail = normalizeEmail(email);

  return (
    users.find(
      (user) =>
        normalizeEmail(user.email) === normalizedEmail &&
        user.password === String(password || "") &&
        user.role === role
    ) || null
  );
};

export const getTripsForUserByEmail = async (email) => {
  const user = await findUserByEmail(email);
  if (!user || user.role !== "user") {
    return null;
  }

  return Array.isArray(user.trips)
    ? user.trips
        .map((trip) => (typeof trip === "string" ? normalizeTrip({ route: trip }) : normalizeTrip(trip)))
        .filter(Boolean)
    : [];
};

export const addTripForUserByEmail = async (email, trip) => {
  const users = await readUsers();
  const target = normalizeEmail(email);

  const userIndex = users.findIndex(
    (user) => normalizeEmail(user.email) === target && user.role === "user"
  );

  if (userIndex === -1) {
    return null;
  }

  const normalizedTrip = normalizeTrip(trip);
  if (!normalizedTrip) {
    throw new Error("INVALID_TRIP");
  }

  const existingTrips = Array.isArray(users[userIndex].trips) ? users[userIndex].trips : [];
  users[userIndex].trips = [...existingTrips, normalizedTrip];

  await writeUsers(users);
  return normalizedTrip;
};

export const deleteTripForUserByEmail = async (email, tripId) => {
  const users = await readUsers();
  const target = normalizeEmail(email);

  const userIndex = users.findIndex(
    (user) => normalizeEmail(user.email) === target && user.role === "user"
  );

  if (userIndex === -1) {
    return { status: "user_not_found" };
  }

  const existingTrips = Array.isArray(users[userIndex].trips) ? users[userIndex].trips : [];
  const initialLength = existingTrips.length;
  users[userIndex].trips = existingTrips.filter((trip) => Number(trip?.id) !== Number(tripId));

  if (users[userIndex].trips.length === initialLength) {
    return { status: "trip_not_found" };
  }

  await writeUsers(users);
  return { status: "deleted" };
};

export const getHeatmapPointsFromUsers = async () => {
  const users = await readUsers();
  const counts = {};
  // ~55m cells at equator for better map fidelity.
  const cellSize = 0.0005;

  const gridKey = (latitude, longitude) => {
    const snappedLat = Math.round(latitude / cellSize) * cellSize;
    const snappedLon = Math.round(longitude / cellSize) * cellSize;
    return `${snappedLat.toFixed(5)},${snappedLon.toFixed(5)}`;
  };

  const addCoordToGrid = (coord, mode) => {
    if (!isValidCoord(coord)) {
      return;
    }

    const key = gridKey(Number(coord.latitude), Number(coord.longitude));
    if (!counts[key]) {
      counts[key] = {
        visits: 0,
        modeBreakdown: {},
        latSum: 0,
        lonSum: 0,
      };
    }

    const normalizedMode = String(mode || "other").trim().toLowerCase();
    counts[key].visits += 1;
    counts[key].latSum += Number(coord.latitude);
    counts[key].lonSum += Number(coord.longitude);
    counts[key].modeBreakdown[normalizedMode] =
      (counts[key].modeBreakdown[normalizedMode] || 0) + 1;
  };

  users
    .filter((user) => user.role === "user")
    .forEach((user) => {
      (user.trips || []).forEach((tripOrRoute) => {
        if (tripOrRoute && typeof tripOrRoute === "object") {
          const mode = String(tripOrRoute.mode || "other").trim().toLowerCase();
          addCoordToGrid(tripOrRoute.startCoord, mode);
          addCoordToGrid(tripOrRoute.endCoord, mode);
        }
      });
    });

  return Object.entries(counts)
    .map(([, stats]) => {
      let dominantMode = "other";
      let highest = 0;
      Object.entries(stats.modeBreakdown).forEach(([mode, count]) => {
        if (count > highest) {
          highest = count;
          dominantMode = mode;
        }
      });

      return {
        latitude: stats.latSum / stats.visits,
        longitude: stats.lonSum / stats.visits,
        visits: stats.visits,
        dominantMode,
        modeBreakdown: stats.modeBreakdown,
      };
    })
    .sort((a, b) => b.visits - a.visits);
};
