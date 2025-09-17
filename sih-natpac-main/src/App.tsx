import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Import pages
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TripRecording from "./pages/TripRecording";
import TripHistory from "./pages/TripHistory";
import ManualTripForm from "./components/ManualTripForm";
import Settings from "./pages/Settings";
import TransportGraph from "./pages/TransportGraph";
import PersonalInformation from "./pages/PersonalInformation";
import DataCollectionPreferences from "./pages/DataCollectionPreferences";
import NotificationsSettings from "./pages/NotificationsSettings";
import UnitsOfMeasurement from "./pages/UnitsOfMeasurement";
const queryClient = new QueryClient();

const initialTripHistory = [
  {
    id: 1,
    date: "TODAY - 24 JULY, 2024",
    trips: [
      {
        id: 1,
        title: "Home to Work",
        route: "Kaloor - Kakkanad",
        time: "10:00 - 10:45",
        mode: "bus",
        icon: "🚌"
      },
      {
        id: 2,
        title: "Work to Cafe",
        route: "Infopark - Chai Sutta",
        time: "13:00 - 13:15",
        mode: "walk",
        icon: "🚶"
      }
    ]
  },
  {
    id: 2,
    date: "YESTERDAY - 23 JULY, 2024",
    trips: [
      {
        id: 3,
        title: "Cafe to Library",
        route: "Chai Sutta - Public Library",
        time: "14:00 - 14:30",
        mode: "bus",
        icon: "🚌"
      },
      {
        id: 4,
        title: "Library to Home",
        route: "Public Library - Kaloor",
        time: "16:30 - 17:15",
        mode: "bus",
        icon: "🚌"
      }
    ]
  }
];

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tripHistory, setTripHistory] = useState(initialTripHistory);
  const [isManualFormOpen, setManualFormOpen] = useState(false);

  const handleSaveTrip = (newTrip: any) => {
    setTripHistory(prev =>
      prev.map(day => {
        if (day.date.includes("TODAY")) {
          return {
            ...day,
            trips: [
              ...day.trips,
              { ...newTrip, id: Date.now() }
            ]
          };
        }
        return day;
      })
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <button onClick={() => setManualFormOpen(true)}>Add Trip Manually</button>
            <ManualTripForm
              isOpen={isManualFormOpen}
              onOpenChange={setManualFormOpen}
              onSave={handleSaveTrip}
            />
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/trip-recording" element={<TripRecording />} />
              {/* Pass new prop here */}
              <Route path="/trip-history" element={<TripHistory tripHistory={tripHistory} />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/transport-graph" element={<TransportGraph />} />
              <Route path="/personal-information" element={<PersonalInformation />} />
              <Route path="/data-collection-preferences" element={<DataCollectionPreferences />} />
              <Route path="/notifications-settings" element={<NotificationsSettings />} />
              <Route path="/units-of-measurement" element={<UnitsOfMeasurement />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
export default App;