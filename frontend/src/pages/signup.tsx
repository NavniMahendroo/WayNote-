import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "@/App";

interface SignupProps {
  setIsAuthenticated: (value: boolean) => void;
  setUserRole: (value: UserRole) => void;
}

const Signup = ({ setIsAuthenticated, setUserRole }: SignupProps) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!username || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Could not create account");
        return;
      }

      const data = await response.json();

      localStorage.setItem("username", data.user?.name || username);
      localStorage.setItem("name", data.user?.name || username);
      localStorage.setItem("email", data.user?.email || email);
      localStorage.setItem("password", password);
      localStorage.setItem("userRole", "user");
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("lastAuthAction", "signup");

      setIsAuthenticated(true);
      setUserRole("user");
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch {
      toast.error("Unable to connect to backend. Start backend and try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      {/* Header with Back Arrow */}
      <div className="flex items-center w-full max-w-sm mb-6">
        <button onClick={() => navigate("/auth")} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Card */}
      <Card className="max-w-sm w-full rounded-2xl shadow-lg bg-card">
        <CardContent className="p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center">Sign Up</h1>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <Button
              onClick={handleSignup}
              className="w-full py-3 rounded-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
