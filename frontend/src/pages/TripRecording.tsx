// TripRecording.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import ManualTripForm from "@/components/ManualTripForm";
import AutoTrackingManager from "@/components/AutoTrackingManager";
import { TripDay, Trip } from "../App";
import { formatDateLabel, saveUserTrip } from "@/lib/trips-api";
import { forwardGeocode } from "@/lib/geocoding";
import { toast } from "sonner";

interface TripRecordingProps {
  tripHistory: TripDay[];
  setTripHistory: React.Dispatch<React.SetStateAction<TripDay[]>>;
}

const TripRecording = ({ setTripHistory }: TripRecordingProps) => {
  const [isTracking, setIsTracking] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);

  const addTripToToday = (trip: Trip) => {
    const todayLabel = trip.dateLabel || formatDateLabel();

    setTripHistory((prev) => {
      const todayIndex = prev.findIndex((day) => day.date === todayLabel);
      const tripToAdd = { ...trip, dateLabel: todayLabel };

      if (todayIndex === -1) {
        return [
          {
            id: Date.now(),
            date: todayLabel,
            trips: [tripToAdd],
          },
          ...prev,
        ];
      }

      return prev.map((day, index) =>
        index === todayIndex
          ? { ...day, trips: [...day.trips, tripToAdd] }
          : day
      );
    });
  };

  const persistTrip = async (trip: Trip) => {
    const email = localStorage.getItem("email");
    if (!email) {
      return;
    }

    try {
      await saveUserTrip(email, trip);
    } catch {
      toast.error("Trip saved locally, but backend sync failed.");
    }
  };

  const handleAddAutoTrip = (autoTrip: Trip) => {
    const trip = {
      ...autoTrip,
      id: Date.now(),
      dateLabel: autoTrip.dateLabel || formatDateLabel(),
    };

    addTripToToday(trip);
    persistTrip(trip);
  };

  const handleAddManualTrip = async (trip: Trip) => {
    const [startLocation, endLocation] = trip.route.split("-").map((part) => part.trim());
    const [startCoord, endCoord] = await Promise.all([
      forwardGeocode(startLocation),
      forwardGeocode(endLocation),
    ]);

    const persistedTrip = {
      ...trip,
      id: Date.now(),
      dateLabel: formatDateLabel(),
      startCoord,
      endCoord,
    };

    addTripToToday(persistedTrip);
    persistTrip(persistedTrip);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 bg-card border-b">
        <h1 className="text-xl font-bold">NATPAC</h1>
      </div>

      <div className="p-4">
        <Card className="bg-card rounded-2xl shadow-sm mb-6">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold mb-6">Today's Trips</h2>

            <div className="flex justify-center mb-8">
              <div className="w-48 h-48 bg-muted rounded-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="w-16 h-16 bg-background rounded-lg mx-auto mb-3 flex items-center justify-center text-2xl">📍</div>
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold mb-2">No trips recorded yet</h3>
              <p className="text-muted-foreground text-sm">
                Start your first trip to contribute to better transportation planning.
              </p>
            </div>

            <div className="space-y-3">
              <AutoTrackingManager
                isTracking={isTracking}
                onTrackingChange={setIsTracking}
                onStopTracking={handleAddAutoTrip}
              />

              <Button
                variant="outline"
                onClick={() => setShowManualForm(true)}
                className="w-full py-4 rounded-full flex items-center justify-center gap-2 border-2"
              >
                <Plus className="w-5 h-5" />
                Add Trip Manually
              </Button>
            </div>
          </CardContent>
        </Card>

        <ManualTripForm
          isOpen={showManualForm}
          onOpenChange={setShowManualForm}
          onSave={(trip) => {
            void handleAddManualTrip(trip);
            setShowManualForm(false);
          }}
        />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default TripRecording;
