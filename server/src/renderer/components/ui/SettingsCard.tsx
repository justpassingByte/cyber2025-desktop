import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from './Card';

export interface SettingsCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
  isSelected?: boolean;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  icon,
  children,
  className = '',
  delay = 0,
  isSelected = false
}) => {
  // Hiệu ứng hover rất nhẹ
  const hoverEffect = {
    scale: 1.01,
    boxShadow: '0 2px 8px 0 rgba(168,85,247,0.05)'
  };
  // Border tím khi selected
  const selectedBorder = isSelected ? 'border-purple-500 ring-1 ring-purple-400' : 'border-border hover:border-purple-400';

  return (
    <motion.div
      whileHover={hoverEffect}
      whileTap={{ scale: 0.98 }}
      className={`bg-white border rounded-lg transition-all ${selectedBorder} ${className}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="text-purple-500">
            {icon}
          </div>
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </motion.div>
  );
};

export interface SettingsGroupProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const SettingsGroup: React.FC<SettingsGroupProps> = ({
  children,
  className = '',
  delay = 0
}) => {
  return (
    <motion.div
      className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
};

export interface SettingsFieldProps {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}

export const SettingsField: React.FC<SettingsFieldProps> = ({
  label,
  children,
  hint,
  className = ''
}) => {
  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
      {children}
      {hint && (
        <p className="text-xs text-muted-foreground mt-1">{hint}</p>
      )}
    </div>
  );
};

export interface SettingsToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
      
      <div 
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-gray-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => !disabled && onChange(!checked)}
      >
        <motion.span 
          className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition"
          animate={{ x: checked ? 20 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
    </div>
  );
};

// Export all components
export const SettingsComponents = {
  Card: SettingsCard,
  Group: SettingsGroup,
  Field: SettingsField,
  Toggle: SettingsToggle
}; 