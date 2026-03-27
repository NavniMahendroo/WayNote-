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
  speedMps?: number | null;
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
  const watchIdRef = useRef<number | null>(null);

  // Use number for browser setInterval
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isTracking) {
      startGPSTracking();
    } else {
      void stopGPSTracking();
    }

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [isTracking]);

  const haversineDistanceKm = (a: LocationData, b: LocationData) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);

    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
  };

  const inferModeFromSpeed = (points: LocationData[]) => {
    const speedsKmh: number[] = [];

    points.forEach((point) => {
      if (typeof point.speedMps === "number" && point.speedMps >= 0) {
        speedsKmh.push(point.speedMps * 3.6);
      }
    });

    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1];
      const curr = points[i];
      const deltaSeconds = (curr.timestamp - prev.timestamp) / 1000;
      if (deltaSeconds <= 0) {
        continue;
      }

      const distanceKm = haversineDistanceKm(prev, curr);
      const speedKmh = (distanceKm / deltaSeconds) * 3600;

      if (Number.isFinite(speedKmh) && speedKmh >= 0.5 && speedKmh <= 220) {
        speedsKmh.push(speedKmh);
      }
    }

    if (speedsKmh.length === 0) {
      return { mode: "walk", icon: "🚶" };
    }

    const sorted = [...speedsKmh].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];

    if (median <= 6) return { mode: "walk", icon: "🚶" };
    if (median <= 20) return { mode: "cycle", icon: "🚴" };
    if (median <= 50) return { mode: "bus", icon: "🚌" };
    if (median <= 90) return { mode: "car", icon: "🚗" };
    return { mode: "train", icon: "🚂" };
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );

      if (!response.ok) {
        throw new Error("geocode failed");
      }

      const data = await response.json();
      const address = data?.address || {};

      return (
        address.suburb ||
        address.neighbourhood ||
        address.city ||
        address.town ||
        address.village ||
        address.road ||
        data?.name ||
        `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
      );
    } catch {
      return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    }
  };

  const toClock = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

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
          speedMps: position.coords.speed,
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

    watchIdRef.current = watchPosition;
    toast.success("GPS tracking started!");
  };

  const stopGPSTracking = async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    if (intervalRef.current !== null) clearInterval(intervalRef.current);

    if (trackingData.length > 0 && startTimeRef.current) {
      const firstPoint = trackingData[0];
      const lastPoint = trackingData[trackingData.length - 1];
      const durationMinutes = Math.floor(elapsedSeconds / 60);
      const durationSeconds = elapsedSeconds % 60;
      const durationText = `${durationMinutes}m ${durationSeconds}s`;

      const [{ mode, icon }, fromLabel, toLabel] = await Promise.all([
        Promise.resolve(inferModeFromSpeed(trackingData)),
        reverseGeocode(firstPoint.latitude, firstPoint.longitude),
        reverseGeocode(lastPoint.latitude, lastPoint.longitude),
      ]);

      toast.success(`Trip recorded! Duration: ${durationText}`);

      const newTrip: Trip = {
        id: Date.now(),
        title: `${fromLabel} to ${toLabel}`,
        route: `${fromLabel} - ${toLabel}`,
        time: `${toClock(firstPoint.timestamp)} - ${toClock(lastPoint.timestamp)}`,
        mode,
        icon,
        notes: `Auto tracked (${trackingData.length} points, ${durationText})`,
        startCoord: {
          latitude: firstPoint.latitude,
          longitude: firstPoint.longitude,
        },
        endCoord: {
          latitude: lastPoint.latitude,
          longitude: lastPoint.longitude,
        },
      };

      onStopTracking(newTrip);
    }

    setTrackingData([]);
    setCurrentLocation(null);
    startTimeRef.current = null;
    setElapsedSeconds(0);
    watchIdRef.current = null;
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
