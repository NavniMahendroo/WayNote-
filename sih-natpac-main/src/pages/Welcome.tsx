import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MapPin } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();
  const [consentGiven, setConsentGiven] = useState(false);

  const handleProceed = () => {
    if (consentGiven) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full bg-card rounded-2xl p-8 shadow-lg">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
            <MapPin className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-2">WayNote</h1>
        <h2 className="text-xl font-semibold text-center mb-6">
          Welcome to the NATPAC Travel Survey
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-center mb-8 leading-relaxed">
          This app collects travel data to help improve transportation planning in our community. Your 
          participation is voluntary and your data will be kept confidential.
        </p>

        {/* Consent Section */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4">Data Collection Consent</h3>
          <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
            <Switch
              checked={consentGiven}
              onCheckedChange={setConsentGiven}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                By granting consent, you agree to allow NATPAC to collect and use 
                your travel data for planning purposes.
              </p>
            </div>
          </div>

          <button className="text-sm text-accent mt-3 underline">
            Learn more about data usage
          </button>
        </div>

        {/* Proceed Button */}
        <Button
          onClick={handleProceed}
          disabled={!consentGiven}
          className="w-full bg-soft-blue hover:bg-soft-blue-hover text-soft-blue-foreground font-semibold py-3 rounded-full"
        >
          Proceed to Login
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          You can withdraw your consent at any time.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
