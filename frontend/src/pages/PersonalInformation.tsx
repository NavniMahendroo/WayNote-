import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const PersonalInformation = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const storedUsername = localStorage.getItem("username") || "";
  const storedEmail = localStorage.getItem("email") || "";
  const storedName = localStorage.getItem("name") || storedUsername;
  const storedPhone = localStorage.getItem("phone") || "";
  const storedPassword = localStorage.getItem("password") || "";

  const [email, setEmail] = useState(storedEmail);
  const [name, setName] = useState(storedName);
  const [phone, setPhone] = useState(storedPhone);
  const [password, setPassword] = useState(storedPassword);

  const handleSave = () => {
    localStorage.setItem("username", storedUsername);
    localStorage.setItem("email", email);
    localStorage.setItem("name", name);
    localStorage.setItem("phone", phone);
    localStorage.setItem("password", password);
    toast.success("Changes saved!");
  };

  const getInitials = (nameStr: string) => {
    if (!nameStr) return "U";
    const words = nameStr.split(" ");
    return words[0].charAt(0).toUpperCase() + (words[1] ? words[1].charAt(0).toUpperCase() : "");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-3 p-4 bg-card border-b">
        <button onClick={() => navigate("/settings")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Personal Information</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="flex justify-center">
          <Avatar className="w-20 h-20">
            <AvatarImage src="/api/placeholder/80/80" />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
        </div>

        <Card className="bg-card rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full py-3 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default PersonalInformation;
