"use client";

import * as React from "react";
import { CircleIcon } from "../icons";
import { cn } from "./utils";

interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(undefined);

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string;
    onValueChange?: (value: string) => void;
  }
>(({ className, value, onValueChange, ...props }, ref) => (
  <RadioGroupContext.Provider value={{ value, onValueChange }}>
    <div ref={ref} className={cn("grid gap-2", className)} role="radiogroup" {...props} />
  </RadioGroupContext.Provider>
));
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(RadioGroupContext);
  const isChecked = context?.value === value;

  return (
    <div className="relative flex items-center">
      <input
        ref={ref}
        type="radio"
        value={value}
        checked={isChecked}
        onChange={() => context?.onValueChange?.(value)}
        className="peer sr-only"
        {...props}
      />
      <div
        className={cn(
          "h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          "flex items-center justify-center",
          className
        )}
      >
        {isChecked && <CircleIcon className="h-2.5 w-2.5 fill-current text-current" />}
      </div>
    </div>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
