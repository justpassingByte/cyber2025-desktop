import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';

export type StatusType = 'online' | 'offline' | 'warning' | 'success' | 'info';

export interface StatusCardProps {
  title: string;
  status: StatusType;
  value: string | number;
  icon: ReactNode;
  label?: string;
  className?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  status,
  value,
  icon,
  label,
  className = ''
}) => {
  // Define status styles based on status type
  const getStatusStyles = () => {
    switch (status) {
      case 'online':
      case 'success':
        return {
          iconBg: 'bg-green-500/10',
          iconColor: 'text-green-500',
          badgeBg: 'bg-green-500/10',
          badgeColor: 'text-green-500',
          animate: false
        };
      case 'offline':
        return {
          iconBg: 'bg-red-500/10',
          iconColor: 'text-red-500',
          badgeBg: 'bg-red-500/10',
          badgeColor: 'text-red-500',
          animate: false
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-500/10',
          iconColor: 'text-amber-500',
          badgeBg: 'bg-amber-500/10',
          badgeColor: 'text-amber-500',
          animate: true
        };
      case 'info':
        return {
          iconBg: 'bg-blue-500/10',
          iconColor: 'text-blue-500',
          badgeBg: 'bg-blue-500/10',
          badgeColor: 'text-blue-500',
          animate: false
        };
      default:
        return {
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
          badgeBg: 'bg-primary/10',
          badgeColor: 'text-primary',
          animate: false
        };
    }
  };

  const styles = getStatusStyles();
  const displayLabel = label || status.toUpperCase();

  return (
    <Card className={className}>
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
            className={`p-2 rounded-lg ${styles.iconBg} ${styles.iconColor}`}
            animate={styles.animate ? { scale: [1, 1.05, 1] } : undefined}
            transition={styles.animate ? { repeat: Infinity, duration: 2 } : undefined}
          >
            {icon}
          </motion.div>
        </div>

        <div className="flex items-center space-x-2">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-2xl font-bold text-foreground"
          >
            {value}
          </motion.span>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={`px-2 py-1 rounded text-xs font-medium ${styles.badgeBg} ${styles.badgeColor}`}
          >
            {displayLabel}
          </motion.div>
        </div>
      </div>
    </Card>
  );
}; 