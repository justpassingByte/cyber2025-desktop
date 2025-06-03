import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={className} style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 8, background: '#e2e8f0', color: '#0e7490', fontWeight: 500, fontSize: 12, ...props.style }} {...props}>
    {children}
  </div>
));
Badge.displayName = "Badge"; 