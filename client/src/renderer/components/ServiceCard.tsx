import React from 'react';
import { cn } from '../lib/utils';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
}

export const ServiceCard = ({ 
  icon, 
  title, 
  description, 
  onClick,
  className 
}: ServiceCardProps) => (
  <div 
    className={cn(
      "rounded-lg bg-white p-4 shadow transition-all cursor-pointer",
      "hover:bg-gray-50 hover:shadow-md hover:scale-105",
      "dark:bg-gray-800 dark:hover:bg-gray-700",
      "transform transition-all duration-200 ease-in-out",
      "border border-transparent hover:border-primary/20",
      className
    )}
    onClick={onClick}
  >
    <div className="mb-3 text-primary transition-transform duration-200 group-hover:scale-110">
      {icon}
    </div>
    <h3 className="mb-2 text-md font-medium text-gray-900 dark:text-white">
      {title}
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {description}
    </p>
  </div>
); 