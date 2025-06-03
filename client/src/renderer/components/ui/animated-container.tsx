import React from "react";
import { cn } from "../../lib/utils";

interface AnimatedContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: 
    | "fade-in" 
    | "slide-up" 
    | "slide-down" 
    | "slide-left" 
    | "slide-right" 
    | "zoom-in" 
    | "zoom-out";
  delay?: "none" | "short" | "medium" | "long";
  duration?: "fast" | "normal" | "slow";
  className?: string;
}

export function AnimatedContainer({
  children,
  animation = "fade-in",
  delay = "none",
  duration = "normal",
  className,
  ...props
}: AnimatedContainerProps) {
  const getAnimationClass = () => {
    switch (animation) {
      case "fade-in":
        return "animate-in fade-in";
      case "slide-up":
        return "animate-in slide-in-from-bottom";
      case "slide-down":
        return "animate-in slide-in-from-top";
      case "slide-left":
        return "animate-in slide-in-from-right";
      case "slide-right":
        return "animate-in slide-in-from-left";
      case "zoom-in":
        return "animate-in zoom-in";
      case "zoom-out":
        return "animate-in zoom-out";
      default:
        return "animate-in fade-in";
    }
  };

  const getDelayClass = () => {
    switch (delay) {
      case "short":
        return "delay-100";
      case "medium":
        return "delay-300";
      case "long":
        return "delay-500";
      default:
        return "";
    }
  };

  const getDurationClass = () => {
    switch (duration) {
      case "fast":
        return "duration-200";
      case "normal":
        return "duration-300";
      case "slow":
        return "duration-500";
      default:
        return "duration-300";
    }
  };

  return (
    <div
      className={cn(
        getAnimationClass(),
        getDelayClass(),
        getDurationClass(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 