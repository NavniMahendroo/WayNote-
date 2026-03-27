import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TripDay } from "@/App";
import TravelHeatmap from "@/components/TravelHeatmap";
import { PlaceHeatPoint } from "@/lib/heatmap";
import { toast } from "sonner";

interface GovernmentDashboardProps {
  tripHistory: TripDay[];
}

interface UserSummary {
  id: string;
  name: string;
  email: string;
  role?: string;
  totalTrips: number;
}

const GovernmentDashboard = ({ tripHistory }: GovernmentDashboardProps) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [heatPoints, setHeatPoints] = useState<PlaceHeatPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendUnavailable, setBackendUnavailable] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [usersRes, heatmapRes] = await Promise.all([
          fetch("http://localhost:4000/api/admin/users"),
          fetch("http://localhost:4000/api/admin/heatmap"),
        ]);

        if (!usersRes.ok || !heatmapRes.ok) {
          throw new Error("backend unavailable");
        }

        const usersData = await usersRes.json();
        const heatmapData = await heatmapRes.json();

        setUsers(usersData.users || []);
        setHeatPoints(heatmapData.points || []);
        setBackendUnavailable(false);
      } catch {
        setUsers([]);
        setHeatPoints([]);
        setBackendUnavailable(true);
        toast.error("Backend is unavailable. Government dashboard shows only live backend data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [tripHistory]);

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="flex items-center justify-between bg-card border rounded-xl p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Government Dashboard</h1>
        </div>
        <Button variant="outline" onClick={() => navigate("/login")}>Switch Account</Button>
      </div>

      <Card className="bg-card rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Registered Accounts ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {backendUnavailable && (
            <p className="text-sm text-destructive mb-3">Live backend connection required to load accounts.</p>
          )}
          {loading ? (
            <p className="text-muted-foreground">Loading user data...</p>
          ) : users.length === 0 ? (
            <p className="text-muted-foreground">No active users found.</p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="rounded-lg border border-border p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">Role: {user.role || "user"}</p>
                  </div>
                  <p className="text-sm font-medium">{user.totalTrips} trips</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TravelHeatmap
        title="Most Traveled Places (All Users)"
        points={heatPoints}
      />
    </div>
  );
};

export default GovernmentDashboard;
