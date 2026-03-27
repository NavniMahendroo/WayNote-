import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "@/App";

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
  setUserRole: (value: UserRole) => void;
}

const Login = ({ setIsAuthenticated, setUserRole }: LoginProps) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("user");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async () => {
    if (formData.email && formData.password) {
      try {
        const response = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.message || "Login failed");
          return;
        }

        const data = await response.json();

        setIsAuthenticated(true);
        setUserRole(role);

        localStorage.setItem("username", data.user?.name || formData.email);
        localStorage.setItem("email", data.user?.email || formData.email);
        localStorage.setItem("name", data.user?.name || formData.email.split("@")[0]);
        localStorage.setItem("password", formData.password);
        localStorage.setItem("userRole", role);
        localStorage.setItem("isAuthenticated", "true");

        toast.success("Successfully logged in!");
        navigate(role === "government" ? "/gov-dashboard" : "/dashboard");
      } catch {
        toast.error("Unable to connect to backend. Start backend and try again.");
      }
    } else {
      toast.error("Please fill in all fields");
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login not implemented in demo`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4">
        <button onClick={() => navigate("/")} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full bg-card rounded-2xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-center mb-8">
            Sign in to your WayNote account
          </p>

          {/* Login Form */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-full">
              <button
                onClick={() => setRole("user")}
                className={`py-2 rounded-full text-sm font-medium transition-colors ${
                  role === "user" ? "bg-background" : "text-muted-foreground"
                }`}
              >
                User Login
              </button>
              <button
                onClick={() => setRole("government")}
                className={`py-2 rounded-full text-sm font-medium transition-colors ${
                  role === "government" ? "bg-background" : "text-muted-foreground"
                }`}
              >
                Govt Login
              </button>
            </div>

            <div>
              <Input
                type="email"
                placeholder="Username or Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-muted border border-input rounded-full py-6 px-4 focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-muted border border-input rounded-full py-6 px-4 focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="text-right">
              <button
                className="text-sm text-muted-foreground"
                onClick={() => toast.info("Password reset link flow can be added here")}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-full mb-6"
          >
            Login
          </Button>

          {/* Divider */}
          <div className="text-center text-muted-foreground text-sm mb-4">
            OR
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("Google")}
              className="w-full rounded-full py-3 border-2"
            >
              <span className="mr-2">🟦</span>
              Sign in with Google
            </Button>

            <Button
              variant="outline"
              onClick={() => handleSocialLogin("Apple")}
              className="w-full rounded-full py-3 border-2"
            >
              <span className="mr-2">🍎</span>
              Sign in with Apple
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
