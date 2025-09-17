import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-4", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <div className="flex items-center space-x-3">
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          "relative flex items-center justify-center h-6 w-6 rounded-full border-2 border-gray-300 bg-white transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2",
          "data-[state=checked]:border-[#3B82F6] data-[state=checked]:bg-[#3B82F6]",
          "hover:border-gray-400 hover:scale-105",
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator
          className="absolute flex items-center justify-center"
        >
          <div className="h-2.5 w-2.5 rounded-full bg-white" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      <label 
        className="text-sm font-medium text-gray-700 cursor-pointer select-none"
        htmlFor={props.id}
      >
        {children}
      </label>
    </div>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };