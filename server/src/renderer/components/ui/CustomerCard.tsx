import React from 'react';
import { motion } from 'framer-motion';
import { UserRound } from 'lucide-react';

export interface CustomerCardProps {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  avatarIcon?: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  index?: number;
  className?: string;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  id,
  name,
  email,
  status,
  avatarIcon = <UserRound className="w-5 h-5 text-primary" />,
  isSelected = false,
  onClick,
  index = 0,
  className = ''
}) => {
  // Hiệu ứng hover rất nhẹ
  const hoverEffect = {
    scale: 1.01,
    boxShadow: '0 2px 8px 0 rgba(34,197,94,0.05)'
  };
  const selectedBorder = isSelected ? 'border-green-500 ring-1 ring-green-500' : 'border-border hover:border-green-400';
  const badgeColor = status === 'active'
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';

  return (
    <motion.div
      whileHover={hoverEffect}
      whileTap={{ scale: 0.98 }}
      className={`p-4 border-b border ${selectedBorder} cursor-pointer transition-all bg-white ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
            {avatarIcon}
          </div>
          <div>
            <h3 className="font-medium text-foreground">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {email}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
          {status === 'active' ? 'Hoạt động' : 'Không HĐ'}
        </span>
      </div>
    </motion.div>
  );
}; 