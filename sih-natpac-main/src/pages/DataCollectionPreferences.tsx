import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const DataCollectionPreferences = () => {
  const navigate = useNavigate();
  const [autoTracking, setAutoTracking] = useState(true);
  const [anonymizeData, setAnonymizeData] = useState(false);
  const [dataConsent, setDataConsent] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-card border-b">
        <button onClick={() => navigate("/settings")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Data Collection Preferences</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Tracking Settings */}
        <Card className="bg-card rounded-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Tracking Settings</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage how your trip data is collected automatically.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-tracking" className="font-medium">Enable Auto-Tracking</Label>
                <p className="text-sm text-muted-foreground">Automatically record your trips</p>
              </div>
              <Switch 
                id="auto-tracking"
                checked={autoTracking}
                onCheckedChange={setAutoTracking}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="bg-card rounded-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Privacy Settings</CardTitle>
            <p className="text-sm text-muted-foreground">
              Control how your personal data is handled.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="anonymize" className="font-medium">Anonymize My Data</Label>
                <p className="text-sm text-muted-foreground">Remove personal identifiers from your trip data</p>
              </div>
              <Switch 
                id="anonymize"
                checked={anonymizeData}
                onCheckedChange={setAnonymizeData}
              />
            </div>
          </CardContent>
        </Card>

        {/* Consent */}
        <Card className="bg-card rounded-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Consent</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage your data collection agreement.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="consent" className="font-medium">Data Collection Consent</Label>
                <p className="text-sm text-muted-foreground">Enable to allow data collection</p>
              </div>
              <Switch 
                id="consent"
                checked={dataConsent}
                onCheckedChange={setDataConsent}
              />
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                You have consented to data collection. You can revoke consent at any time which will stop all future data collection.{" "}
                <button className="text-accent hover:underline">Learn more</button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button className="w-full py-3 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default DataCollectionPreferences;