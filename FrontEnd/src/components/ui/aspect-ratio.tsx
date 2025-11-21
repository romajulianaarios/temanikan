"use client";

import * as React from "react";

const AspectRatio = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { ratio?: number }
>(({ ratio = 1, className, style, ...props }, ref) => (
  <div
    ref={ref}
    style={{
      position: "relative",
      width: "100%",
      paddingBottom: `${100 / ratio}%`,
      ...style,
    }}
    {...props}
  >
    <div
      className={className}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }}
    />
  </div>
));
AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
