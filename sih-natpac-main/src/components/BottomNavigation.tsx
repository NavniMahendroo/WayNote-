import { Home, BarChart3, History, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/dashboard" },
    { id: "home", label: "Home", icon: Home, path: "/trip-recording" },
    { id: "history", label: "Trip History", icon: History, path: "/trip-history" },
    { id: "profile", label: "Profile", icon: User, path: "/settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex items-center justify-around py-2 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "text-teal-500" // Active color set to teal
                  : "text-black hover:text-foreground" // Inactive stays black
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
              {/* Optional small indicator for history */}
              {item.id === "history" && isActive && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
