// App.tsx
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Signup from "./pages/signup";

// Import pages
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TripRecording from "./pages/TripRecording";
import TripHistory from "./pages/TripHistory";
import Settings from "./pages/Settings";
import TransportGraph from "./pages/TransportGraph";
import PersonalInformation from "./pages/PersonalInformation";
import DataCollectionPreferences from "./pages/DataCollectionPreferences";
import NotificationsSettings from "./pages/NotificationsSettings";
import UnitsOfMeasurement from "./pages/UnitsOfMeasurement";
import GovernmentDashboard from "./pages/GovernmentDashboard";
import GovernmentSettings from "./pages/GovernmentSettings";
import { fetchUserTrips, formatDateLabel, groupTripsByDateLabel } from "./lib/trips-api";

const queryClient = new QueryClient();

export interface Trip {
  id: number;
  title: string;
  route: string;
  time: string;
  mode: string;
  icon: string;
  numberOfPeople?: string;
  notes?: string;
  dateLabel?: string;
  startCoord?: {
    latitude: number;
    longitude: number;
  };
  endCoord?: {
    latitude: number;
    longitude: number;
  };
}

export interface TripDay {
  id: number;
  date: string;
  trips: Trip[];
}

export type UserRole = "user" | "government";

const initialTripHistory: TripDay[] = [
  {
    id: 1,
    date: formatDateLabel(),
    trips: [],
  },
];

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem("isAuthenticated") === "true");
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const storedRole = localStorage.getItem("userRole");
    return storedRole === "government" ? "government" : "user";
  });
  const [tripHistory, setTripHistory] = useState<TripDay[]>(initialTripHistory);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("userRole", userRole);
  }, [userRole]);

  useEffect(() => {
    const loadUserTrips = async () => {
      if (!isAuthenticated || userRole !== "user") {
        return;
      }

      const email = localStorage.getItem("email");
      if (!email) {
        return;
      }

      try {
        const trips = await fetchUserTrips(email);
        const groupedTrips = groupTripsByDateLabel(trips);
        setTripHistory(
          groupedTrips.length > 0
            ? groupedTrips
            : [{ id: 1, date: formatDateLabel(), trips: [] }]
        );
      } catch {
        // Keep local fallback data when backend is unavailable.
      }
    };

    void loadUserTrips();

    const intervalId = window.setInterval(() => {
      void loadUserTrips();
    }, 15000);

    const onFocus = () => {
      void loadUserTrips();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, [isAuthenticated, userRole]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/login"
                element={
                  <Login
                    setIsAuthenticated={setIsAuthenticated}
                    setUserRole={setUserRole}
                  />
                }
              />
              <Route
                path="/signup"
                element={
                  <Signup
                    setIsAuthenticated={setIsAuthenticated}
                    setUserRole={setUserRole}
                  />
                }
              />

              <Route
                path="/dashboard"
                element={
                  isAuthenticated && userRole === "user" ? (
                    <Dashboard tripHistory={tripHistory} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/gov-dashboard"
                element={
                  isAuthenticated && userRole === "government" ? (
                    <GovernmentDashboard tripHistory={tripHistory} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/gov-settings"
                element={
                  isAuthenticated && userRole === "government" ? (
                    <GovernmentSettings setIsAuthenticated={setIsAuthenticated} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/trip-recording"
                element={
                  isAuthenticated && userRole === "user" ? (
                    <TripRecording
                      tripHistory={tripHistory}
                      setTripHistory={setTripHistory}
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/trip-history"
                element={
                  isAuthenticated && userRole === "user" ? (
                    <TripHistory
                      tripHistory={tripHistory}
                      setTripHistory={setTripHistory}
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/settings"
                element={
                  isAuthenticated && userRole === "user" ? (
                    <Settings setIsAuthenticated={setIsAuthenticated} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/transport-graph"
                element={
                  isAuthenticated && userRole === "user" ? (
                    <TransportGraph tripHistory={tripHistory} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/personal-information"
                element={
                  isAuthenticated && userRole === "user" ? (
                    <PersonalInformation />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/data-collection-preferences"
                element={
                  isAuthenticated && userRole === "user" ? (
                    <DataCollectionPreferences />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/notifications-settings"
                element={
                  isAuthenticated && userRole === "user" ? (
                    <NotificationsSettings />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/units-of-measurement"
                element={
                  isAuthenticated && userRole === "user" ? (
                    <UnitsOfMeasurement />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
