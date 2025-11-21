"use client";

import * as React from "react";

const Collapsible = ({ children, open, onOpenChange, ...props }: any) => {
  const [isOpen, setIsOpen] = React.useState(open ?? false);
  const actualOpen = open ?? isOpen;
  const setOpen = onOpenChange ?? setIsOpen;
  
  return <div data-state={actualOpen ? "open" : "closed"} {...props}>{children}</div>;
};

const CollapsibleTrigger = ({ children, ...props }: any) => <button {...props}>{children}</button>;

const CollapsibleContent = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
