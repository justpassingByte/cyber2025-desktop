import React from 'react';
import { 
  Users, 
  DollarSign, 
  Monitor, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  StatCard, 
  StatusCard, 
  ActivityCard,
  ActivityItem 
} from '../../components/ui';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Define activity data structure
const activities: ActivityItem[] = [
  { 
    id: 1, 
    title: 'Nguyễn Văn A đã đăng nhập vào máy PC-01',
    time: '5 phút trước',
    icon: <CheckCircle className="w-5 h-5" />,
    iconBgClass: 'bg-green-500/10',
    iconColorClass: 'text-green-500'
  },
  { 
    id: 2, 
    title: 'Trần Thị B đã mua đồ ăn với giá 50.000 đ',
    time: '15 phút trước',
    icon: <DollarSign className="w-5 h-5" />,
    iconBgClass: 'bg-blue-500/10',
    iconColorClass: 'text-blue-500'
  },
  { 
    id: 3, 
    title: 'Lê Văn C đã chơi game Counter-Strike 2',
    time: '30 phút trước',
    icon: <Monitor className="w-5 h-5" />,
    iconBgClass: 'bg-purple-500/10',
    iconColorClass: 'text-purple-500'
  },
  { 
    id: 4, 
    title: 'Phạm Văn D đã đăng xuất khỏi máy PC-05',
    time: '45 phút trước',
    icon: <Clock className="w-5 h-5" />,
    iconBgClass: 'bg-orange-500/10',
    iconColorClass: 'text-orange-500'
  },
  { 
    id: 5, 
    title: 'Hoàng Văn E đã nạp 100.000 đ vào tài khoản',
    time: '1 giờ trước',
    icon: <DollarSign className="w-5 h-5" />,
    iconBgClass: 'bg-blue-500/10',
    iconColorClass: 'text-blue-500'
  }
];

// Top games component
const TopGames = () => {
  const games = [
    { name: 'Counter-Strike 2', players: 85 },
    { name: 'League of Legends', players: 72 },
    { name: 'PUBG', players: 64 },
    { name: 'Fortnite', players: 57 },
    { name: 'Valorant', players: 48 }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top game phổ biến</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 space-y-4">
        {games.map((game, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg transition-colors"
          >
            <div className="flex items-center">
              <motion.span 
                whileHover={{ scale: 1.2 }}
                className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium mr-2"
              >
                {index + 1}
              </motion.span>
              <span className="text-sm font-medium text-foreground">{game.name}</span>
            </div>
            <div className="bg-secondary h-2 w-24 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${100 - index * 15}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                className="h-full bg-primary"
              />
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        variants={containerVariants}
        className="space-y-6"
      >
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard 
            title="Tổng khách hàng" 
            value="1,234" 
            icon={<Users className="w-5 h-5" />} 
            trend="up" 
            trendValue="+5.2%"
          />
          <StatCard 
            title="Doanh thu hôm nay" 
            value="2,500,000₫" 
            icon={<DollarSign className="w-5 h-5" />} 
            trend="up" 
            trendValue="+12.5%"
          />
          <StatCard 
            title="Máy đang hoạt động" 
            value="25/30" 
            icon={<Monitor className="w-5 h-5" />} 
            trend="neutral" 
            trendValue="0%"
          />
          <StatCard 
            title="Giờ sử dụng" 
            value="350h" 
            icon={<Clock className="w-5 h-5" />} 
            trend="down" 
            trendValue="-2.1%"
          />
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <StatusCard 
            title="Máy đang online" 
            status="online" 
            value={25}
            icon={<CheckCircle className="w-5 h-5" />}
          />
          <StatusCard 
            title="Máy offline" 
            status="offline" 
            value={5}
            icon={<AlertTriangle className="w-5 h-5" />}
          />
          <StatusCard 
            title="Máy cần bảo trì" 
            status="warning" 
            value={3}
            icon={<AlertTriangle className="w-5 h-5" />}
          />
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          <div className="lg:col-span-2">
            <ActivityCard 
              title="Hoạt động gần đây" 
              activities={activities} 
              emptyMessage="Không có hoạt động nào gần đây"
            />
          </div>
          <div>
            <TopGames />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard; 