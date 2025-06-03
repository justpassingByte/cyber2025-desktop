import * as React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({ children, ...props }, ref) => (
  <div ref={ref} {...props} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', overflow: 'hidden', width: 40, height: 40, background: '#e2e8f0' }}>
    {children}
  </div>
));
Avatar.displayName = "Avatar";

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}
export const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(({ ...props }, ref) => (
  <img ref={ref} {...props} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
));
AvatarImage.displayName = "AvatarImage";

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}
export const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(({ children, ...props }, ref) => (
  <div ref={ref} {...props} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#94a3b8', color: '#fff', fontWeight: 600 }}>
    {children}
  </div>
));
AvatarFallback.displayName = "AvatarFallback"; 