import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const NotificationsSettings = () => {
  const navigate = useNavigate();

  // Initialize state from localStorage
  const [tripReminders, setTripReminders] = useState(() => {
    return localStorage.getItem("tripReminders") === "true";
  });
  const [generalNotifications, setGeneralNotifications] = useState(() => {
    return localStorage.getItem("generalNotifications") === "true";
  });
  const [appUpdates, setAppUpdates] = useState(() => {
    return localStorage.getItem("appUpdates") === "true";
  });
  const [promotions, setPromotions] = useState(() => {
    return localStorage.getItem("promotions") === "true";
  });

  // Persist changes to localStorage
  useEffect(() => {
    localStorage.setItem("tripReminders", String(tripReminders));
  }, [tripReminders]);

  useEffect(() => {
    localStorage.setItem("generalNotifications", String(generalNotifications));
  }, [generalNotifications]);

  useEffect(() => {
    localStorage.setItem("appUpdates", String(appUpdates));
  }, [appUpdates]);

  useEffect(() => {
    localStorage.setItem("promotions", String(promotions));
  }, [promotions]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-card border-b">
        <button onClick={() => navigate("/settings")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Notifications</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Notification Categories */}
        <Card className="bg-card rounded-2xl shadow-sm">
          <CardContent className="p-0">
            <div className="space-y-4 p-6">
              {/* Trip Reminders */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="trip-reminders" className="font-medium">Trip Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders to start and end your trips
                  </p>
                </div>
                <Switch
                  id="trip-reminders"
                  checked={tripReminders}
                  onCheckedChange={setTripReminders}
                />
              </div>

              {/* General Notifications */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="general" className="font-medium">General Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about important updates
                    </p>
                  </div>
                  <Switch
                    id="general"
                    checked={generalNotifications}
                    onCheckedChange={setGeneralNotifications}
                  />
                </div>
              </div>

              {/* App Updates */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="app-updates" className="font-medium">App Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts for new features
                    </p>
                  </div>
                  <Switch
                    id="app-updates"
                    checked={appUpdates}
                    onCheckedChange={setAppUpdates}
                  />
                </div>
              </div>

              {/* Promotions */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="promotions" className="font-medium">Promotions</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about special offers
                    </p>
                  </div>
                  <Switch
                    id="promotions"
                    checked={promotions}
                    onCheckedChange={setPromotions}
                  />
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsSettings;
