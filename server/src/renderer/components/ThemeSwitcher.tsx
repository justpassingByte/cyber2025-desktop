import React from 'react';
import { Sun } from 'lucide-react';

export const ThemeSwitcher: React.FC = () => {
  return (
    <div className="flex items-center bg-muted/30 rounded-md p-1">
      <span className="flex items-center gap-2 px-2 text-primary">
        <Sun className="w-5 h-5" />
        Light mode
      </span>
    </div>
  );
};

export default ThemeSwitcher; 