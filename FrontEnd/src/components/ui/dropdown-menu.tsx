"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "../icons";
import { cn } from "./utils";

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue & { triggerRef?: React.RefObject<HTMLElement> } | undefined>(undefined);

const DropdownMenu = ({ children, open: controlledOpen, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const triggerRef = React.useRef<HTMLElement | null>(null);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, asChild, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext);
  const triggerElementRef = React.useRef<HTMLElement | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    context?.setOpen(!context.open);
  };

  // Ensure triggerRef is set after render
  React.useEffect(() => {
    if (triggerElementRef.current && context?.triggerRef) {
      (context.triggerRef as React.MutableRefObject<HTMLElement | null>).current = triggerElementRef.current;
    }
  }, [context?.triggerRef]);

  if (asChild && React.isValidElement(children)) {
    const childRef = (children as any).ref;
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        handleClick(e);
        (children as any).props?.onClick?.(e);
      },
      ref: (node: HTMLElement) => {
        triggerElementRef.current = node;
        // Set triggerRef first
        if (context?.triggerRef && node) {
          (context.triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }
        // Handle original ref
        if (typeof childRef === 'function') {
          childRef(node);
        } else if (childRef) {
          (childRef as any).current = node;
        }
        // Handle forwarded ref
        if (typeof ref === 'function') {
          ref(node as any);
        } else if (ref) {
          (ref as any).current = node;
        }
      },
      'data-dropdown-trigger': 'true',
    });
  }

  return (
    <button
      ref={(node) => {
        triggerElementRef.current = node;
        if (context?.triggerRef && node) {
          (context.triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as any).current = node;
        }
      }}
      className={className}
      onClick={handleClick}
      data-dropdown-trigger="true"
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { sideOffset?: number; align?: "start" | "center" | "end" }
>(({ className, children, sideOffset = 4, align = "end", ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Calculate position based on trigger
  const getPositionStyle = React.useCallback(() => {
    // Try multiple ways to find the trigger
    let trigger: HTMLElement | null = context?.triggerRef?.current || null;
    
    // Fallback: find by data attribute - prioritize navbar triggers
    if (!trigger) {
      const allTriggers = Array.from(document.querySelectorAll('[data-dropdown-trigger]')) as HTMLElement[];
      // Find the trigger that's in the navbar (typically between 0-100px from top)
      for (const t of allTriggers.reverse()) {
        const rect = t.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < 100 && rect.width > 0 && rect.height > 0) {
          trigger = t;
          if (context?.triggerRef) {
            (context.triggerRef as React.MutableRefObject<HTMLElement | null>).current = t;
          }
          break;
        }
      }
      // If still not found, use the last one
      if (!trigger && allTriggers.length > 0) {
        trigger = allTriggers[0];
        if (context?.triggerRef) {
          (context.triggerRef as React.MutableRefObject<HTMLElement | null>).current = trigger;
        }
      }
    }
    
    if (!trigger) {
      return {
        position: 'fixed' as const,
        top: '0px',
        left: '0px',
        zIndex: 9999999,
        visibility: 'hidden' as any
      };
    }

    const rect = trigger.getBoundingClientRect();
    const estimatedWidth = contentRef.current?.offsetWidth || 320;
    
    // Calculate left position based on alignment
    let left = rect.left;
    if (align === "end") {
      left = rect.right - estimatedWidth;
      if (left < 8) left = 8;
    } else if (align === "center") {
      left = rect.left + (rect.width / 2) - (estimatedWidth / 2);
      if (left < 8) left = 8;
    } else {
      if (left + estimatedWidth > window.innerWidth - 8) {
        left = window.innerWidth - estimatedWidth - 8;
      }
    }

    // Calculate top position - MUST be below the trigger button
    // rect.bottom gives the bottom edge of the trigger in viewport coordinates
    const top = rect.bottom + sideOffset;

    return {
      position: 'fixed' as const,
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 9999999
    };
  }, [context?.triggerRef, sideOffset, align]);

  const [positionStyle, setPositionStyle] = React.useState<React.CSSProperties>(getPositionStyle());

  React.useEffect(() => {
    if (!context?.open) {
      // Reset position when closed
      setPositionStyle({
        position: 'fixed' as const,
        visibility: 'hidden' as any,
        display: 'none'
      });
      return;
    }

    // Update position after render - use multiple attempts to ensure accuracy
    const updatePosition = () => {
      // First, try to find trigger from ref
      let trigger: HTMLElement | null = context?.triggerRef?.current || null;
      
      // If not found, find by data attribute - prioritize the one that was just clicked
      if (!trigger) {
        const allTriggers = Array.from(document.querySelectorAll('[data-dropdown-trigger]')) as HTMLElement[];
        // Find the trigger that's in the navbar (has specific parent structure)
        for (const t of allTriggers.reverse()) {
          const rect = t.getBoundingClientRect();
          // Check if it's in the top navbar area (typically between 0-100px from top)
          if (rect.top >= 0 && rect.top < 100 && rect.width > 0 && rect.height > 0) {
            trigger = t;
            // Update the ref
            if (context?.triggerRef) {
              (context.triggerRef as React.MutableRefObject<HTMLElement | null>).current = t;
            }
            break;
          }
        }
        // If still not found, use the last one
        if (!trigger && allTriggers.length > 0) {
          trigger = allTriggers[0];
          if (context?.triggerRef) {
            (context.triggerRef as React.MutableRefObject<HTMLElement | null>).current = trigger;
          }
        }
      }
      
      if (trigger) {
        const rect = trigger.getBoundingClientRect();
        const estimatedWidth = contentRef.current?.offsetWidth || 320;
        
        // Calculate left position
        let left = rect.left;
        if (align === "end") {
          left = rect.right - estimatedWidth;
          if (left < 8) left = 8;
        } else if (align === "center") {
          left = rect.left + (rect.width / 2) - (estimatedWidth / 2);
          if (left < 8) left = 8;
        } else {
          if (left + estimatedWidth > window.innerWidth - 8) {
            left = window.innerWidth - estimatedWidth - 8;
          }
        }
        
        // Calculate top - MUST be below the button
        const top = rect.bottom + sideOffset;
        
        setPositionStyle({
          position: 'fixed' as const,
          top: `${top}px`,
          left: `${left}px`,
          zIndex: 9999999,
          display: 'block',
          visibility: 'visible',
          opacity: 1
        });
      }
    };
    
    // Immediate update
    updatePosition();
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      updatePosition();
      requestAnimationFrame(() => {
        updatePosition();
      });
    });
    
    // Multiple updates to ensure accuracy
    const timer1 = setTimeout(updatePosition, 0);
    const timer2 = setTimeout(updatePosition, 10);
    const timer3 = setTimeout(updatePosition, 50);
    const timer4 = setTimeout(updatePosition, 100);
    
    // Update on scroll and resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [context?.open, context?.triggerRef, align, sideOffset]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        const trigger = context?.triggerRef?.current;
        if (trigger && !trigger.contains(event.target as Node)) {
          context?.setOpen(false);
        }
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        context?.setOpen(false);
      }
    };

    if (context?.open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [context?.open, context]);

  if (!context?.open) return null;

  const content = (
    <div
      ref={contentRef}
      className={cn(
        "min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
        className
      )}
      style={{
        ...positionStyle,
        ...props.style,
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        pointerEvents: 'auto'
      }}
      {...props}
    >
      {children}
    </div>
  );

  // Use portal to render outside the navbar hierarchy
  if (typeof window !== 'undefined') {
    return createPortal(content, document.body);
  }

  return content;
});
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean; disabled?: boolean }
>(({ className, inset, disabled, onClick, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(e);
    context?.setOpen(false);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        inset && "pl-8",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onClick={handleClick}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { checked?: boolean; disabled?: boolean }
>(({ className, children, checked, disabled, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
      disabled && "pointer-events-none opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {checked && <CheckIcon className="h-4 w-4" />}
    </span>
    {children}
  </div>
));
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuRadioItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: string; disabled?: boolean }
>(({ className, children, disabled, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
      disabled && "pointer-events-none opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <CircleIcon className="h-2 w-2 fill-current" />
    </span>
    {children}
  </div>
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-1.5 text-sm", inset && "pl-8", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

const DropdownMenuGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const DropdownMenuSub = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const DropdownMenuSubContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg", className)} {...props} />
  )
);
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

const DropdownMenuSubTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="ml-auto h-4 w-4" />
  </div>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuRadioGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
