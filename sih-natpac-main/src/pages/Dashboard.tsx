import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";

const Dashboard = () => {
  const navigate = useNavigate();

  const statsData = [
    { label: "Total Trips Recorded", value: "0", period: "7 days" },
    { label: "Active Users", value: "0", period: "14 days" },
    { label: "Avg. Trips/User/Day", value: "0", period: "1 month" },
    { label: "Most Common Mode", value: "0", period: "6 months" },
  ];

  const periodButtons = ["7 days", "14 days", "1 month", "6 months", "1 year"];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card border-b">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
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
                  variant={index === 0 ? "default" : "ghost"}
                  size="sm"
                  className="text-xs whitespace-nowrap rounded-full"
                >
                  {period}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Heatmap Section */}
        <Card className="bg-card rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <select className="px-3 py-2 bg-muted rounded-lg text-sm">
                <option value="">Date</option>
              </select>
              <select className="px-3 py-2 bg-muted rounded-lg text-sm">
                <option value="">Month</option>
              </select>
              <select className="px-3 py-2 bg-muted rounded-lg text-sm">
                <option value="">Year</option>
              </select>
              <select className="px-3 py-2 bg-muted rounded-lg text-sm">
                <option value="">Hour</option>
              </select>
            </div>

            {/* Placeholder for heatmap */}
            <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="w-16 h-16 bg-background rounded-lg mx-auto mb-2 flex items-center justify-center">
                  📊
                </div>
                <p>Heatmap visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
