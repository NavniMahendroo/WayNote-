import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Login = ({ setIsAuthenticated }: LoginProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = () => {
    if (formData.email && formData.password) {
      setIsAuthenticated(true);

      // Extract name from email if it contains '@', else use username as name
      let name = "";
      if (formData.email.includes("@")) {
        const localPart = formData.email.split("@")[0];
        name = localPart.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      } else {
        name = formData.email;
      }

      // Save login info to localStorage
      localStorage.setItem("username", formData.email);
      localStorage.setItem("email", formData.email.includes("@") ? formData.email : "");
      localStorage.setItem("name", name);
      localStorage.setItem("password", formData.password);

      toast.success("Successfully logged in!");
      navigate("/dashboard");
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
            Sign in to your NATPAC account
          </p>

          {/* Login Form */}
          <div className="space-y-4 mb-6">
            <div>
              <Input
                type="email"
                placeholder="Username or Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-muted border border-black rounded-full py-6 px-4 focus:border-yellow-500 focus:ring-0"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-muted border border-black rounded-full py-6 px-4 focus:border-yellow-500 focus:ring-0"
              />
            </div>

            <div className="text-right">
              <button className="text-sm text-muted-foreground">
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            className="w-full bg-soft-blue hover:bg-soft-blue-hover text-soft-blue-foreground font-semibold py-3 rounded-full mb-6"
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
