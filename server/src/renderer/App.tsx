import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Monitor,
  Settings,
  Gamepad2,
  LogOut,
  UtensilsCrossed,
  BarChart3,
  Bell,
  X,
  Menu,
  LucideIcon
} from 'lucide-react';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { Button } from './components/ui/button';

// Import pages
import Dashboard from './pages/dashboard/Dashboard';
import SettingsPage from './pages/settings/Settings';
import RoomPage from './pages/room/Room';
import GamesPage from './pages/games/Games';
import CustomersPage from './pages/customers/Customers';
import FoodPage from './pages/foods/Foods';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Component Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-red-600 bg-red-50 rounded-lg border border-red-200 m-6">
          <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
          <p className="mb-4">{this.state.error?.message || "Unknown error"}</p>
          <pre className="bg-white p-4 rounded overflow-auto max-h-[400px] text-xs">
            {this.state.error?.stack}
          </pre>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Page wrapper to catch and log errors
const PageErrorWrapper = ({ component: Component }: { component: React.ComponentType }) => {
  try {
    console.log(`Rendering component:`, Component.name || 'Unknown');
    return <Component />;
  } catch (error) {
    console.error(`Error rendering component:`, error);
    return (
      <div className="p-6 text-red-600 bg-red-50 rounded-lg border border-red-200">
        <h1 className="text-xl font-bold mb-2">Error rendering page</h1>
        <p>{error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
};

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

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Khách hàng', href: '/customers', icon: Users },
  { name: 'Đồ ăn & Nước uống', href: '/food', icon: UtensilsCrossed },
  { name: 'Trò chơi', href: '/games', icon: Gamepad2 },
  { name: 'Phòng máy', href: '/room', icon: Monitor },
  { name: 'Cài đặt', href: '/settings', icon: Settings },
];

const SidebarContent = ({ pathname, onClose }: { pathname: string; onClose?: () => void }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Monitor className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Admin Panel</span>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = 
            (item.href === "/" && pathname === "/") ||
            (item.href !== "/" && (pathname === item.href || pathname.startsWith(item.href + "/")));
          const Icon = item.icon;
          return (
            <Link key={item.name} to={item.href} onClick={onClose}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
                {isActive && <motion.div layoutId="activeTab" className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Settings and logout */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-500 text-white">
              AD
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
              Administrator
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};

// RouteListener to log route changes
const RouteListener = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Current route:', location.pathname);
  }, [location]);
  
  return null;
};

const MainLayout = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <RouteListener />
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl"
            >
              <SidebarContent pathname={location.pathname} onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:w-80 lg:flex">
        <div className="flex flex-col bg-white shadow-xl">
          <SidebarContent pathname={location.pathname} />
        </div>
      </div>

      <div className="lg:pl-80">
        {/* Header */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white/80 backdrop-blur-lg px-4 sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {navigation.find((item) => 
                  item.href === "/" && location.pathname === "/" ? true : 
                  item.href !== "/" && location.pathname.startsWith(item.href)
                )?.name || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white min-w-[16px] h-4 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
            </div>
          </div>
        </div>

        <motion.main 
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/customers" element={<ErrorBoundary><CustomersPage /></ErrorBoundary>} />
                <Route path="/room" element={<ErrorBoundary><RoomPage /></ErrorBoundary>} />
                <Route path="/games" element={<ErrorBoundary><GamesPage /></ErrorBoundary>} />
                <Route path="/food" element={<ErrorBoundary><FoodPage /></ErrorBoundary>} />
                <Route path="/settings" element={<ErrorBoundary><SettingsPage /></ErrorBoundary>} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </AnimatePresence>
          </ErrorBoundary>
        </motion.main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

export default App; 