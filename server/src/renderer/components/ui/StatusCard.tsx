import React, { ReactNode } from 'react';
import { Card, CardContent } from './Card';

export interface StatusCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  status: 'online' | 'offline' | 'warning';
  className?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  icon,
  status,
  className = '',
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return {
          bg: 'bg-green-500',
          text: 'text-green-500',
          bgLight: 'bg-green-50',
          border: 'border-green-200',
        };
      case 'offline':
        return {
          bg: 'bg-red-500',
          text: 'text-red-500',
          bgLight: 'bg-red-50',
          border: 'border-red-200',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          text: 'text-yellow-500',
          bgLight: 'bg-yellow-50',
          border: 'border-yellow-200',
        };
      default:
        return {
          bg: 'bg-gray-500',
          text: 'text-gray-500',
          bgLight: 'bg-gray-50',
          border: 'border-gray-200',
        };
    }
  };

  const { bg, text, bgLight, border } = getStatusColor();

  return (
    <Card className={`${border} ${bgLight} ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`w-10 h-10 ${bg} opacity-20 rounded-full flex items-center justify-center mr-4`}>
            <div className={text}>
              {icon}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="flex items-center mt-1">
              <span className={`w-2 h-2 ${bg} rounded-full mr-2`}></span>
              <p className={`text-2xl font-bold`}>{value}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 