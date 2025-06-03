declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'react-dom/client' {
  const ReactDOM: any;
  export = ReactDOM;
}

declare module 'class-variance-authority' {
  export function cva(...args: any[]): any;
  export type VariantProps<T> = any;
}

declare module 'clsx' {
  export default function clsx(...args: any[]): string;
  export type ClassValue = string | number | boolean | undefined | null | Record<string, any> | ClassValue[];
}

declare module 'tailwind-merge' {
  export function twMerge(...args: any[]): string;
}

declare module 'lucide-react' {
  import React from 'react';
  
  export interface LucideProps extends React.SVGAttributes<SVGElement> {
    color?: string;
    size?: string | number;
    strokeWidth?: string | number;
  }
  
  export type LucideIcon = React.FC<LucideProps>;
  
  export const AlertCircle: LucideIcon;
  export const Clock: LucideIcon;
  export const Coffee: LucideIcon;
  export const Gift: LucideIcon;
  export const LogOut: LucideIcon;
  export const Mail: LucideIcon;
  export const Moon: LucideIcon;
  export const PlaySquare: LucideIcon;
  export const Receipt: LucideIcon;
  export const Settings: LucideIcon;
  export const Sun: LucideIcon;
  export const Timer: LucideIcon;
  export const User: LucideIcon;
  export const Wallet: LucideIcon;
  export const Monitor: LucideIcon;
}

declare module 'electron-is-dev' {
  const isDev: boolean;
  export = isDev;
}

declare module 'tailwindcss-animate' {
  const plugin: any;
  export = plugin;
} 