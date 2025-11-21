"use client";

import * as React from "react";
import { cn } from "./utils";

const ToggleGroupContext = React.createContext<{ value?: string | string[]; onValueChange?: (value: string) => void } | undefined>(undefined);

const ToggleGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type?: "single" | "multiple";
    value?: string | string[];
    onValueChange?: (value: string | string[]) => void;
  }
>(({ className, type = "single", value, onValueChange, ...props }, ref) => (
  <ToggleGroupContext.Provider value={{ value, onValueChange: onValueChange as any }}>
    <div
      ref={ref}
      className={cn("flex items-center justify-center gap-1", className)}
      {...props}
    />
  </ToggleGroupContext.Provider>
));
ToggleGroup.displayName = "ToggleGroup";

const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);
  const isActive = Array.isArray(context?.value)
    ? context.value.includes(value)
    : context?.value === value;

  return (
    <button
      ref={ref}
      data-state={isActive ? "on" : "off"}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-3 text-sm ring-offset-background transition-all hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
        className
      )}
      onClick={() => context?.onValueChange?.(value)}
      {...props}
    />
  );
});
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
