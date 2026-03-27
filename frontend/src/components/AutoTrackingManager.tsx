// AutoTrackingManager.tsx
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Square, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { Trip } from "../App";

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface AutoTrackingManagerProps {
  isTracking: boolean;
  onTrackingChange: (tracking: boolean) => void;
  onStopTracking: (trip: Trip) => void;
}

const AutoTrackingManager = ({
  isTracking,
  onTrackingChange,
  onStopTracking,
}: AutoTrackingManagerProps) => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [trackingData, setTrackingData] = useState<LocationData[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0); // live duration
  const startTimeRef = useRef<number | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Use number for browser setInterval
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isTracking) startGPSTracking();
    else stopGPSTracking();

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [isTracking]);

  const startGPSTracking = () => {
    if (!navigator.geolocation) {
      toast.error("GPS not supported on this device");
      return;
    }

    const now = Date.now();
    startTimeRef.current = now;
    setElapsedSeconds(0);

    // Start live duration counter
    intervalRef.current = window.setInterval(() => {
      if (startTimeRef.current) {
        setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);

    const watchPosition = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now(),
        };
        setCurrentLocation(locationData);
        setTrackingData((prev) => [...prev, locationData]);
      },
      (error) => {
        console.error(error);
        toast.error("Unable to access location. Enable GPS.");
        onTrackingChange(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
    );

    setWatchId(watchPosition);
    toast.success("GPS tracking started!");
  };

  const stopGPSTracking = () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    if (intervalRef.current !== null) clearInterval(intervalRef.current);

    if (trackingData.length > 0 && startTimeRef.current) {
      const durationMinutes = Math.floor(elapsedSeconds / 60);
      const durationSeconds = elapsedSeconds % 60;
      const durationText = `${durationMinutes}m ${durationSeconds}s`;

      toast.success(`Trip recorded! Duration: ${durationText}`);

      const newTrip: Trip = {
        id: Date.now(),
        title: "Auto Trip",
        route: `Recorded ${trackingData.length} points`,
        time: durationText,
        mode: "auto",
        icon: "🚌",
      };

      onStopTracking(newTrip);
    }

    setTrackingData([]);
    setCurrentLocation(null);
    startTimeRef.current = null;
    setElapsedSeconds(0);
    setWatchId(null);
  };

  const handleStartStop = () => {
    onTrackingChange(!isTracking);
  };

  const formatDuration = () => {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleStartStop}
        className={`w-full py-4 rounded-full font-semibold flex items-center justify-center gap-2 ${
          isTracking ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
        }`}
      >
        {isTracking ? (
          <>
            <Square className="w-5 h-5" /> Stop Auto Tracking
          </>
        ) : (
          <>
            <Play className="w-5 h-5" /> Start Auto Tracking
          </>
        )}
      </Button>

      {isTracking && (
        <Card className="bg-accent/10 border-accent rounded-2xl shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
              <div>
                <p className="font-semibold text-accent">Currently Tracking</p>
                <p className="text-sm text-muted-foreground">Recording your location via GPS</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>Duration: {formatDuration()}</span>
            </div>

            {currentLocation && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                <span>
                  {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </span>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Points recorded: {trackingData.length}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AutoTrackingManager;
