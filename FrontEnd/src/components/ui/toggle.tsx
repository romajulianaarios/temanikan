"use client";

import * as React from "react";
import { cn } from "./utils";
import { buttonVariants } from "./button";

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant = "default", size = "default", pressed, onPressedChange, onClick, ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(pressed ?? false);
    const actualPressed = pressed ?? isPressed;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      const newPressed = !actualPressed;
      setIsPressed(newPressed);
      onPressedChange?.(newPressed);
    };

    return (
      <button
        ref={ref}
        data-state={actualPressed ? "on" : "off"}
        onClick={handleClick}
        className={cn(
          buttonVariants({ variant, size }),
          "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
Toggle.displayName = "Toggle";

export { Toggle };
