import * as React from "react";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ value, className, ...props }, ref) => (
  <div ref={ref} className={className} style={{ width: '100%', height: 8, background: '#e2e8f0', borderRadius: 4, ...props.style }} {...props}>
    <div style={{ width: `${value}%`, height: '100%', background: '#06b6d4', borderRadius: 4 }} />
  </div>
));
Progress.displayName = "Progress"; 