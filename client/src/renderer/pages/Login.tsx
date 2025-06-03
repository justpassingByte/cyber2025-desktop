import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, User, Gift, Coffee } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { useTheme } from '../components/ThemeProvider';

export function Login() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username || !password) {
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (username === 'client' && password === 'password') {
        localStorage.setItem('user', JSON.stringify({ username }));
        navigate('/dashboard');
      } else {
        setError('Email hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi đăng nhập');
      console.error(err);
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
      {/* Logo động nổi bật ngoài Card + Tên + Mô tả */}
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
            {error && (
              <div className="mb-2 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/30 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4 mt-6">
              <div className="space-y-2">
                <label htmlFor="customer-email" className="text-sm font-medium text-gray-200">Email</label>
                <Input id="customer-email" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="gamer@cybercafe.com" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <label htmlFor="customer-password" className="text-sm font-medium text-gray-200">Password</label>
                <Input id="customer-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Nhập mật khẩu" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" disabled={isLoading} />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                {isLoading ? 'Logging in...' : 'Enter Gaming Zone'}
              </Button>
            </form>
          </CardContent>
        </Card>
        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-cyan-400">
            <User className="w-6 h-6 mx-auto mb-1" />
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