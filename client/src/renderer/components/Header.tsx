import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut, User, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';

interface HeaderProps {
  username: string;
  onLogout: () => void;
}

export const Header = ({ username, onLogout }: HeaderProps) => {
  const [time, setTime] = React.useState(new Date());
  const { theme, setTheme } = useTheme();

  // Update clock every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-md dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <div className="flex items-center space-x-2">
          <img 
            src="https://via.placeholder.com/32" 
            alt="Logo" 
            className="h-8 w-8 rounded-md"
          />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Cybercafe Client
          </h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4" />
          <span>{time.toLocaleTimeString()}</span>
        </div>
        
        <div className="flex items-center space-x-1 text-sm font-medium text-gray-900 dark:text-white">
          <User className="h-4 w-4" />
          <span>{username}</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={onLogout}
          className="flex items-center space-x-1"
        >
          <LogOut className="mr-1 h-4 w-4" />
          <span>Đăng xuất</span>
        </Button>
      </div>
    </header>
  );
}; 