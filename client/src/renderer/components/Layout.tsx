import React, { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Home,
  CreditCard,
  Monitor,
  Trophy,
  Gift,
  Cpu,
  User,
  MessageCircle,
  Menu,
  X,
  LogOut,
  Coins,
} from '../components/icons';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { useUserStore } from '../context/UserContext';

type NavItem = {
  name: string;
  href: string;
  icon: React.FC<any>;
};

const navigation: NavItem[] = [
  { name: "Dashboard", href: "dashboard", icon: Home },
  { name: "Recharge", href: "recharge", icon: CreditCard },
  { name: "Order Food", href: "food", icon: Gift },
  { name: "Reserve PC", href: "reserve", icon: Monitor },
  { name: "Tournaments", href: "tournaments", icon: Trophy },
  { name: "Rewards", href: "rewards", icon: Gift },
  { name: "My Machine", href: "machine", icon: Cpu },
  { name: "Profile", href: "profile", icon: User },
  { name: "Chat", href: "chat", icon: MessageCircle },
];

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { theme, setTheme } = useTheme();
  
  // Get user data from Zustand store
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const [username, setUsername] = useState('User');
  const [balance, setBalance] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('0h 0m');
  const [rank, setRank] = useState('New Gamer');
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  // Format time remaining for display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  
  useEffect(() => {
    // Check if user exists in store
    if (user) {
      console.log("Layout received user:", user);
      setUsername(user.username);
      setBalance(user.balance);
      setRank(user.rank);
      setTimeRemaining(formatTime(user.timeRemaining));
    } else {
      // Redirect to login if no user found
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    clearUser();
    navigate('/');
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-slate-50 to-white'
    }`}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setSidebarOpen(false)} 
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="absolute left-0 top-0 h-full w-80 bg-slate-900/95 backdrop-blur-lg border-r border-white/10"
            >
              <SidebarContent 
                pathname={pathname} 
                onClose={() => setSidebarOpen(false)} 
                username={username}
                timeRemaining={timeRemaining}
                theme={theme}
                onLogout={handleLogout}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:w-80 lg:flex">
        <div className={`flex flex-col w-full transition-colors duration-700 ${
          theme === 'dark' 
            ? 'bg-slate-900/50 backdrop-blur-lg border-r border-white/10'
            : 'bg-white/80 backdrop-blur-lg border-r border-slate-200 shadow-sm'
        }`}>
          <SidebarContent 
            pathname={pathname} 
            username={username} 
            timeRemaining={timeRemaining}
            theme={theme}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top bar */}
        <div className={`sticky top-0 z-30 flex h-16 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8 transition-colors duration-700 ${
          theme === 'dark'
            ? 'border-b border-white/10 bg-slate-900/50 backdrop-blur-lg'
            : 'border-b border-slate-200 bg-white/80 backdrop-blur-lg shadow-sm'
        }`}>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`lg:hidden ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {navigation.find((item) => `/${item.href}` === pathname)?.name || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className={`rounded-full ${theme === 'dark' ? 'text-white hover:text-cyan-300' : 'text-slate-800 hover:text-cyan-700'}`}
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                )}
              </Button>
              
              {/* Balance */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30'
                  : 'bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-600/30'
              }`}>
                <Coins className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                <span className={`font-medium ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`}>
                  {balance} VND
                </span>
              </div>

              {/* User menu */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center text-white border-2 border-cyan-500/50">
                  {username.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {username}
                  </p>
                  <Badge className={`text-xs ${
                    theme === 'dark' 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'bg-cyan-600/15 text-cyan-700'
                  }`}>
                    {rank}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="relative z-10">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ 
  pathname, 
  onClose,
  username,
  timeRemaining,
  theme,
  onLogout
}: { 
  pathname: string; 
  onClose?: () => void;
  username: string;
  timeRemaining: string;
  theme: string;
  onLogout: () => void;
}) {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex h-16 items-center px-6 transition-colors duration-700 ${
        theme === 'dark' 
          ? 'border-b border-white/10' 
          : 'border-b border-slate-200/50'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Monitor className="w-4 h-4 text-white" />
          </div>
          <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            CyberCafe
          </span>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Navigation links */}
      <nav className={`flex-1 px-4 py-6 space-y-1 transition-colors duration-700 ${
        theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
      }`}>
        {navigation.map((item) => {
          const isActive = pathname === `/${item.href}`;
          const Icon = item.icon;
          return (
            <RouterLink key={item.name} to={`/${item.href}`} className="block">
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? theme === 'dark'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'bg-cyan-600/10 text-cyan-700 border border-cyan-600/30'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
                {isActive && (
                  <motion.div layoutId="activeTab" className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
              </motion.div>
            </RouterLink>
          );
        })}
      </nav>

      {/* User info & logout */}
      <div className={`p-4 transition-colors duration-700 ${
        theme === 'dark' 
          ? 'border-t border-white/10' 
          : 'border-t border-slate-200'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center text-white border-2 border-cyan-500/50">
            {username.charAt(0)}
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {username}
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
              Station #7 • {timeRemaining}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className={`w-full justify-start ${
            theme === 'dark'
              ? 'text-gray-300 hover:text-white hover:bg-red-500/20'
              : 'text-slate-700 hover:text-slate-900 hover:bg-red-500/15'
          }`}
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
} 