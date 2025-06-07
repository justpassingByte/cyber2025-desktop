import React from 'react';
import { 
  Users, 
  DollarSign, 
  Monitor, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Gamepad2,
  PlusCircle,
  TimerReset,
  Coffee,
  Settings,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription,
  Badge,
  StatCard,
  ActivityCard,
  ActivityItem
} from '../../components/ui';
import TopUpTester from '../../components/TopUpTester';

console.log('Dashboard module loading...');

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
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

const StationStatus = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="w-5 h-5 text-blue-600" />
          Tổng quan trạng thái máy
        </CardTitle>
        <CardDescription>Theo dõi trạng thái hoạt động của tất cả máy trạm</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }, (_, i) => {
            const stationId = i + 1;
            const status = stationId === 4 ? "maintenance" : stationId <= 8 ? "occupied" : "available";
            
            return (
              <motion.div
                key={stationId}
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  status === "occupied"
                    ? "border-red-200 bg-red-50"
                    : status === "maintenance"
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-green-200 bg-green-50"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      status === "occupied"
                        ? "bg-red-500"
                        : status === "maintenance"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  >
                    {status === "occupied" ? (
                      <Users className="w-4 h-4 text-white" />
                    ) : status === "maintenance" ? (
                      <AlertTriangle className="w-4 h-4 text-white" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <p className="font-medium text-gray-900">PC #{stationId}</p>
                  <Badge
                    variant="secondary"
                    className={
                      status === "occupied"
                        ? "bg-red-100 text-red-800"
                        : status === "maintenance"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }
                  >
                    {status === "occupied" ? "Đang sử dụng" : status === "maintenance" ? "Bảo trì" : "Sẵn sàng"}
                  </Badge>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const SystemAlerts = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          Cảnh báo hệ thống
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800">PC #4 đang bảo trì</p>
            <p className="text-xs text-yellow-600">Dự kiến hoàn thành trong 2 giờ</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Clock className="w-5 h-5 text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800">Giờ cao điểm sắp bắt đầu</p>
            <p className="text-xs text-blue-600">Dự kiến lượng truy cập cao</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">Hệ thống hoạt động bình thường</p>
            <p className="text-xs text-green-600">Không có vấn đề nghiêm trọng</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// const TopGames = () => {
//   const games = [
//     { name: 'Counter-Strike 2', players: 85 },
//     { name: 'League of Legends', players: 72 },
//     { name: 'PUBG', players: 64 },
//     { name: 'Fortnite', players: 57 },
//     { name: 'Valorant', players: 48 }
//   ];

//   return (
//     <Card className="h-full">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Gamepad2 className="w-5 h-5 text-purple-600" />
//           Top game phổ biến
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="pt-2 space-y-4">
//         {games.map((game, index) => (
//           <motion.div 
//             key={index}
//             className="flex items-center justify-between hover:bg-slate-50 p-3 rounded-lg transition-colors border border-gray-100"
//             whileHover={{ scale: 1.02 }}
//           >
//             <div className="flex items-center">
//               <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium mr-3">
//                 {index + 1}
//               </div>
//               <span className="font-medium">{game.name}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="text-sm font-medium text-gray-700">{game.players}</div>
//               <div className="bg-gray-200 h-2 w-24 rounded-full overflow-hidden">
//                 <div 
//                   style={{ width: `${100 - index * 15}%` }}
//                   className="h-full bg-purple-500"
//                 />
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </CardContent>
//     </Card>
//   );
// };

const QuickActions = () => {
  const actions = [
    { 
      title: 'Thêm khách hàng', 
      icon: <PlusCircle className="w-5 h-5" />, 
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-200', 
      textColor: 'text-blue-700', 
      onClick: () => console.log('Add customer') 
    },
    { 
      title: 'Bắt đầu phiên mới', 
      icon: <TimerReset className="w-5 h-5" />, 
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-200', 
      textColor: 'text-green-700', 
      onClick: () => console.log('Start new session')
    },
    { 
      title: 'Nạp tiền', 
      icon: <DollarSign className="w-5 h-5" />, 
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-200', 
      textColor: 'text-purple-700',
      onClick: () => console.log('Add funds')
    },
    { 
      title: 'Quản lý thực phẩm', 
      icon: <Coffee className="w-5 h-5" />, 
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-200', 
      textColor: 'text-orange-700',
      onClick: () => console.log('Manage food')
    },
    { 
      title: 'Thiết lập hệ thống', 
      icon: <Settings className="w-5 h-5" />, 
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-200', 
      textColor: 'text-pink-700',
      onClick: () => console.log('System settings')
    },
    { 
      title: 'Hỗ trợ', 
      icon: <MessageCircle className="w-5 h-5" />, 
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-200', 
      textColor: 'text-cyan-700', 
      onClick: () => console.log('Support')
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          Thao tác nhanh
        </CardTitle>
        <CardDescription>Các thao tác thường dùng</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <motion.button
              key={index}
              className={`flex flex-col items-center p-4 rounded-lg ${action.bgColor} ${action.textColor} transition-all border ${action.borderColor} hover:shadow-md`}
              onClick={action.onClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-10 h-10 rounded-full ${action.textColor} bg-white flex items-center justify-center mb-2`}>
                {action.icon}
              </div>
              <span className="text-sm font-medium text-center">{action.title}</span>
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  console.log('Dashboard rendering...');

  try {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 space-y-6"
      >
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Chào mừng đến với{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              CyberCafe Admin
            </span>
          </h1>
          <p className="text-gray-600 text-lg">Theo dõi và quản lý hoạt động của quán net</p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={itemVariants}>
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Khách hàng</p>
                    <p className="text-2xl font-bold text-blue-900">1,234</p>
                    <p className="text-xs text-blue-600">+5.2% từ hôm qua</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Doanh thu hôm nay</p>
                    <p className="text-2xl font-bold text-green-900">2,500,000₫</p>
                    <p className="text-xs text-green-600">+12.5% từ hôm qua</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Máy đang hoạt động</p>
                    <p className="text-2xl font-bold text-purple-900">25/30</p>
                    <p className="text-xs text-purple-600">1 máy đang bảo trì</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Giờ cao điểm</p>
                    <p className="text-2xl font-bold text-orange-900">18:00</p>
                    <p className="text-xs text-orange-600">Thời gian hoạt động nhiều nhất</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Content - Quick Actions and Station Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <QuickActions />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <StationStatus />
          </motion.div>
        </div>

        {/* System Alerts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SystemAlerts />
            {/* <TopGames /> */}
          </motion.div>
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ActivityCard 
              title="Hoạt động gần đây" 
              activities={activities}
              emptyMessage="Không có hoạt động nào gần đây"
            />
          </motion.div>
        </div>
      </motion.div>
    );
  } catch (error: any) {
    console.error('Error rendering Dashboard:', error);
    return <div>Error loading dashboard: {error.message}</div>;
  }
};

export default Dashboard; 