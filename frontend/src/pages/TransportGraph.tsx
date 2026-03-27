import { ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

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

interface TransportGraphProps {
  tripHistory: TripDay[];
}

const TransportGraph = ({ tripHistory }: TransportGraphProps) => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("Last Month");

  const modeColors: Record<string, string> = {
    car: "#3B82F6",
    bus: "#06B6D4",
    walk: "#0be49cff",
    cycle: "#8B5CF6",
    train: "#F87171",
    motorcycle: "#ffda7eff",
    other: "#ef9700ff",
  };

  // map alternate names to standard modes
  const modeAlias: Record<string, string> = {
    cycling: "cycle",
    bike: "motorcycle",
    walking: "walk",
  };

  // Count trips per mode
  const modeCounts: Record<string, number> = {};
  tripHistory.forEach(day => {
    day.trips.forEach(trip => {
      const normalizedMode = trip.mode.toLowerCase().trim();
      const resolvedMode = modeAlias[normalizedMode] || normalizedMode;
      const key = resolvedMode in modeColors ? resolvedMode : "other";
      modeCounts[key] = (modeCounts[key] || 0) + 1;
    });
  });

  // Pie chart data for used modes
  const pieData = Object.keys(modeCounts)
    .filter(mode => modeCounts[mode] > 0)
    .map(mode => ({
      name: mode.charAt(0).toUpperCase() + mode.slice(1),
      value: modeCounts[mode],
      color: modeColors[mode] || modeColors["other"],
    }));

  // Legend: separate used and unused
  const usedLegend = Object.keys(modeColors)
    .filter(mode => (modeCounts[mode] || 0) > 0)
    .map(mode => ({
      name: mode.charAt(0).toUpperCase() + mode.slice(1),
      value: modeCounts[mode],
      color: modeColors[mode],
    }));

  const unusedLegend = Object.keys(modeColors)
    .filter(mode => !modeCounts[mode] || modeCounts[mode] === 0)
    .map(mode => ({
      name: mode.charAt(0).toUpperCase() + mode.slice(1),
      value: 0,
      color: modeColors[mode],
    }));

  const legendData = [...usedLegend, ...unusedLegend];

  const totalTrips = pieData.reduce((sum, item) => sum + item.value, 0);
  const displayData =
    totalTrips === 0
      ? [{ name: "No Data", value: 100, color: "black" }]
      : pieData;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card border-b">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Most Common Mode</h1>
        </div>
      </div>

      <div className="p-4">
        <Card className="bg-card rounded-2xl shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Overall</CardTitle>
              <button
                className="flex items-center text-sm text-muted-foreground"
                onClick={() => {
                  const nextPeriod = period === "Last Month" ? "Last 3 Months" : "Last Month";
                  setPeriod(nextPeriod);
                  toast.success(`Showing data for ${nextPeriod}`);
                }}
              >
                {period} <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Pie Chart */}
            <div className="relative h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {displayData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Total */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">{totalTrips}</p>
                  <p className="text-sm text-muted-foreground">Trips</p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-3">
              {legendData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {totalTrips > 0
                      ? ((item.value / totalTrips) * 100).toFixed(1) + "%"
                      : "0%"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default TransportGraph;
