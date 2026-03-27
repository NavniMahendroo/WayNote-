import type { TripDay } from "@/App";

export interface PlaceHeatPoint {
  place: string;
  visits: number;
}

const normalizePlace = (rawPlace: string) =>
  rawPlace
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const getPlaceHeatPoints = (tripHistory: TripDay[]): PlaceHeatPoint[] => {
  const counts: Record<string, number> = {};

  tripHistory.forEach((day) => {
    day.trips.forEach((trip) => {
      const routeParts = trip.route
        .split("-")
        .map(normalizePlace)
        .filter(Boolean);

      routeParts.forEach((place) => {
        counts[place] = (counts[place] || 0) + 1;
      });
    });
  });

  return Object.entries(counts)
    .map(([place, visits]) => ({ place, visits }))
    .sort((a, b) => b.visits - a.visits);
};
