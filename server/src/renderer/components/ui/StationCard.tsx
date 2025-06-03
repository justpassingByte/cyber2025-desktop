import React from 'react';
import { motion } from 'framer-motion';
import { UserRound } from 'lucide-react';
import { Card } from './Card';

export type StationStatus = 'available' | 'occupied' | 'maintenance';

export interface StationCardProps {
  id: number;
  name: string;
  status: StationStatus;
  currentUser?: string;
  timeRemaining?: string;
  cpuUsage: number;
  ramUsage: number;
  isSelected?: boolean;
  onClick?: () => void;
  index?: number;
  className?: string;
}

export const StationCard: React.FC<StationCardProps> = ({
  id,
  name,
  status,
  currentUser,
  timeRemaining,
  cpuUsage,
  ramUsage,
  isSelected = false,
  onClick,
  index = 0,
  className = ''
}) => {
  const getHeaderStyles = () => {
    switch (status) {
      case 'available':
        return {
          borderClass: 'border-green-500/30',
          bgClass: 'bg-green-500/10',
          statusClass: 'bg-green-500',
          textClass: 'text-green-400',
          statusText: 'Sẵn sàng'
        };
      case 'maintenance':
        return {
          borderClass: 'border-yellow-500/30',
          bgClass: 'bg-yellow-500/10',
          statusClass: 'bg-yellow-500',
          textClass: 'text-yellow-400',
          statusText: 'Đang bảo trì'
        };
      case 'occupied':
        return {
          borderClass: 'border-red-500/30',
          bgClass: 'bg-red-500/10',
          statusClass: 'bg-red-500',
          textClass: 'text-red-400',
          statusText: `Đang sử dụng${timeRemaining ? ` - ${timeRemaining} còn lại` : ''}`
        };
      default:
        return {
          borderClass: 'border-gray-300',
          bgClass: 'bg-gray-100',
          statusClass: 'bg-gray-400',
          textClass: 'text-gray-500',
          statusText: 'Unknown'
        };
    }
  };

  const styles = getHeaderStyles();
  
  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.4,
            delay: index * 0.05
          }
        }
      }}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`bg-white border rounded-lg overflow-hidden cursor-pointer transition-all shadow-soft hover:shadow-md ${
        isSelected 
          ? 'border-blue-500 ring-1 ring-blue-500 shadow-glow-primary' 
          : 'border-border hover:border-gray-400'
      } ${className}`}
      onClick={onClick}
    >
      <motion.div 
        className={`p-4 border-b ${styles.borderClass} ${styles.bgClass}`}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-foreground">{name}</h3>
          <motion.div 
            className={`w-3 h-3 rounded-full ${styles.statusClass}`}
            animate={status === 'occupied' ? { scale: [1, 1.2, 1] } : {}}
            transition={status === 'occupied' ? { repeat: Infinity, duration: 1.5 } : {}}
          ></motion.div>
        </div>
        <p className={`text-xs ${styles.textClass}`}>
          {styles.statusText}
        </p>
      </motion.div>
      
      <div className="p-4">
        {status === 'occupied' && currentUser && (
          <div className="flex items-center mb-3">
            <motion.div 
              className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-2"
              whileHover={{ scale: 1.2, rotate: 10 }}
            >
              <UserRound className="w-3 h-3 text-blue-400" />
            </motion.div>
            <span className="text-xs text-foreground truncate">{currentUser}</span>
          </div>
        )}
        
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">CPU</span>
              <span className="text-foreground">{cpuUsage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <motion.div 
                className="bg-blue-500 h-1.5 rounded-full" 
                style={{ width: 0 }}
                animate={{ width: `${cpuUsage}%` }}
                transition={{ duration: 1, delay: 0.1 + index * 0.05 }}
              ></motion.div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">RAM</span>
              <span className="text-foreground">{ramUsage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <motion.div 
                className="bg-purple-500 h-1.5 rounded-full" 
                style={{ width: 0 }}
                animate={{ width: `${ramUsage}%` }}
                transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
              ></motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 