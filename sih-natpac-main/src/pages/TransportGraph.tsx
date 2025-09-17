import { ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const TransportGraph = () => {
  const navigate = useNavigate();

  // Default values are all 0
  const actualData = [
    { name: "Car", value: 0, color: "#3B82F6" },
    { name: "Bus", value: 0, color: "#06B6D4" },
    { name: "Walk", value: 0, color: "#10B981" },
    { name: "Bike", value: 0, color: "#8B5CF6" },
    { name: "Other", value: 0, color: "#F59E0B" },
  ];

  // later you will update `actualData` values from your trip records when trips happen

  const totalTrips = actualData.reduce((sum, item) => sum + item.value, 0);

  const displayData =
    totalTrips === 0
      ? [{ name: "No Data", value: 100, color: "black" }]
      : actualData;

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
              <button className="flex items-center text-sm text-muted-foreground">
                Last Month <ChevronDown className="w-4 h-4 ml-1" />
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
              {actualData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        totalTrips === 0 ? "black" : item.color,
                    }}
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
