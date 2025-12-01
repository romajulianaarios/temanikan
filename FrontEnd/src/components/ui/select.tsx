"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "../icons";
import { cn } from "./utils";

interface SelectContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef?: HTMLElement | null;
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined);

const Select = ({ 
  value, 
  onValueChange, 
  defaultValue,
  children 
}: { 
  value?: string; 
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  
  const currentValue = value !== undefined ? value : internalValue;
  const handleValueChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, open, setOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const context = React.useContext(SelectContext);
  return <span>{context?.value || placeholder}</span>;
};

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  const internalRef = React.useRef<HTMLButtonElement>(null);
  const combinedRef = (node: HTMLButtonElement | null) => {
    internalRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
    // Store trigger ref in context for SelectContent to use
    if (node && context) {
      (context as any).triggerRef = node;
    }
  };

  return (
    <button
      ref={combinedRef}
      type="button"
      data-select-trigger
      className={cn(
        "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-full border-2 px-3 py-2 text-sm transition-all duration-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(72, 128, 255, 0.2)',
        boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
        fontFamily: 'Nunito Sans, sans-serif',
        color: '#133E87',
        fontWeight: 600
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.4)';
        e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
      }}
      onClick={() => context?.setOpen(!context.open)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="h-4 w-4 opacity-50" style={{ color: '#608BC1' }} />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectScrollUpButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUpIcon className="h-4 w-4" />
  </div>
));
SelectScrollUpButton.displayName = "SelectScrollUpButton";

const SelectScrollDownButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDownIcon className="h-4 w-4" />
  </div>
));
SelectScrollDownButton.displayName = "SelectScrollDownButton";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { position?: "popper" | "item-aligned" }
>(({ className, children, position = "popper", ...props }, ref) => {
  const context = React.useContext(SelectContext);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [positionStyle, setPositionStyle] = React.useState<React.CSSProperties>({});

  // Find the trigger element to position the dropdown
  const updatePosition = React.useCallback(() => {
    if (context?.open && context?.triggerRef) {
      const rect = context.triggerRef.getBoundingClientRect();
      const contentRefElement = contentRef.current;
      
      // Estimate content height (default to 200px if not available)
      const estimatedHeight = contentRefElement?.scrollHeight || 200;
      
      // Always show above the trigger
      const spaceAbove = rect.top;
      
      setPositionStyle({
        position: 'fixed',
        top: `${rect.top - estimatedHeight - 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        minWidth: `${rect.width}px`,
        maxHeight: `${Math.max(spaceAbove - 8, 150)}px` // Minimum 150px height
      });
    }
  }, [context?.open, context?.triggerRef]);

  React.useEffect(() => {
    updatePosition();
    
    if (context?.open) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [context?.open, updatePosition]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        if (context?.triggerRef && !context.triggerRef.contains(event.target as Node)) {
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
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [context?.open, context]);

  if (!context?.open) return null;

  // Use React Portal to render outside the normal DOM hierarchy
  return createPortal(
    <div
      ref={contentRef}
      className={cn(
        "max-h-96 overflow-hidden rounded-2xl animate-in fade-in-0 zoom-in-95",
        className
      )}
      style={{
        backgroundColor: '#FFFFFF',
        border: '2px solid rgba(72, 128, 255, 0.2)',
        boxShadow: '0 10px 50px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
        fontFamily: 'Nunito Sans, sans-serif',
        zIndex: 999999,
        ...positionStyle
      }}
      {...props}
    >
      <div className="p-1 w-full">
        {children}
      </div>
    </div>,
    document.body
  );
});
SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-1.5 text-sm", className)}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; disabled?: boolean }
>(({ className, children, value, disabled, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  const isSelected = context?.value === value;

  const handleClick = () => {
    if (!disabled) {
      context?.onValueChange?.(value);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-xl py-2 pl-3 pr-8 text-sm outline-none transition-all duration-300",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      style={{
        fontFamily: 'Nunito Sans, sans-serif',
        color: isSelected ? '#133E87' : '#608BC1',
        fontWeight: isSelected ? 700 : 600,
        backgroundColor: isSelected ? 'rgba(72, 128, 255, 0.1)' : 'transparent',
        margin: '2px 4px',
        borderRadius: '16px'
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = isSelected ? 'rgba(72, 128, 255, 0.15)' : 'rgba(72, 128, 255, 0.08)';
          e.currentTarget.style.transform = 'translateX(4px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = isSelected ? 'rgba(72, 128, 255, 0.1)' : 'transparent';
          e.currentTarget.style.transform = 'translateX(0)';
        }
      }}
      onClick={handleClick}
      {...props}
    >
      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <CheckIcon className="h-4 w-4" style={{ color: '#4880FF' }} />}
      </span>
      {children}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
