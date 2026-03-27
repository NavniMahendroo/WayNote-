// TripHistory.tsx
import { useState } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";
import ManualTripForm from "../components/ManualTripForm";
import { TripDay, Trip } from "../App";

interface TripHistoryProps {
  tripHistory: TripDay[];
  setTripHistory: React.Dispatch<React.SetStateAction<TripDay[]>>;
}

const TripHistory = ({ tripHistory, setTripHistory }: TripHistoryProps) => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isManualFormOpen, setManualFormOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const handleMenuToggle = (tripId: number) => setOpenMenuId(openMenuId === tripId ? null : tripId);

  const handleEditTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setManualFormOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteTrip = (tripId: number) => {
    const updatedHistory = tripHistory.map((day) => ({
      ...day,
      trips: day.trips.filter((trip) => trip.id !== tripId),
    }));
    setTripHistory(updatedHistory);
    setOpenMenuId(null);
  };

  const handleSaveTrip = (updatedTrip: Trip) => {
    const updatedHistory = tripHistory.map((day) => ({
      ...day,
      trips: day.trips.map((trip) => (trip.id === updatedTrip.id ? updatedTrip : trip)),
    }));
    setTripHistory(updatedHistory);
    setManualFormOpen(false);
    setSelectedTrip(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="flex items-center gap-3 p-4 bg-card border-b">
        <button onClick={() => navigate("/trip-recording")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Trip History</h1>
      </div>

      <ManualTripForm
        isOpen={isManualFormOpen}
        onOpenChange={setManualFormOpen}
        onSave={handleSaveTrip}
        initialValues={selectedTrip}
      />

      <div className="p-4 space-y-6">
        {tripHistory.map((day) => (
          <div key={day.id} className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground px-2">{day.date}</h2>
            <div className="space-y-3">
              {day.trips.map((trip) => (
                <Card key={trip.id} className="bg-card rounded-2xl shadow-sm relative">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl">{trip.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{trip.title}</h3>
                          <p className="text-sm text-muted-foreground">{trip.route}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 relative">
                        <span className="text-sm font-medium text-foreground">{trip.time}</span>
                        <button onClick={() => handleMenuToggle(trip.id)} className="p-1 relative z-10">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                        {openMenuId === trip.id && (
                          <div className="absolute right-0 top-full mt-1 w-40 bg-card border border-border rounded-lg shadow-lg z-20">
                            <button onClick={() => handleEditTrip(trip)} className="w-full text-left px-4 py-2 hover:bg-muted/50">
                              Edit Trip
                            </button>
                            <button onClick={() => handleDeleteTrip(trip.id)} className="w-full text-left px-4 py-2 hover:bg-muted/50 text-destructive">
                              Delete Trip
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default TripHistory;
