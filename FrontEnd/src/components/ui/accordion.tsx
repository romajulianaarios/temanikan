"use client";

import * as React from "react";
import { ChevronDownIcon } from "../icons";
import { cn } from "./utils";

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (value: string) => void;
  type?: "single" | "multiple";
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined);

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type?: "single" | "multiple";
    value?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    collapsible?: boolean;
  }
>(({ className, children, type = "single", value, onValueChange, ...props }, ref) => {
  const [openItems, setOpenItems] = React.useState<string[]>(
    Array.isArray(value) ? value : value ? [value] : []
  );

  const toggleItem = (itemValue: string) => {
    let newOpenItems: string[];
    
    if (type === "single") {
      newOpenItems = openItems.includes(itemValue) ? [] : [itemValue];
    } else {
      newOpenItems = openItems.includes(itemValue)
        ? openItems.filter(i => i !== itemValue)
        : [...openItems, itemValue];
    }
    
    setOpenItems(newOpenItems);
    onValueChange?.(type === "single" ? newOpenItems[0] || "" : newOpenItems);
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
});
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => (
  <div ref={ref} className={cn("border-b", className)} data-value={value} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(AccordionContext);
  const item = (ref as any)?.current?.closest('[data-value]');
  const value = item?.getAttribute('data-value') || '';
  const isOpen = context?.openItems.includes(value);

  return (
    <button
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      onClick={() => context?.toggleItem(value)}
      {...props}
    >
      {children}
      <ChevronDownIcon className={cn(
        "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
        isOpen && "rotate-180"
      )} />
    </button>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(AccordionContext);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const item = contentRef.current?.closest('[data-value]');
  const value = item?.getAttribute('data-value') || '';
  const isOpen = context?.openItems.includes(value);

  return (
    <div
      ref={contentRef}
      className={cn(
        "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        !isOpen && "hidden"
      )}
      {...props}
    >
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
