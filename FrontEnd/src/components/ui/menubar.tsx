"use client";

import * as React from "react";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "../icons";
import { cn } from "./utils";

// Simplified stub implementations
const Menubar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm", className)} {...props} />
  )
);
Menubar.displayName = "Menubar";

const MenubarMenu = ({ children }: { children: React.ReactNode }) => <div className="relative">{children}</div>;

const MenubarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn("flex cursor-pointer select-none items-center rounded-sm px-3 py-1 text-sm outline-none hover:bg-accent hover:text-accent-foreground", className)}
      {...props}
    />
  )
);
MenubarTrigger.displayName = "MenubarTrigger";

const MenubarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("absolute z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)} {...props} />
  )
);
MenubarContent.displayName = "MenubarContent";

const MenubarItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }>(
  ({ className, inset, ...props }, ref) => (
    <div ref={ref} className={cn("relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground", inset && "pl-8", className)} {...props} />
  )
);
MenubarItem.displayName = "MenubarItem";

const MenubarCheckboxItem = MenubarItem;
const MenubarRadioItem = MenubarItem;
const MenubarLabel = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("px-2 py-1.5 text-sm", className)} {...props} />;
const MenubarSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />;
const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
const MenubarGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const MenubarPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const MenubarSub = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const MenubarSubContent = MenubarContent;
const MenubarSubTrigger = MenubarItem;
const MenubarRadioGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};
