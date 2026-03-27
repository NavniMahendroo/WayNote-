import { ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BottomNavigation from "@/components/BottomNavigation";

interface SettingsProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Settings = ({ setIsAuthenticated }: SettingsProps) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  // Read latest name from localStorage
  const name = localStorage.getItem("name") || localStorage.getItem("username") || "User";

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const getInitials = (nameStr: string) => {
    if (!nameStr) return "U";
    const words = nameStr.split(" ");
    return words[0].charAt(0).toUpperCase() + (words[1] ? words[1].charAt(0).toUpperCase() : "");
  };

  const accountSettings = [
    { title: "Personal Information", icon: "👤", path: "/personal-information" },
    { title: "Data Collection Preferences", icon: "🔄", path: "/data-collection-preferences" }
  ];

  const appSettings = [
    { title: "Notifications", icon: "🔔", path: "/notifications-settings" },
    { title: "Units of Measurement", icon: "📏", path: "/units-of-measurement" }
  ];

  const handleLogout = () => {
    localStorage.setItem("isAuthenticated", "false");
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="flex items-center gap-3 p-4 bg-card border-b">
        <button onClick={() => navigate("/trip-recording")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="p-4 space-y-6">
        <Card className="bg-card rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/api/placeholder/64/64" />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{name}</h3>
              <button className="text-sm text-accent" onClick={() => navigate("/personal-information")}>
                View Profile
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold px-2">Account</h2>
          <Card className="bg-card rounded-2xl shadow-sm">
            <CardContent className="p-0">
              {accountSettings.map((setting, idx) => (
                <button key={idx} onClick={() => navigate(setting.path)} className="w-full flex items-center justify-between p-4 border-b last:border-b-0 border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{setting.icon}</span>
                    <span className="font-medium">{setting.title}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold px-2">App Settings</h2>
          <Card className="bg-card rounded-2xl shadow-sm">
            <CardContent className="p-0">
              {appSettings.map((setting, idx) => (
                <button key={idx} onClick={() => navigate(setting.path)} className="w-full flex items-center justify-between p-4 border-b last:border-b-0 border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{setting.icon}</span>
                    <span className="font-medium">{setting.title}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}

              <div className="w-full flex items-center justify-between p-4 border-t border-border">
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
            </CardContent>
          </Card>
        </div>

        <div className="pt-6">
          <Button variant="outline" onClick={handleLogout} className="w-full py-3 rounded-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
            Log Out
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Settings;
