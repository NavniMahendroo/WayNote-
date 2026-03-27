import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Clock, Plus } from "lucide-react";
import { toast } from "sonner";

interface Trip {
  id: number;
  title: string;
  route: string;
  time: string; // e.g. "10:00 - 10:45"
  mode: string;
  icon: string;
  numberOfPeople?: string;
  notes?: string;
}

interface ManualTripFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (trip: Trip) => void;
  initialValues?: Trip | null;
}

const ManualTripForm = ({ isOpen, onOpenChange, onSave, initialValues }: ManualTripFormProps) => {
  const [formData, setFormData] = useState({
    startLocation: "",
    endLocation: "",
    startTime: "",
    endTime: "",
    transportMode: "",
    numberOfPeople: "1",
    notes: ""
  });

  const transportModes = [
    { value: "walking", label: "Walking", icon: "🚶" },
    { value: "cycling", label: "Cycling", icon: "🚴" },
    { value: "bus", label: "Bus", icon: "🚌" },
    { value: "car", label: "Car", icon: "🚗" },
    { value: "train", label: "Train", icon: "🚂" },
    { value: "motorcycle", label: "Motorcycle", icon: "🏍️" },
    { value: "other", label: "Other", icon: "🚛" }
  ];

  // Pre-fill form when editing
  useEffect(() => {
    if (initialValues) {
      const [startT, endT] = initialValues.time.split(" - ");
      setFormData({
        startLocation: initialValues.route.split(" - ")[0] || "",
        endLocation: initialValues.route.split(" - ")[1] || "",
        startTime: startT || "",
        endTime: endT || "",
        transportMode: initialValues.mode,
        numberOfPeople: initialValues.numberOfPeople || "1",
        notes: initialValues.notes || ""
      });
    } else {
      setFormData({
        startLocation: "",
        endLocation: "",
        startTime: "",
        endTime: "",
        transportMode: "",
        numberOfPeople: "1",
        notes: ""
      });
    }
  }, [initialValues, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.startLocation ||
      !formData.endLocation ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.transportMode ||
      !formData.numberOfPeople
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const trip: Trip = {
      id: initialValues ? initialValues.id : Date.now(),
      title: `${formData.startLocation} to ${formData.endLocation}`,
      route: `${formData.startLocation} - ${formData.endLocation}`,
      time: `${formData.startTime} - ${formData.endTime}`,
      mode: formData.transportMode,
      icon:
        formData.transportMode === "walking"
          ? "🚶"
          : formData.transportMode === "cycling"
          ? "🚴"
          : formData.transportMode === "bus"
          ? "🚌"
          : formData.transportMode === "car"
          ? "🚗"
          : formData.transportMode === "train"
          ? "🚂"
          : formData.transportMode === "motorcycle"
          ? "🏍️"
          : "🚛",
      numberOfPeople: formData.numberOfPeople,
      notes: formData.notes
    };

    onSave(trip);
    toast.success(initialValues ? "Trip updated successfully!" : "Trip recorded successfully!");

    // Reset form
    setFormData({
      startLocation: "",
      endLocation: "",
      startTime: "",
      endTime: "",
      transportMode: "",
      numberOfPeople: "1",
      notes: ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {initialValues ? "Edit Trip" : "Add Trip Manually"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Start & End Location */}
          <div className="space-y-2">
            <Label htmlFor="startLocation" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500" />
              From (Start Location) *
            </Label>
            <Input
              id="startLocation"
              placeholder="Enter starting point"
              value={formData.startLocation}
              onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endLocation" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              To (End Location) *
            </Label>
            <Input
              id="endLocation"
              placeholder="Enter destination"
              value={formData.endLocation}
              onChange={(e) => setFormData({ ...formData, endLocation: e.target.value })}
              required
            />
          </div>

          {/* Start and End Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Start Time *
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                End Time *
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Number of People */}
          <div className="space-y-2">
            <Label htmlFor="numberOfPeople" className="flex items-center gap-2">
              👥 Number of People *
            </Label>
            <Input
              id="numberOfPeople"
              type="number"
              min="1"
              placeholder="1"
              value={formData.numberOfPeople}
              onChange={(e) => setFormData({ ...formData, numberOfPeople: e.target.value })}
              required
            />
          </div>

          {/* Mode of Transport */}
          <div className="space-y-3">
            <Label>Mode of Transport *</Label>
            <RadioGroup
              value={formData.transportMode}
              onValueChange={(value) => setFormData({ ...formData, transportMode: value })}
              className="grid grid-cols-2 gap-2"
            >
              {transportModes.map((mode) => (
                <div
                  key={mode.value}
                  className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50"
                >
                  <RadioGroupItem value={mode.value} id={mode.value} />
                  <Label htmlFor={mode.value} className="flex items-center gap-2 cursor-pointer flex-1">
                    <span className="text-lg">{mode.icon}</span>
                    <span className="text-sm">{mode.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional details about your trip..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            {initialValues ? "Save Changes" : "Record Trip"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManualTripForm;
