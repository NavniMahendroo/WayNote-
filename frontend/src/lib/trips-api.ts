import type { Trip, TripDay } from "@/App";

const API_BASE = "http://localhost:4000";

export const formatDateLabel = (date = new Date()) => {
  const dayLabel = date.toDateString() === new Date().toDateString() ? "TODAY" : "DAY";
  const formatted = date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/\s/g, " ")
    .toUpperCase();

  return `${dayLabel} - ${formatted}`;
};

export const groupTripsByDateLabel = (trips: Trip[]): TripDay[] => {
  const grouped = new Map<string, Trip[]>();

  trips.forEach((trip) => {
    const dateLabel = trip.dateLabel || formatDateLabel();
    if (!grouped.has(dateLabel)) {
      grouped.set(dateLabel, []);
    }
    grouped.get(dateLabel)?.push(trip);
  });

  return Array.from(grouped.entries()).map(([date, groupedTrips], index) => ({
    id: index + 1,
    date,
    trips: groupedTrips.sort((a, b) => b.id - a.id),
  }));
};

export const fetchUserTrips = async (email: string): Promise<Trip[]> => {
  const query = encodeURIComponent(email);
  const response = await fetch(`${API_BASE}/api/user/trips?email=${query}`, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error("failed to fetch user trips");
  }

  const data = await response.json();
  return Array.isArray(data?.trips) ? data.trips : [];
};

export const saveUserTrip = async (email: string, trip: Trip): Promise<Trip> => {
  const response = await fetch(`${API_BASE}/api/user/trips`, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, trip }),
  });

  if (!response.ok) {
    throw new Error("failed to save trip");
  }

  const data = await response.json();
  return data?.trip as Trip;
};

export const deleteUserTrip = async (email: string, tripId: number): Promise<void> => {
  const query = encodeURIComponent(email);
  const response = await fetch(`${API_BASE}/api/user/trips/${tripId}?email=${query}`, {
    method: "DELETE",
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error("failed to delete trip");
  }
};
