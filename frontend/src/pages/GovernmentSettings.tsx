import { ArrowLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface GovernmentSettingsProps {
  setIsAuthenticated: (value: boolean) => void;
}

const REFRESH_OPTIONS = [15, 30, 60, 120];

const GovernmentSettings = ({ setIsAuthenticated }: GovernmentSettingsProps) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [refreshIntervalSeconds, setRefreshIntervalSeconds] = useState<number>(() => {
    const stored = Number(localStorage.getItem("govDashboardRefreshSeconds"));
    return Number.isFinite(stored) && stored > 0 ? stored : 30;
  });

  const name = localStorage.getItem("name") || "Government Admin";
  const email = localStorage.getItem("email") || "govt@natpac.app";

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("govDashboardRefreshSeconds", String(refreshIntervalSeconds));
  }, [refreshIntervalSeconds]);

  const initials = useMemo(() => {
    const chunks = name.split(" ").filter(Boolean);
    if (chunks.length === 0) return "GA";
    if (chunks.length === 1) return chunks[0].slice(0, 2).toUpperCase();
    return `${chunks[0].charAt(0)}${chunks[1].charAt(0)}`.toUpperCase();
  }, [name]);

  const handleLogout = () => {
    localStorage.setItem("isAuthenticated", "false");
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="flex items-center gap-3 bg-card border rounded-xl p-4">
        <button onClick={() => navigate("/gov-dashboard")}> 
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Government Settings</h1>
      </div>

      <Card className="bg-card rounded-2xl shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <Avatar className="w-14 h-14">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">{name}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card rounded-2xl shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="text-xl">🌙</span>
              <span className="font-medium">Dark Mode</span>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={(enabled) => {
                setDarkMode(enabled);
                toast.success(enabled ? "Dark mode enabled" : "Light mode enabled");
              }}
            />
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">⏱️</span>
                <span className="font-medium">Dashboard Auto Refresh</span>
              </div>
              <span className="text-sm text-muted-foreground">Every {refreshIntervalSeconds}s</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {REFRESH_OPTIONS.map((seconds) => (
                <Button
                  key={seconds}
                  type="button"
                  variant={refreshIntervalSeconds === seconds ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => {
                    setRefreshIntervalSeconds(seconds);
                    toast.success(`Government dashboard will refresh every ${seconds}s`);
                  }}
                >
                  {seconds}s
                </Button>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate("/gov-dashboard")}
            className="w-full flex items-center justify-between p-4 border-t border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📊</span>
              <span className="font-medium">Back to Government Dashboard</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        onClick={handleLogout}
        className="w-full py-3 rounded-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
      >
        Log Out
      </Button>
    </div>
  );
};

export default GovernmentSettings;
