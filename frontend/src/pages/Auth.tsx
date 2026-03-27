import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 relative">
      
      {/* Back arrow at top-left */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 p-2 flex items-center gap-1"
      >
        <ArrowLeft className="w-6 h-6" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Card */}
      <div className="max-w-sm w-full bg-card rounded-2xl p-8 shadow-lg text-center space-y-6 min-h-[480px] flex flex-col justify-center">
        <h1 className="text-2xl font-bold">Welcome to WayNote</h1>
        <p className="text-muted-foreground">Please choose an option to continue</p>

        <div className="space-y-4">
          <Button
            onClick={() => navigate("/login")}
            className="w-full py-3 rounded-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Sign In
          </Button>

          <Button
            onClick={() => navigate("/signup")}
            className="w-full py-3 rounded-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
