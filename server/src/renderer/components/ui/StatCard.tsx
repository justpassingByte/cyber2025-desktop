import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Card } from './Card';

export interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  colorClass?: string;
  iconBgClass?: string;
  iconColorClass?: string;
  withAnimation?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  colorClass = 'text-primary',
  iconBgClass = 'bg-primary/10',
  iconColorClass = 'text-primary',
  withAnimation = true,
  className = ''
}) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-yellow-500';
  };
  
  return (
    <Card 
      className={className}
      hoverEffect={withAnimation}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <motion.h3
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-muted-foreground font-medium text-sm"
          >
            {title}
          </motion.h3>
          <motion.div
            whileHover={withAnimation ? { rotate: 10, scale: 1.1 } : undefined}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className={`p-2 rounded-lg ${iconBgClass} ${iconColorClass}`}
          >
            {icon}
          </motion.div>
        </div>
        <div className="flex flex-col">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-2xl font-bold text-foreground"
          >
            {value}
          </motion.span>
          
          {trend && trendValue && (
            <div className="flex items-center mt-2">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                className={`flex items-center ${getTrendColor()}`}
              >
                {trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : trend === 'down' ? (
                  <TrendingUp className="w-4 h-4 mr-1 transform rotate-180" />
                ) : (
                  <span className="w-4 h-4 mr-1">―</span>
                )}
                <span className="text-xs font-medium">{trendValue}</span>
              </motion.div>
              <span className="text-xs text-muted-foreground ml-1">so với trước</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}; 