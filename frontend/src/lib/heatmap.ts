import type { TripDay } from "@/App";

export interface CoordinateHeatPoint {
  latitude: number;
  longitude: number;
  visits: number;
  dominantMode?: string;
  modeBreakdown?: Record<string, number>;
}

interface AggregateCell {
  visits: number;
  modeBreakdown: Record<string, number>;
  latSum: number;
  lonSum: number;
}

const isFiniteCoord = (lat: number, lon: number) =>
  Number.isFinite(lat) &&
  Number.isFinite(lon) &&
  lat >= -90 &&
  lat <= 90 &&
  lon >= -180 &&
  lon <= 180;

const gridKey = (lat: number, lon: number) => {
  // ~55m cells at equator for better positional fidelity than coarse 0.005-degree bins.
  const cellSize = 0.0005;
  const snappedLat = Math.round(lat / cellSize) * cellSize;
  const snappedLon = Math.round(lon / cellSize) * cellSize;
  return `${snappedLat.toFixed(5)},${snappedLon.toFixed(5)}`;
};

export const getCoordinateHeatPoints = (tripHistory: TripDay[]): CoordinateHeatPoint[] => {
  const counts: Record<string, AggregateCell> = {};

  tripHistory.forEach((day) => {
    day.trips.forEach((trip) => {
      const coords = [trip.startCoord, trip.endCoord].filter(Boolean);

      coords.forEach((coord) => {
        const latitude = coord?.latitude;
        const longitude = coord?.longitude;
        if (!isFiniteCoord(Number(latitude), Number(longitude))) {
          return;
        }

        const key = gridKey(Number(latitude), Number(longitude));
        if (!counts[key]) {
          counts[key] = {
            visits: 0,
            modeBreakdown: {},
            latSum: 0,
            lonSum: 0,
          };
        }

        const normalizedMode = String(trip.mode || "other").trim().toLowerCase();
        counts[key].visits += 1;
        counts[key].latSum += Number(latitude);
        counts[key].lonSum += Number(longitude);
        counts[key].modeBreakdown[normalizedMode] =
          (counts[key].modeBreakdown[normalizedMode] || 0) + 1;
      });
    });
  });

  return Object.entries(counts)
    .map(([key, stats]) => {
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
