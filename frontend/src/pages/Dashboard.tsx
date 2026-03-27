import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";
import TravelHeatmap from "@/components/TravelHeatmap";
import { getCoordinateHeatPoints } from "@/lib/heatmap";

interface Trip {
  id: number;
  title: string;
  route: string;
  time: string;
  mode: string;
  icon: string;
}

interface TripDay {
  id: number;
  date: string;
  trips: Trip[];
}

interface DashboardProps {
  tripHistory: TripDay[];
}

const Dashboard = ({ tripHistory }: DashboardProps) => {
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState("7 days");

  // Calculate stats dynamically
  const statsData = useMemo(() => {
    const allTrips = tripHistory.flatMap(day => day.trips);
    const modeCounts: Record<string, number> = {};
    allTrips.forEach(trip => {
      modeCounts[trip.mode] = (modeCounts[trip.mode] || 0) + 1;
    });

    let mostCommonMode = "N/A";
    let maxCount = 0;
    Object.entries(modeCounts).forEach(([mode, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonMode = mode;
      }
    });

    return [
      { label: "Total Trips Recorded", value: allTrips.length.toString(), period: "all" },
      { label: "Active Users", value: "1", period: "all" }, // Single user for now
      { label: "Avg. Trips/User/Day", value: (allTrips.length / tripHistory.length).toFixed(1), period: "all" },
      { label: "Most Common Mode", value: mostCommonMode, period: "all" },
    ];
  }, [tripHistory]);

  const periodButtons = ["7 days", "14 days", "1 month", "6 months", "1 year"];
  const heatPoints = useMemo(() => getCoordinateHeatPoints(tripHistory), [tripHistory]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card border-b">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">User Dashboard</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Overview Section */}
        <Card className="bg-card rounded-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {statsData.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {index === 3 && (
                    <button
                      onClick={() => navigate("/transport-graph")}
                      className="flex items-center text-sm text-accent"
                    >
                      View details <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Period Selector */}
            <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
              {periodButtons.map((period, index) => (
                <Button
                  key={period}
                  variant={activePeriod === period ? "default" : "ghost"}
                  size="sm"
                  className="text-xs whitespace-nowrap rounded-full"
                  onClick={() => setActivePeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Showing insights for: {activePeriod}</p>
          </CardContent>
        </Card>

        <TravelHeatmap title="Travel Density Heatmap (You)" points={heatPoints} />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
