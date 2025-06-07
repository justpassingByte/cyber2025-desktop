import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, User as LucideUser, Gift, Coffee } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { useTheme } from '../components/ThemeProvider';
import authService from '../services/authService';
import { useUserStore } from '../context/UserContext';
import type { User } from '../context/UserContext';

export function Login() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const setUser = useUserStore((state) => state.setUser);
  
  // States for UI
  const [isLoading, setIsLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState('');
  const [isSocketConnected, setIsSocketConnected] = React.useState(true);

  // Kiểm tra trạng thái kết nối socket mỗi khi mở trang
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const connected = await authService.isSocketConnected();
        if (mounted) setIsSocketConnected(!!connected);
      } catch {
        if (mounted) setIsSocketConnected(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Xử lý đăng nhập
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    try {
      // Kiểm tra nhập liệu
      if (!username || !password) {
        setLoginError('Vui lòng nhập username/email/phone và mật khẩu');
        setIsLoading(false);
        return;
      }
      
      // Kiểm tra kết nối socket
      const connected = await authService.isSocketConnected();
      if (!connected) {
        setLoginError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
        setIsLoading(false);
        setIsSocketConnected(false);
        return;
      }
      setIsSocketConnected(true);
      
      // Gọi API đăng nhập qua authService
      const response = await authService.login({ 
        username, 
        password 
      });

      // Xử lý kết quả đăng nhập
      if (response.success && response.customer) {
        // Đảm bảo object có đủ trường username, id, balance
        const customer = response.customer as any;
        
        // Log the customer data received from API
        console.log("API customer data:", customer);
        
        const userObj: User = {
          id: customer.id,
          username: customer.username ?? customer.name ?? '',
          email: customer.email ?? '',
          balance: customer.balance ?? 0,
          // Map from snake_case time_remaining to camelCase timeRemaining
          time_remaining: customer.time_remaining ?? 0,
          rank: customer.rank ?? 'Pro Gamer',
          dailyStreak: customer.dailyStreak ?? 7
        };
        
        console.log("Setting user data:", userObj);
        setUser(userObj);
        // Đăng ký socket với server để nhận notification
        if (window.require) {
          const { ipcRenderer } = window.require('electron');
          // Gửi userId lên main process để emit qua socket
          ipcRenderer.invoke('socket:register-user', userObj.id);
        }
        navigate('/dashboard');
      } else {
        setLoginError(response.error || 'Đăng nhập thất bại, vui lòng kiểm tra thông tin đăng nhập');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={
        `flex min-h-screen flex-col items-center justify-center relative overflow-hidden ` +
        `transition-colors duration-700 ` +
        (theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
          : 'bg-gradient-to-br from-blue-100 via-purple-100 to-white')
      }
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none transition-colors duration-700">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>
      <div className="absolute top-4 right-4 z-20">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          )}
        </Button>
      </div>
      {/* Logo and description */}
      <div className="flex flex-col items-center mb-8 z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0, y: -40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.2 }}
          className="mb-4"
        >
          <img src="/assets/logo.png" alt="CyberCafe Logo" className="w-24 h-24 rounded-full shadow-lg" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-3xl font-bold text-white mb-2 text-center"
        >
          CyberCafe 2025
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-gray-300 text-center"
        >
          Next-gen gaming experience
        </motion.p>
      </div>
      <div className="w-full max-w-md z-10">
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl transition-colors duration-700">
          <CardContent>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-2xl font-bold text-white mb-6 text-center"
            >
              Welcome back!
            </motion.h1>
            {loginError && (
              <div className="mb-2 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/30 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>{loginError}</span>
              </div>
            )}
            {!isSocketConnected && (
              <div className="mb-2 flex items-center gap-2 rounded-md bg-yellow-50 p-3 text-sm text-yellow-500 dark:bg-yellow-900/30 dark:text-yellow-400">
                <AlertCircle className="h-4 w-4" />
                <span>Đang kết nối đến máy chủ...</span>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4 mt-6">
              <div className="space-y-2">
                <label htmlFor="customer-email" className="text-sm font-medium text-gray-200">Username/Email/Phone</label>
                <Input id="customer-email" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="gamer@cybercafe.com" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <label htmlFor="customer-password" className="text-sm font-medium text-gray-200">Mật khẩu</label>
                <Input id="customer-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" disabled={isLoading} />
              </div>
              <Button type="submit" disabled={isLoading || !isSocketConnected} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>
          </CardContent>
        </Card>
        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-cyan-400">
            <LucideUser className="w-6 h-6 mx-auto mb-1" />
            <p className="text-xs">Community</p>
          </div>
          <div className="text-purple-400">
            <Gift className="w-6 h-6 mx-auto mb-1" />
            <p className="text-xs">Tournaments</p>
          </div>
          <div className="text-pink-400">
            <Coffee className="w-6 h-6 mx-auto mb-1" />
            <p className="text-xs">Cafe</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 