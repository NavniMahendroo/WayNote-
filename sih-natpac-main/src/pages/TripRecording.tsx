import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import ManualTripForm from "@/components/ManualTripForm";
import AutoTrackingManager from "@/components/AutoTrackingManager";

const TripRecording = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="p-4 bg-card border-b">
        <h1 className="text-xl font-bold">NATPAC</h1>
      </div>

      <div className="p-4">
        {/* Today's Trips Card */}
        <Card className="bg-card rounded-2xl shadow-sm mb-6">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold mb-6">Today's Trips</h2>
            
            {/* Empty State Circle */}
            <div className="flex justify-center mb-8">
              <div className="w-48 h-48 bg-muted rounded-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="w-16 h-16 bg-background rounded-lg mx-auto mb-3 flex items-center justify-center text-2xl">
                    📍
                  </div>
                </div>
              </div>
            </div>

            {/* No Trips Message */}
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold mb-2">No trips recorded yet</h3>
              <p className="text-muted-foreground text-sm">
                Start your first trip to contribute to better transportation planning.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <AutoTrackingManager 
                isTracking={isTracking}
                onTrackingChange={setIsTracking}
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

        {/* Manual Trip Form Dialog */}
        <ManualTripForm 
          isOpen={showManualForm}
          onOpenChange={setShowManualForm}
        />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default TripRecording;