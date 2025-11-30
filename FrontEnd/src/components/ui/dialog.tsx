"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { XIcon } from "../icons";
import { cn } from "./utils";

let openDialogCount = 0;

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined);

const Dialog = ({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  children
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <DialogContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, onClick, asChild, ...props }, ref) => {
  const context = React.useContext(DialogContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    context?.onOpenChange(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
    });
  }

  return (
    <button
      ref={ref}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});
DialogTrigger.displayName = "DialogTrigger";



// ... (existing imports)

const DialogPortal = ({ children }: { children: React.ReactNode }) => {
  const context = React.useContext(DialogContext);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!context?.open || !mounted) return null;

  return createPortal(children, document.body);
};

const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const zIndex = props.style?.zIndex 
    ? (typeof props.style.zIndex === 'number' ? props.style.zIndex : 9999998)
    : 9999998;
  
  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0",
        className
      )}
      style={{
        pointerEvents: 'auto',
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        zIndex: zIndex - 1,
        transform: 'translateZ(0)',
        isolation: 'isolate',
        ...props.style
      }}
      {...props}
    />
  );
});
DialogOverlay.displayName = "DialogOverlay";

const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => {
  const context = React.useContext(DialogContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    context?.onOpenChange(false);
  };

  return (
    <button
      ref={ref}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});
DialogClose.displayName = "DialogClose";

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
}

const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(({ className, children, overlayClassName, overlayStyle, ...props }, ref) => {
  const context = React.useContext(DialogContext);
  const isOpen = context?.open;

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        context?.onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      openDialogCount += 1;
      document.body.classList.add('dialog-open');
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (isOpen) {
        openDialogCount = Math.max(openDialogCount - 1, 0);
        if (openDialogCount === 0) {
          document.body.classList.remove('dialog-open');
          document.body.style.overflow = 'unset';
        }
      }
    };
  }, [isOpen, context]);

  return (
    <DialogPortal>
      <DialogOverlay
        className={overlayClassName}
        style={overlayStyle}
        onClick={() => context?.onOpenChange(false)}
      />
      <div
        ref={ref}
        className={cn(
          "fixed grid w-full max-w-lg gap-4 p-6",
          className
        )}
        style={{
          pointerEvents: 'auto',
          position: 'fixed',
          left: props.style?.left !== undefined ? props.style.left : '50%',
          top: props.style?.top !== undefined ? props.style.top : '50%',
          transform: props.style?.transform || 'translate(-50%, -50%)',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 8px 32px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
          zIndex: props.style?.zIndex || 9999999,
          margin: props.style?.margin !== undefined ? props.style.margin : undefined,
          isolation: 'isolate',
          ...props.style
        }}
        {...props}
      >
        {children}
        <button
          onClick={() => context?.onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </DialogPortal>
  );
});
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
