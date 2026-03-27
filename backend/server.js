import express from "express";
import cors from "cors";
import {
  addTripForUserByEmail,
  backfillMissingTripCoordinates,
  createUser,
  deleteTripForUserByEmail,
  getAllUsers,
  getHeatmapPointsFromUsers,
  getTripsForUserByEmail,
  validateUserCredentials,
} from "./database/users-db.js";

const app = express();
const PORT = process.env.PORT || 4000;
const GOVERNMENT_EMAIL = process.env.GOVERNMENT_EMAIL || "govt@natpac.app";
const GOVERNMENT_PASSWORD = process.env.GOVERNMENT_PASSWORD || "govt123";
const GOVERNMENT_NAME = process.env.GOVERNMENT_NAME || "Government Admin";

app.use(cors());
app.use(express.json());
app.use((_, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email and password are required" });
  }

  try {
    const createdUser = await createUser({
      name,
      email,
      password,
      role: "user",
    });

    return res.status(201).json({
      message: "account created",
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_EXISTS") {
      return res.status(409).json({ message: "account already exists" });
    }

    return res.status(500).json({ message: "failed to create account" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password, role } = req.body || {};

  if (!email || !password || !role) {
    return res.status(400).json({ message: "email, password and role are required" });
  }

  if (!["user", "government"].includes(role)) {
    return res.status(400).json({ message: "invalid role" });
  }

  if (role === "government") {
    const isGovLogin =
      String(email || "").trim().toLowerCase() === GOVERNMENT_EMAIL.toLowerCase() &&
      String(password || "") === GOVERNMENT_PASSWORD;

    if (!isGovLogin) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    return res.json({
      message: "login successful",
      user: {
        id: "government",
        name: GOVERNMENT_NAME,
        email: GOVERNMENT_EMAIL,
        role: "government",
      },
    });
  }

  const matchedUser = await validateUserCredentials({ email, password, role });
  if (!matchedUser) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  return res.json({
    message: "login successful",
    user: {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
    },
  });
});

app.get("/api/user/trips", async (req, res) => {
  await backfillMissingTripCoordinates();

  const email = String(req.query.email || "").trim();
  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }

  const trips = await getTripsForUserByEmail(email);
  if (trips === null) {
    return res.status(404).json({ message: "user not found" });
  }

  return res.json({ trips });
});

app.post("/api/user/trips", async (req, res) => {
  const { email, trip } = req.body || {};
  if (!email || !trip) {
    return res.status(400).json({ message: "email and trip are required" });
  }

  try {
    const createdTrip = await addTripForUserByEmail(email, trip);
    if (!createdTrip) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(201).json({ trip: createdTrip });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_TRIP") {
      return res.status(400).json({ message: "invalid trip payload" });
    }

    return res.status(500).json({ message: "failed to save trip" });
  }
});

app.delete("/api/user/trips/:tripId", async (req, res) => {
  const email = String(req.query.email || "").trim();
  const tripId = Number(req.params.tripId);

  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }

  if (!Number.isFinite(tripId)) {
    return res.status(400).json({ message: "valid tripId is required" });
  }

  const result = await deleteTripForUserByEmail(email, tripId);
  if (result.status === "user_not_found") {
    return res.status(404).json({ message: "user not found" });
  }
  if (result.status === "trip_not_found") {
    return res.status(404).json({ message: "trip not found" });
  }

  return res.json({ message: "trip deleted" });
});

app.get("/api/admin/users", async (_, res) => {
  const users = await getAllUsers();
  const userSummaries = users
    .filter((user) => user.role === "user")
    .map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    totalTrips: user.trips.length,
  }));

  res.json({ users: userSummaries });
});

app.get("/api/admin/heatmap", async (_, res) => {
  await backfillMissingTripCoordinates();
  res.json({ points: await getHeatmapPointsFromUsers() });
});

app.listen(PORT, () => {
  console.log(`NATPAC backend listening on http://localhost:${PORT}`);
});
