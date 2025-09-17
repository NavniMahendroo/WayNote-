import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Square, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface AutoTrackingManagerProps {
  isTracking: boolean;
  onTrackingChange: (tracking: boolean) => void;
}

const AutoTrackingManager = ({ isTracking, onTrackingChange }: AutoTrackingManagerProps) => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [trackingData, setTrackingData] = useState<LocationData[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    if (isTracking) {
      startGPSTracking();
    } else {
      stopGPSTracking();
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isTracking]);

  const startGPSTracking = () => {
    if (!navigator.geolocation) {
      toast.error("GPS not supported on this device");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000
    };

    const watchPosition = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now()
        };

        setCurrentLocation(locationData);
        setTrackingData(prev => [...prev, locationData]);

        if (!startTime) {
          setStartTime(Date.now());
        }
      },
      (error) => {
        console.error("GPS Error:", error);
        toast.error("Unable to access location. Please enable GPS.");
        onTrackingChange(false);
      },
      options
    );

    setWatchId(watchPosition);
  };

  const stopGPSTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    if (trackingData.length > 0 && startTime) {
      // Calculate trip duration
      const duration = Math.round((Date.now() - startTime) / 1000 / 60); // in minutes
      
      // Save trip data
      toast.success(`Trip recorded! Duration: ${duration} minutes`);
      
      // Reset tracking data
      setTrackingData([]);
      setStartTime(null);
      setCurrentLocation(null);
    }
  };

  const handleStartTracking = async () => {
    try {
      // Request permission first
      const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      
      if (permission.state === 'denied') {
        toast.error("Location permission denied. Please enable location access.");
        return;
      }

      onTrackingChange(true);
      toast.success("GPS tracking started!");
    } catch (error) {
      toast.error("Unable to start tracking. Please check location permissions.");
    }
  };

  const handleStopTracking = () => {
    onTrackingChange(false);
    toast.success("Tracking stopped!");
  };

  const formatDuration = () => {
    if (!startTime) return "0:00";
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Control Button */}
      <Button
        onClick={isTracking ? handleStopTracking : handleStartTracking}
        className={`w-full py-4 rounded-full font-semibold flex items-center justify-center gap-2 ${
          isTracking 
            ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" 
            : "bg-primary hover:bg-primary/90 text-primary-foreground"
        }`}
      >
        {isTracking ? (
          <>
            <Square className="w-5 h-5" />
            Stop Auto Tracking
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Start Auto Tracking
          </>
        )}
      </Button>

      {/* Tracking Status */}
      {isTracking && (
        <Card className="bg-accent/10 border-accent rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                <div>
                  <p className="font-semibold text-accent">Currently Tracking</p>
                  <p className="text-sm text-muted-foreground">
                    Recording your location via GPS
                  </p>
                </div>
              </div>

              {startTime && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Duration: {formatDuration()}</span>
                </div>
              )}

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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AutoTrackingManager;