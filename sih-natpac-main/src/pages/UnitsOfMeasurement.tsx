import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const UnitsOfMeasurement = () => {
  const navigate = useNavigate();

  // Initialize from localStorage or default
  const [distance, setDistance] = useState<string>("kilometers");
  const [speed, setSpeed] = useState<string>("kmh");
  const [timeFormat, setTimeFormat] = useState<string>("24hour");

  // Load saved values once
  useEffect(() => {
    const storedDistance = localStorage.getItem("distance");
    const storedSpeed = localStorage.getItem("speed");
    const storedTime = localStorage.getItem("timeFormat");

    if (storedDistance) setDistance(storedDistance);
    if (storedSpeed) setSpeed(storedSpeed);
    if (storedTime) setTimeFormat(storedTime);
  }, []);

  // Save changes whenever state updates
  useEffect(() => { localStorage.setItem("distance", distance); }, [distance]);
  useEffect(() => { localStorage.setItem("speed", speed); }, [speed]);
  useEffect(() => { localStorage.setItem("timeFormat", timeFormat); }, [timeFormat]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-card border-b">
        <button onClick={() => navigate("/settings")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Units of Measurement</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Distance */}
        <Card className="bg-card rounded-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={distance} onValueChange={setDistance}>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="kilometers" id="km" />
                <Label htmlFor="km" className="font-medium">Kilometers (km)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="miles" id="miles" />
                <Label htmlFor="miles" className="font-medium">Miles (mi)</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Speed */}
        <Card className="bg-card rounded-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={speed} onValueChange={setSpeed}>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="kmh" id="kmh" />
                <Label htmlFor="kmh" className="font-medium">Kilometers per hour (km/h)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="mph" id="mph" />
                <Label htmlFor="mph" className="font-medium">Miles per hour (mph)</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Time Format */}
        <Card className="bg-card rounded-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Time Format</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={timeFormat} onValueChange={setTimeFormat}>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="24hour" id="24hour" />
                <Label htmlFor="24hour" className="font-medium">24-hour clock</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="12hour" id="12hour" />
                <Label htmlFor="12hour" className="font-medium">12-hour clock (AM/PM)</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnitsOfMeasurement;
