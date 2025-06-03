import React from 'react';
import { motion } from 'framer-motion';
import { Tag, BadgeCheck } from 'lucide-react';
import { Card } from './Card';

export type FoodCategory = 'drink' | 'snack' | 'meal' | 'dessert';

export interface FoodCardProps {
  id: number;
  name: string;
  price: number;
  category: FoodCategory;
  available: boolean;
  popular?: boolean;
  stock: number;
  image?: string;
  description?: string;
  onClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  index?: number;
  isSelected?: boolean;
  className?: string;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  id,
  name,
  price,
  category,
  available,
  popular = false,
  stock,
  image,
  description,
  onClick,
  onEditClick,
  onDeleteClick,
  index = 0,
  isSelected = false,
  className = ''
}) => {
  // Get category color
  const getCategoryColor = () => {
    switch (category) {
      case 'drink':
        return 'bg-blue-500/10 text-blue-500';
      case 'snack':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'meal':
        return 'bg-green-500/10 text-green-500';
      case 'dessert':
        return 'bg-purple-500/10 text-purple-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };
  
  // Get category label
  const getCategoryLabel = () => {
    switch (category) {
      case 'drink': return 'Đồ uống';
      case 'snack': return 'Đồ ăn vặt';
      case 'meal': return 'Bữa ăn';
      case 'dessert': return 'Tráng miệng';
      default: return 'Không xác định';
    }
  };
  
  // Get availability class
  const getAvailabilityClass = () => {
    if (!available) return 'opacity-60 grayscale';
    if (stock <= 0) return 'opacity-70';
    return '';
  };
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };
  
  // Create a placeholder image if none is provided
  const imageUrl = image || `https://via.placeholder.com/200x200?text=${encodeURIComponent(name)}`;

  // Hiệu ứng hover rất nhẹ
  const hoverEffect = {
    scale: 1.01,
    boxShadow: '0 2px 8px 0 rgba(251,191,36,0.05)'
  };
  const selectedGlow = isSelected ? 'ring-2 ring-yellow-200 shadow-[0_0_4px_1px_rgba(251,191,36,0.06)]' : '';

  return (
    <motion.div
      whileHover={hoverEffect}
      whileTap={{ scale: 0.98 }}
      className={`bg-white border rounded-lg overflow-hidden cursor-pointer transition-all shadow-soft hover:shadow ${selectedGlow} ${
        isSelected 
          ? 'border-yellow-400' 
          : 'border-border hover:border-yellow-300'
      } ${getAvailabilityClass()} ${className}`}
      onClick={onClick}
    >
      <div className="relative">
        <div className="w-full h-40 bg-gray-200 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        {popular && (
          <div 
            className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center text-xs font-medium"
            style={{ filter: 'drop-shadow(0 0 6px #fde68a)' }}
          >
            <BadgeCheck className="w-3 h-3 mr-1" /> Phổ biến
          </div>
        )}
        {!available && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-red-500/20"
          >
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Không có sẵn
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-foreground">
            {name}
          </h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor()}`}>
            {getCategoryLabel()}
          </div>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold text-primary">{formatPrice(price)}</span>
          <span className="text-xs text-muted-foreground">
            Còn: {stock > 0 ? `${stock}` : 'Hết hàng'}
          </span>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}; 