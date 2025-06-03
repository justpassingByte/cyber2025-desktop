import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Clock, Download } from 'lucide-react';
import { Card } from './Card';

export type GameStatus = 'active' | 'updating' | 'disabled';

export interface GameCardProps {
  id: number;
  name: string;
  publisher: string;
  genre: string[];
  installed: number;
  playTime: number;
  lastUpdated: string;
  version: string;
  status: GameStatus;
  thumbnail?: string;
  size?: string;
  onClick?: () => void;
  isSelected?: boolean;
  index?: number;
  className?: string;
}

export const GameCard: React.FC<GameCardProps> = ({
  id,
  name,
  publisher,
  genre,
  installed,
  playTime,
  lastUpdated,
  version,
  status,
  thumbnail,
  size,
  onClick,
  isSelected = false,
  index = 0,
  className = ''
}) => {
  // Status styles
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return {
          borderColor: 'border-green-500/20',
          bgColor: 'bg-green-500/5',
          textColor: 'text-green-400',
          badgeBgColor: 'bg-green-500/20',
          badgeText: 'Hoạt động',
          animate: false
        };
      case 'updating':
        return {
          borderColor: 'border-blue-500/20',
          bgColor: 'bg-blue-500/5',
          textColor: 'text-blue-400',
          badgeBgColor: 'bg-blue-500/20',
          badgeText: 'Đang cập nhật',
          animate: true
        };
      case 'disabled':
        return {
          borderColor: 'border-red-500/20',
          bgColor: 'bg-red-500/5',
          textColor: 'text-red-400',
          badgeBgColor: 'bg-red-500/20',
          badgeText: 'Bị vô hiệu hóa',
          animate: false
        };
      default:
        return {
          borderColor: 'border-gray-500/20',
          bgColor: 'bg-gray-500/5',
          textColor: 'text-gray-400',
          badgeBgColor: 'bg-gray-500/20',
          badgeText: 'Không xác định',
          animate: false
        };
    }
  };

  const styles = getStatusStyles();
  
  // Format play time
  const formatPlayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Create a placeholder image if none is provided
  const imageUrl = thumbnail || `https://via.placeholder.com/300x150?text=${encodeURIComponent(name)}`;

  // Hiệu ứng hover rất nhẹ
  const hoverEffect = {
    scale: 1.01,
    boxShadow: '0 2px 8px 0 rgba(0,120,255,0.05)'
  };
  const selectedGlow = isSelected ? 'ring-2 ring-blue-200 shadow-[0_0_4px_1px_rgba(59,130,246,0.06)]' : '';

  return (
    <motion.div
      whileHover={hoverEffect}
      whileTap={{ scale: 0.98 }}
      className={`bg-white border rounded-lg overflow-hidden cursor-pointer transition-all shadow-soft hover:shadow ${selectedGlow} ${
        isSelected 
          ? 'border-blue-500' 
          : 'border-border hover:border-blue-300'
      } ${className}`}
      onClick={onClick}
    >
      <div className="relative">
        <div className="h-40 bg-gray-200 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className={`absolute top-0 left-0 right-0 p-2 flex justify-between items-center ${styles.bgColor} border-b ${styles.borderColor}`}
        >
          <div
            className={`flex items-center ${styles.textColor}`}
          >
            <Gamepad2 className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">{installed} máy</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles.badgeBgColor} ${styles.textColor}`}
          >
            {styles.badgeText}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-foreground">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {publisher}
          </p>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {genre.map((item, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-3">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{formatPlayTime(playTime)}</span>
          </div>
          <div>v{version}</div>
        </div>
      </div>
    </motion.div>
  );
}; 