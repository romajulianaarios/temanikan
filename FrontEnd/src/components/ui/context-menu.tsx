"use client";

import * as React from "react";
import { cn } from "./utils";

// Simplified stub - just renders children
const ContextMenu = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const ContextMenuTrigger = ({ children, asChild, ...props }: any) => asChild && React.isValidElement(children) ? children : <div {...props}>{children}</div>;
const ContextMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)} {...props} />
  )
);
ContextMenuContent.displayName = "ContextMenuContent";

const ContextMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }>(
  ({ className, inset, ...props }, ref) => (
    <div ref={ref} className={cn("relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent", inset && "pl-8", className)} {...props} />
  )
);
ContextMenuItem.displayName = "ContextMenuItem";

const ContextMenuCheckboxItem = ContextMenuItem;
const ContextMenuRadioItem = ContextMenuItem;
const ContextMenuLabel = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("px-2 py-1.5 text-sm", className)} {...props} />;
const ContextMenuSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />;
const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span className={cn("ml-auto text-xs", className)} {...props} />;
const ContextMenuGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const ContextMenuPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const ContextMenuSub = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const ContextMenuSubContent = ContextMenuContent;
const ContextMenuSubTrigger = ContextMenuItem;
const ContextMenuRadioGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
