import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import {
  Zap,
  Clock,
  Award,
  Gift,
  Monitor,
  Cpu,
  Memory,
  HardDrive,
  Wifi,
  Star,
  Gamepad,
  Users,
} from '../../components/icons';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../components/ThemeProvider';
import { useUserStore } from '../../context/UserContext';

// Component con chuyên biệt để hiển thị thời gian
// Chỉ component này sẽ re-render mỗi giây
const SessionTimeDisplay = () => {
  const { theme } = useTheme();
  // Selector này chỉ lấy time_remaining, nên nó chỉ trigger re-render khi giá trị này thay đổi
  const timeRemaining = useUserStore((state) => state.user?.time_remaining ?? 0);

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
      {formatTime(timeRemaining)}
    </p>
  );
};

export function Dashboard() {
  // Lấy toàn bộ object user. Component này sẽ chỉ re-render khi các giá trị khác time_remaining thay đổi
  // (ví dụ: balance) nhờ vào việc tách bộ đếm ra component riêng.
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const { theme } = useTheme();

  React.useEffect(() => {
    // Chỉ cần kiểm tra user tồn tại hay không. Không cần copy state vào local.
    if (!user) {
      navigate('/'); // Nếu không có user, quay về login
    }
  }, [user, navigate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Nếu user chưa có, không render gì cả để chờ redirect
  if (!user) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
        <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-2`}>
          Welcome back,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
            {user.username || 'User'}!
          </span>
        </h1>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'} text-lg`}>
          Ready for another epic gaming session?
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants}>
          <Card className={`${theme === 'dark' 
            ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30' 
            : 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20'} 
            backdrop-blur-lg`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'} text-sm font-medium`}>
                    Current Balance
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {(user.balance/1000).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}K VND
                  </p>
                </div>
                <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-500/10'} rounded-full flex items-center justify-center`}>
                  <Zap className={`w-6 h-6 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className={`${theme === 'dark' 
            ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30' 
            : 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20'} 
            backdrop-blur-lg`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'} text-sm font-medium`}>
                    Session Time
                  </p>
                  {/* Sử dụng component con ở đây */}
                  <SessionTimeDisplay />
                </div>
                <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-500/10'} rounded-full flex items-center justify-center`}>
                  <Clock className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className={`${theme === 'dark' 
            ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30' 
            : 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20'} 
            backdrop-blur-lg`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${theme === 'dark' ? 'text-green-400' : 'text-green-700'} text-sm font-medium`}>
                    Rank
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {user.rank}
                  </p>
                </div>
                <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-500/10'} rounded-full flex items-center justify-center`}>
                  <Award className={`w-6 h-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className={`${theme === 'dark' 
            ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30' 
            : 'bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20'} 
            backdrop-blur-lg`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${theme === 'dark' ? 'text-orange-400' : 'text-orange-700'} text-sm font-medium`}>
                    Daily Streak
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {user.dailyStreak} days
                  </p>
                </div>
                <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-500/10'} rounded-full flex items-center justify-center`}>
                  <Gift className={`w-6 h-6 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-700'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PC Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className={`${theme === 'dark' 
            ? 'bg-slate-900/50 border-white/10' 
            : 'bg-white/80 border-slate-200'} 
            backdrop-blur-lg`}
          >
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                <Monitor className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                Station #7 - Gaming Beast
              </CardTitle>
              <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                Your current gaming setup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* PC Specs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>CPU Usage</span>
                    </div>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Memory className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>RAM Usage</span>
                    </div>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
              </div>
              {/* System Info */}
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t ${
                theme === 'dark' ? 'border-white/10' : 'border-slate-200'
              }`}>
                <div className="text-center">
                  <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/10'} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <Cpu className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Processor</p>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Intel i9-13900K
                  </p>
                </div>
                <div className="text-center">
                  <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-500/10'} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <Memory className={`w-6 h-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Memory</p>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    32GB DDR5
                  </p>
                </div>
                <div className="text-center">
                  <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-500/10'} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <HardDrive className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Storage</p>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    2TB NVMe
                  </p>
                </div>
              </div>
              {/* Connection Status */}
              <div className={`flex items-center justify-between pt-4 border-t ${
                theme === 'dark' ? 'border-white/10' : 'border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                    Connection Status
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Wifi className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>1000 Mbps</span>
                  </div>
                  <Badge className={`${theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-500/10 text-green-600'}`}>
                    Excellent
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Quick Actions & Notifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Daily Bonus */}
          <Card className={`${theme === 'dark' 
            ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
            : 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20'} 
            backdrop-blur-lg`}
          >
            <CardHeader className="pb-3">
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-lg flex items-center gap-2`}>
                <Gift className={`w-5 h-5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                Daily Bonus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-500/10'} rounded-full flex items-center justify-center mx-auto`}>
                  <span className="text-2xl">🎁</span>
                </div>
                <p className={`${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} font-medium`}>+$2.50 Credits</p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>7-day streak bonus!</p>
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  Claim Reward
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Quick Actions */}
          <Card className={`${theme === 'dark' 
            ? 'bg-slate-900/50 border-white/10' 
            : 'bg-white/80 border-slate-200'} 
            backdrop-blur-lg`}
          >
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-lg`}>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className={`w-full justify-start ${theme === 'dark' 
                  ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20' 
                  : 'border-cyan-600/30 text-cyan-700 hover:bg-cyan-500/10'}`}
              >
                <Gamepad className="w-4 h-4 mr-2" />
                Launch Game
              </Button>
              <Button
                variant="outline"
                className={`w-full justify-start ${theme === 'dark' 
                  ? 'border-purple-500/30 text-purple-400 hover:bg-purple-500/20' 
                  : 'border-purple-600/30 text-purple-700 hover:bg-purple-500/10'}`}
              >
                <Users className="w-4 h-4 mr-2" />
                Find Friends
              </Button>
              <Button
                variant="outline"
                className={`w-full justify-start ${theme === 'dark' 
                  ? 'border-green-500/30 text-green-400 hover:bg-green-500/20' 
                  : 'border-green-600/30 text-green-700 hover:bg-green-500/10'}`}
              >
                <Award className="w-4 h-4 mr-2" />
                Join Tournament
              </Button>
            </CardContent>
          </Card>
          {/* Recent Activity */}
          <Card className={`${theme === 'dark' 
            ? 'bg-slate-900/50 border-white/10' 
            : 'bg-white/80 border-slate-200'} 
            backdrop-blur-lg`}
          >
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-lg`}>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/10'} rounded-full flex items-center justify-center`}>
                  <Award className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Won CS:GO Match
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                    2 hours ago
                  </p>
                </div>
                <Badge className={`${theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-600'}`}>
                  +50 XP
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-500/10'} rounded-full flex items-center justify-center`}>
                  <Star className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Achievement Unlocked
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                    Yesterday
                  </p>
                </div>
                <Badge className={`${theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-500/10 text-green-600'}`}>
                  New
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 