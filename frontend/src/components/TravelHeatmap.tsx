import { useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet.heat";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import type { CoordinateHeatPoint } from "@/lib/heatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TravelHeatmapProps {
  title?: string;
  points: CoordinateHeatPoint[];
  maxItems?: number;
}

const formatMode = (mode?: string) => {
  if (!mode) return "Unknown";
  return mode.charAt(0).toUpperCase() + mode.slice(1);
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const INDIA_BOUNDS = L.latLngBounds([6.0, 68.0], [37.8, 97.6]);

const HeatLayer = ({ points }: { points: CoordinateHeatPoint[] }) => {
  const map = useMap();

  const heatData = useMemo(() => {
    const maxVisits = points.length > 0 ? points[0].visits : 1;
    return points.map((point) => [
      point.latitude,
      point.longitude,
      clamp(point.visits / maxVisits, 0.2, 1),
    ] as [number, number, number]);
  }, [points]);

  useEffect(() => {
    const heatLayer = (L as unknown as {
      heatLayer: (latlngs: [number, number, number][], options: object) => L.Layer;
    }).heatLayer(heatData, {
      radius: 26,
      blur: 22,
      maxZoom: 12,
      minOpacity: 0.45,
      gradient: {
        0.2: "#60a5fa",
        0.4: "#22d3ee",
        0.6: "#84cc16",
        0.8: "#f59e0b",
        1.0: "#ef4444",
      },
    });

    heatLayer.addTo(map);
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [heatData, map]);

  return null;
};

const FitMapToPoints = ({ points }: { points: CoordinateHeatPoint[] }) => {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) {
      map.fitBounds(INDIA_BOUNDS, { animate: false, padding: [24, 24] });
      return;
    }

    const bounds = L.latLngBounds([]);
    points.forEach((point) => {
      bounds.extend([point.latitude, point.longitude]);
    });

    map.fitBounds(bounds.pad(0.35), {
      animate: false,
      padding: [24, 24],
      maxZoom: 11,
    });
  }, [map, points]);

  return null;
};

const TravelHeatmap = ({ title = "Most Traveled Places", points, maxItems }: TravelHeatmapProps) => {
  const visiblePoints = typeof maxItems === "number" ? points.slice(0, maxItems) : points;

  return (
    <Card className="bg-card rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative h-[360px] rounded-xl overflow-hidden border border-border">
            <MapContainer
              center={[22.9734, 78.6569]}
              zoom={4}
              minZoom={4}
              maxZoom={17}
              maxBounds={INDIA_BOUNDS}
              maxBoundsViscosity={0.7}
              className="h-full w-full"
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />

              <FitMapToPoints points={visiblePoints} />
              {visiblePoints.length > 0 && <HeatLayer points={visiblePoints} />}
            </MapContainer>

            {visiblePoints.length === 0 && (
              <div className="absolute inset-0 bg-background/70 flex items-center justify-center text-sm text-muted-foreground">
                No coordinate points yet. Record trips to see heat density.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
            {visiblePoints.slice(0, 6).map((point, idx) => (
              <div key={`legend-${idx}`} className="rounded-md border border-border p-2">
                <p>
                  {point.latitude.toFixed(5)}, {point.longitude.toFixed(5)} • {point.visits} visits
                </p>
                <p className="mt-1">Mode: {formatMode(point.dominantMode)}</p>
                {point.modeBreakdown && (
                  <p className="mt-1">
                    Mix: {Object.entries(point.modeBreakdown)
                      .map(([mode, count]) => `${formatMode(mode)} ${count}`)
                      .join(" • ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelHeatmap;
