import React from 'react';
import { cn } from '../lib/utils';
import { Card, CardContent, CardHeader } from './ui/card';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  valueClassName?: string;
}

export const StatusCard = ({
  title,
  value,
  icon,
  className,
  valueClassName,
}: StatusCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-lg",
      "border-l-4 border-l-primary",
      className
    )}>
      <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        {icon && (
          <div className="text-primary opacity-70">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className={cn(
          "text-2xl font-bold text-gray-900 dark:text-white",
          "animate-in slide-in-from-bottom duration-500",
          valueClassName
        )}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}; 