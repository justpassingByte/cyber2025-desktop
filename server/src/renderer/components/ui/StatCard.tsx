import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from './Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  iconClassName?: string;
  bgColorClass?: string;
  textColorClass?: string;
  borderColorClass?: string;
  iconBgClass?: string;
  iconColorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend = 'neutral',
  trendValue = '0%',
  className = '',
  iconClassName = '',
  bgColorClass = 'bg-gradient-to-br from-blue-50 to-blue-100',
  borderColorClass = 'border-blue-200',
  textColorClass = 'text-blue-900',
  iconBgClass = 'bg-blue-500',
  iconColorClass = 'text-white',
}) => {
  return (
    <Card className={`${borderColorClass} ${bgColorClass} ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`${textColorClass}/60 text-sm font-medium`}>{title}</p>
            <p className={`text-2xl font-bold ${textColorClass}`}>
              {value}
            </p>
            <div className="flex items-center mt-1">
              {trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500 mr-1" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500 mr-1" />}
              <p className={`text-xs ${
                trend === 'up' 
                  ? 'text-green-600' 
                  : trend === 'down' 
                  ? 'text-red-600' 
                  : `${textColorClass}/60`
              }`}>
                {trendValue}
              </p>
            </div>
          </div>
          <div className={`w-12 h-12 ${iconBgClass} rounded-full flex items-center justify-center ${iconClassName}`}>
            <div className={iconColorClass}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 