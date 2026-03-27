import { PlaceHeatPoint } from "@/lib/heatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TravelHeatmapProps {
  title?: string;
  points: PlaceHeatPoint[];
  maxItems?: number;
}

const getIntensityClass = (ratio: number) => {
  if (ratio >= 0.8) return "bg-red-500/90 text-white";
  if (ratio >= 0.6) return "bg-orange-500/80 text-white";
  if (ratio >= 0.4) return "bg-amber-400/85 text-black";
  if (ratio >= 0.2) return "bg-yellow-300/85 text-black";
  return "bg-lime-200/90 text-black";
};

const TravelHeatmap = ({ title = "Most Traveled Places", points, maxItems = 12 }: TravelHeatmapProps) => {
  const visiblePoints = points.slice(0, maxItems);
  const maxVisits = visiblePoints.length > 0 ? visiblePoints[0].visits : 0;

  return (
    <Card className="bg-card rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {visiblePoints.length === 0 ? (
          <div className="h-36 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            No trip data yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {visiblePoints.map((point) => {
              const ratio = maxVisits > 0 ? point.visits / maxVisits : 0;
              return (
                <div
                  key={point.place}
                  className={`rounded-xl p-3 transition-colors ${getIntensityClass(ratio)}`}
                >
                  <p className="text-sm font-semibold truncate">{point.place}</p>
                  <p className="text-xs mt-1 opacity-90">{point.visits} visits</p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TravelHeatmap;
