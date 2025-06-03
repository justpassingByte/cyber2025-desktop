import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  Monitor, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  Home,
  UserRound,
  Coffee,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ThemeProvider } from './components/ThemeProvider';
import ThemeSwitcher from './components/ThemeSwitcher';

// Import pages
import Dashboard from './pages/dashboard/Dashboard';
import SettingsPage from './pages/settings/Settings';
import RoomPage from './pages/room/Room';
import GamesPage from './pages/games/Games';
import CustomersPage from './pages/customers/Customers';
import FoodPage from './pages/foods/Foods';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2
    }
  }
};

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div
      animate={{ 
        width: isCollapsed ? 72 : 256,
        x: 0, 
        opacity: 1
      }}
      className="bg-white border-r border-border h-full flex flex-col transition-all duration-300 shadow-md"
      style={{ minWidth: isCollapsed ? 72 : 256, width: isCollapsed ? 72 : 256 }}
      initial={{ x: -10, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo + Collapse Button */}
      <div className={`p-4 border-b border-border flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Monitor className="w-8 h-8 text-primary mr-2" />
          {!isCollapsed && <h1 className="text-xl font-bold text-foreground">CyberCafe Admin</h1>}
        </motion.div>
        <motion.button
          className={`ml-2 p-2 rounded transition-colors ${isCollapsed ? 'bg-secondary text-primary' : 'hover:bg-secondary text-muted-foreground hover:text-primary'}`}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setIsCollapsed((v) => !v)}
          aria-label={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCollapsed ? (
            <ChevronRight className="w-7 h-7" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-2 space-y-1">
        {[
          { path: '/', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, label: 'Dashboard' },
          { path: '/customers', icon: <Users className="w-5 h-5 mr-3" />, label: 'Khách hàng' },
          { path: '/room', icon: <Monitor className="w-5 h-5 mr-3" />, label: 'Phòng máy' },
          { path: '/games', icon: <Gamepad2 className="w-5 h-5 mr-3" />, label: 'Trò chơi' },
          { path: '/food', icon: <Coffee className="w-5 h-5 mr-3" />, label: 'Đồ ăn' },
          { path: '/settings', icon: <Settings className="w-5 h-5 mr-3" />, label: 'Cài đặt' }
        ].map((item) => (
          <motion.div
            key={item.path}
            whileHover={{ 
              x: 4,
              transition: { duration: 0.2 } 
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Link 
              to={item.path} 
              className={`flex items-center px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors ${
                location.pathname === item.path ? 'bg-secondary text-primary shadow-sm' : ''
              }`}
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* User profile */}
      <div className="border-t border-border p-4">
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div 
            className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center shadow-sm"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <UserRound className="w-6 h-6 text-primary" />
          </motion.div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-foreground">Admin</p>
              <p className="text-xs text-muted-foreground">admin@cybercafe.com</p>
            </div>
          )}
          <motion.button 
            className="ml-auto p-1 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground"
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <LogOut className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Header = () => {
  return (
    <motion.header 
      className="bg-white border-b border-border shadow-sm"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-6 py-4 flex items-center justify-end">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ThemeSwitcher />
        </motion.div>
      </div>
    </motion.header>
  );
};

const MainLayout = () => {
  const location = useLocation();
  
  // Get the title based on the current route
  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/customers':
        return 'Quản lý khách hàng';
      case '/room':
        return 'Quản lý phòng máy';
      case '/games':
        return 'Quản lý trò chơi';
      case '/food':
        return 'Quản lý đồ ăn';
      case '/settings':
        return 'Cài đặt hệ thống';
      default:
        return 'CyberCafe Admin';
    }
  };

  return (
    <div className="flex h-screen bg-white text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <motion.main 
          className="flex-1 overflow-auto p-6 bg-slate-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-2xl font-semibold mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {getTitle()}
          </motion.h1>
          
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <Dashboard />
                </motion.div>
              } />
              <Route path="/customers" element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <CustomersPage />
                </motion.div>
              } />
              <Route path="/room" element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <RoomPage />
                </motion.div>
              } />
              <Route path="/games" element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <GamesPage />
                </motion.div>
              } />
              <Route path="/food" element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <FoodPage />
                </motion.div>
              } />
              <Route path="/settings" element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <SettingsPage />
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
        </motion.main>
        <motion.footer 
          className="bg-white border-t border-border py-4 px-6 shadow-inner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-center text-muted-foreground text-sm">
            © 2025 CyberCafe Management System - Server Version 1.0.0
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout />
      </Router>
    </ThemeProvider>
  );
};

export default App; 