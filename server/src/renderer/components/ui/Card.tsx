import React, { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

export interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowEffect?: boolean;
  glassmorphism?: boolean;
  onClick?: () => void;
  variants?: Variants;
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  hover: {
    y: -5,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  glowEffect = false,
  glassmorphism = false,
  onClick,
  variants = defaultVariants,
  ...props
}: CardProps) => {
  const baseClasses = 'bg-white border border-border rounded-xl overflow-hidden';
  
  const effectClasses = [
    hoverEffect ? 'card-hover' : '',
    glowEffect ? 'shadow-glow-primary' : 'shadow-soft',
    glassmorphism ? 'glass' : '',
    onClick ? 'cursor-pointer' : ''
  ].filter(Boolean).join(' ');
  
  return (
    <motion.div
      className={`${baseClasses} ${effectClasses} ${className}`}
      initial="hidden"
      animate="visible"
      whileHover={hoverEffect ? "hover" : undefined}
      whileTap={onClick ? "tap" : undefined}
      variants={variants}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ 
  children, 
  className = '',
  ...props
}: { 
  children: ReactNode; 
  className?: string;
  [key: string]: any;
}) => {
  return (
    <motion.div 
      className={`p-6 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardTitle = ({ 
  children, 
  className = ''
}: { 
  children: ReactNode; 
  className?: string;
}) => {
  return (
    <motion.h3 
      className={`text-lg font-medium text-foreground ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {children}
    </motion.h3>
  );
};

export const CardDescription = ({ 
  children, 
  className = ''
}: { 
  children: ReactNode; 
  className?: string;
}) => {
  return (
    <motion.p 
      className={`text-sm text-muted-foreground mt-1 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {children}
    </motion.p>
  );
};

export const CardContent = ({ 
  children, 
  className = ''
}: { 
  children: ReactNode; 
  className?: string;
}) => {
  return (
    <motion.div 
      className={`p-6 pt-0 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
    >
      {children}
    </motion.div>
  );
};

export const CardFooter = ({ 
  children, 
  className = ''
}: { 
  children: ReactNode; 
  className?: string;
}) => {
  return (
    <motion.div 
      className={`p-6 pt-0 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {children}
    </motion.div>
  );
}; 