import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  UserRound, 
  Clock, 
  DollarSign, 
  Mail, 
  Phone, 
  CalendarDays, 
  UserPlus, 
  Users, 
  Star, 
  MoreVertical,
  Send,
  Activity,
  Database,
  Wifi,
  WifiOff,
  Bot,
  MapPin,
  Key,
  RefreshCcw
} from 'lucide-react';
import Modal from '../../components/Modal';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Badge, Button } from '../../components/ui';
import UserTopUpTester from '../../components/UserTopUpTester';
import TopUpTester from '../../components/TopUpTester';
import axios from 'axios';
import io from 'socket.io-client';
import { CustomerDetail } from '../../services/customerService';
import SystemNotification from '../../components/SystemNotification';
import { useCustomerStore } from '../../stores/customerStore';
const { ipcRenderer } = window.require('electron');

// Thêm định nghĩa enum cho trạng thái khách hàng
type CustomerStatus = 'active' | 'suspended' | 'inactive';

// CustomerDetail được import từ service, không cần định nghĩa lại ở đây

// Component hiển thị một dòng trong hoạt động gần đây
const ActivityItem = ({ activity }: { activity: any }) => {
  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'login':
        return <UserRound className="w-4 h-4 text-blue-500" />;
      case 'logout':
        return <WifiOff className="w-4 h-4 text-gray-500" />;
      case 'topup':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'view_transactions':
        return <Activity className="w-4 h-4 text-purple-500" />;
      case 'session_start':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'session_end':
        return <Clock className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: any) => {
    const time = new Date(activity.timestamp).toLocaleTimeString();
    const date = new Date(activity.timestamp).toLocaleDateString();
    
    switch (activity.action) {
      case 'login':
        return `Đăng nhập vào hệ thống`;
      case 'logout':
        return `Đăng xuất khỏi hệ thống`;
      case 'topup':
        return `Nạp ${activity.details?.amount?.toLocaleString() || 0} VND vào tài khoản`;
      case 'view_transactions':
        return `Xem lịch sử giao dịch`;
      case 'session_start':
        return `Bắt đầu phiên sử dụng máy #${activity.details?.computer_id || '?'}`;
      case 'session_end':
        return `Kết thúc phiên sử dụng máy #${activity.details?.computer_id || '?'}`;
      default:
        return activity.action;
    }
  };

  return (
    <motion.div
      className="flex items-center gap-3 p-3 border-b border-gray-100"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        {getActivityIcon(activity.action)}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-800">{getActivityText(activity)}</p>
        <p className="text-xs text-gray-500">
          {new Date(activity.timestamp).toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
};

const CustomerDetails = ({ customer, onTopup, onResetPassword, onEdit, onDelete }: { 
  customer: CustomerDetail | null, 
  onTopup: () => void, 
  onResetPassword: () => void,
  onEdit: () => void,
  onDelete: () => void
}) => {
  console.log('[CustomerDetails] Rendered with customer:', customer);
  const [showAccountActions, setShowAccountActions] = useState(false);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  
  // Lấy hoạt động gần đây khi khách hàng được chọn
  useEffect(() => {
    if (customer) {
      setLoadingLogs(true);
      setActivityLogs([]);
      
      const fetchCustomerLogs = async () => {
        try {
          const result = await ipcRenderer.invoke('logs:getCustomerTimeline', customer.id, 10, 0);
          console.log('Customer logs:', result);
          
          if (Array.isArray(result)) {
            setActivityLogs(result);
          } else {
            setActivityLogs([]);
          }
        } catch (error) {
          console.error('Error fetching customer logs:', error);
        } finally {
          setLoadingLogs(false);
        }
      };
      
      fetchCustomerLogs();
    }
  }, [customer]);

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Chọn khách hàng để xem chi tiết</p>
      </div>
    );
  }

  // Thông tin liên hệ thực tế
  const contactDetails = [
    { label: 'Email', value: customer.email, icon: <Mail className="w-4 h-4 text-blue-500" /> },
    { label: 'Số điện thoại', value: customer.phone, icon: <Phone className="w-4 h-4 text-green-500" /> },
    { label: 'Ngày đăng ký', value: customer.memberSince, icon: <CalendarDays className="w-4 h-4 text-purple-500" /> },
    customer.address ? { label: 'Địa chỉ', value: customer.address, icon: <MapPin className="w-4 h-4 text-orange-500" /> } : null,
    customer.dob ? { label: 'Ngày sinh', value: customer.dob, icon: <CalendarDays className="w-4 h-4 text-yellow-500" /> } : null,
  ].filter((d): d is { label: string; value: string; icon: JSX.Element } => d !== null);

  // TODO: Lấy activityList thực từ API/logs nếu cần
  // const activityList = ...

  return (
    <div className="p-6 space-y-6">
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center">
          <motion.div 
            className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mr-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            whileHover={{ rotate: 10, scale: 1.1 }}
          >
            <UserRound className="w-8 h-8 text-primary" />
          </motion.div>
          <div>
            <motion.h2 
              className="text-xl font-bold text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {customer.name}
            </motion.h2>
            <motion.p 
              className="text-muted-foreground text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              {customer.email}
            </motion.p>
          </div>
        </div>
        <div className="flex space-x-2">
          <motion.button 
            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onEdit}
            title="Chỉnh sửa tài khoản"
          >
            <Edit className="w-5 h-5" />
          </motion.button>
          <motion.button 
            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-destructive"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDelete}
            title="Xóa tài khoản"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
          <motion.button 
            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-yellow-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onResetPassword}
            title="Reset mật khẩu về '1'"
          >
            <Key className="w-5 h-5" />
          </motion.button>
          <motion.button 
            className="p-2 rounded-md bg-green-100 text-green-700 hover:bg-green-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onTopup}
            title="Nạp tiền"
          >
            <DollarSign className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
      {showAccountActions && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded flex items-center gap-3">
          <Key className="w-5 h-5 text-yellow-600" />
          <button
            className="text-yellow-800 font-medium hover:underline"
            onClick={onResetPassword}
            title="Đặt lại mật khẩu về '1'"
          >
            Đặt lại mật khẩu về '1'
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contactDetails.map((detail, index) => (
              <motion.div 
                key={detail.label}
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (index * 0.1), duration: 0.3 }}
              >
                <div className="p-2 rounded-md bg-primary/10 mr-3">
                  {detail.icon}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{detail.label}</p>
                  <p className="text-foreground">{detail.value}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Thống kê</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs text-muted-foreground">Tổng chi tiêu</p>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                <p className="text-xl font-bold text-foreground">{customer.totalSpent.toLocaleString('vi-VN')} đ</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs text-muted-foreground">Số giờ chơi</p>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-blue-500 mr-1" />
                <p className="text-xl font-bold text-foreground">{customer.hoursPlayed || 0}h</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs text-muted-foreground">Trạng thái</p>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                customer.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : customer.status === 'suspended'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
              }`}>
                {customer.status === 'active' ? 'Đang hoạt động' : 
                 customer.status === 'suspended' ? 'Đã khóa' : 'Không hoạt động'}
              </div>
            </motion.div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="space-y-1 max-h-72 overflow-y-auto"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {loadingLogs ? (
                <div className="flex items-center justify-center py-4">
                  <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : activityLogs.length > 0 ? (
                activityLogs.map((activity, index) => (
                  <ActivityItem key={activity.id || index} activity={activity} />
                ))
              ) : (
                <p className="text-center py-4 text-gray-500">Không có hoạt động nào gần đây</p>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'suspended':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const CustomerRow = ({ 
  customer, 
  onClick, 
  isSelected 
}: { 
  customer: CustomerDetail, 
  onClick: () => void, 
  isSelected: boolean 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`flex items-center justify-between p-4 border rounded-lg transition-colors cursor-pointer ${
        isSelected ? 'bg-primary/10 border-primary/20' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <UserRound className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{customer.name}</h3>
          <p className="text-sm text-gray-500">{customer.email}</p>
          <p className="text-xs text-gray-400">Tham gia {customer.memberSince}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">{customer.balance?.toLocaleString('vi-VN')}đ</p>
          <p className="text-xs text-gray-500">Số dư</p>
        </div>
        <Badge className={getStatusColor(customer.status)}>
          {customer.status === 'active' ? 'Hoạt động' : 
           customer.status === 'suspended' ? 'Đã khóa' : 'Không hoạt động'}
        </Badge>
      </div>
    </motion.div>
  )
};

// Thêm component giả lập bot
const BotSimulator = () => {
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const amountNum = parseFloat(amount);
      if (!username || isNaN(amountNum) || amountNum <= 0) {
        setError('Vui lòng điền đầy đủ thông tin hợp lệ');
        setLoading(false);
        return;
      }

      // Gọi API như bot sẽ gọi
      const response = await axios.post('http://localhost:3000/api/topup/notify', {
        username,
        amount: amountNum,
        message: message || 'Nạp tiền qua bot'
      });

      setResult(response.data);
      // Reset form sau khi thành công
      if (response.data.success) {
        setUsername('');
        setAmount('');
        setMessage('');
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.response?.data?.error || err.message || 'Lỗi khi gửi yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-500" />
          Giả lập Bot Nạp Tiền
        </CardTitle>
        <CardDescription>Giả lập bot gửi thông báo nạp tiền đến server</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bot-username" className="block text-sm font-medium text-gray-700 mb-1">
              Tên người dùng
            </label>
            <input
              id="bot-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Nhập tên người dùng cần nạp tiền"
            />
          </div>
          
          <div>
            <label htmlFor="bot-amount" className="block text-sm font-medium text-gray-700 mb-1">
              Số tiền
            </label>
            <input
              id="bot-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Nhập số tiền"
              min="1000"
            />
          </div>
          
          <div>
            <label htmlFor="bot-message" className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <input
              id="bot-message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Nội dung ghi chú (không bắt buộc)"
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Send className="w-4 h-4 mr-2" />
                Gửi thông báo nạp tiền
              </span>
            )}
          </Button>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}
          
          {result && result.success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
              <p>Nạp tiền thành công!</p>
              <p className="text-xs mt-1">ID giao dịch: {result.transaction._id}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

// Component theo dõi kết nối
const ConnectionMonitor = () => {
  const [socketStatus, setSocketStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [activeConnections, setActiveConnections] = useState<{socketId: string, username: string}[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const socketRef = React.useRef<any>(null);
  
  // Kiểm tra trạng thái kết nối server
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/health');
        if (response.ok) {
          setSocketStatus('connected');
        } else {
          setSocketStatus('disconnected');
        }
      } catch (error) {
        setSocketStatus('disconnected');
      }
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Lấy dữ liệu giao dịch
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/transactions');
      if (response.data && response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Lấy dữ liệu ban đầu và thiết lập kết nối socket
  useEffect(() => {
    fetchTransactions();
    
    // Kết nối socket để lắng nghe cập nhật
    try {
      const socket = io('http://localhost:3000');
      socketRef.current = socket;
      
      // Lắng nghe sự kiện admin notification
      socket.on('admin:topup-notification', (data) => {
        console.log('Nhận thông báo admin về nạp tiền:', data);
        // Cập nhật giao dịch mới ngay lập tức
        if (data.transaction) {
          setTransactions(prev => [data.transaction, ...prev]);
        }
      });
      
      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    } catch (error) {
      console.error('Error setting up socket connection:', error);
    }
  }, []);
  
  const handleRefresh = () => {
    fetchTransactions();
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-500" />
          <CardTitle>Theo dõi hệ thống</CardTitle>
        </div>
        <Button
          onClick={handleRefresh}
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            socketStatus === 'connected' ? 'bg-green-500' : 
            socketStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <p className="text-sm">
            Trạng thái server: {
              socketStatus === 'connected' ? 'Đang hoạt động' : 
              socketStatus === 'connecting' ? 'Đang kết nối' : 'Không kết nối'
            }
          </p>
          {socketStatus === 'connected' ? 
            <Wifi className="w-4 h-4 text-green-500" /> : 
            <WifiOff className="w-4 h-4 text-red-500" />
          }
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Database className="w-4 h-4 mr-1 text-blue-500" />
            Giao dịch gần đây
          </h3>
          <div className="max-h-40 overflow-y-auto border rounded-md">
            {transactions.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Người dùng</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Số tiền</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((tx: any, index) => (
                    <tr key={tx._id || index}>
                      <td className="px-3 py-2 text-sm text-gray-900">{tx.username}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{tx.amount?.toLocaleString()} VND</td>
                      <td className="px-3 py-2 text-sm text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-500 p-3 text-center">Chưa có giao dịch nào</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Customers = () => {
  console.log('[Customers.tsx] Customers component rendered');
  const { customers, loading: customersLoading, getCustomerById } = useCustomerStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'suspended' | 'inactive'>('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [currentSelectedCustomer, setCurrentSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalTopup, setModalTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [showTestingTools, setShowTestingTools] = useState(false);
  const [topupLoading, setTopupLoading] = useState(false);
  const [topupError, setTopupError] = useState<string | null>(null);
  const [topupResult, setTopupResult] = useState<any>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [editCustomerForm, setEditCustomerForm] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    dob: string;
    status: CustomerStatus;
  }>({
    name: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    status: 'active'
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const activeCustomers = useMemo(() => customers.filter(c => c.status === 'active').length, [customers]);
  
  // Các gói nạp tiền có sẵn
  const predefinedPackages = [
    { amount: 10000, label: '10.000đ' },
    { amount: 20000, label: '20.000đ' },
    { amount: 50000, label: '50.000đ' },
    { amount: 100000, label: '100.000đ' },
    { amount: 200000, label: '200.000đ' },
  ];
  
  // Set số tiền dựa vào gói được chọn
  const selectPackage = (amount: number) => {
    setTopupAmount(amount.toString());
  };

  // Lọc danh sách
  const filteredCustomers = React.useMemo(() => {
    return customers.filter((customer: CustomerDetail) => {
      const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, selectedStatus]);

  // When a customer from the list is clicked, get full details
  const handleSelectCustomer = (customer: CustomerDetail) => {
    setSelectedCustomerId(customer.id);
    setCurrentSelectedCustomer(customer);
  };

  // Update edit form when selected customer changes
  useEffect(() => {
    if (currentSelectedCustomer) {
      setEditCustomerForm({
        name: currentSelectedCustomer.name,
        email: currentSelectedCustomer.email,
        phone: currentSelectedCustomer.phone || '',
        address: currentSelectedCustomer.address || '',
        dob: currentSelectedCustomer.dob || '',
        status: currentSelectedCustomer.status as CustomerStatus
      });
    }
  }, [currentSelectedCustomer]);

  const handleTopup = async () => {
    if (!currentSelectedCustomer) return;
    const amount = parseInt(topupAmount, 10);
    if (isNaN(amount) || amount <= 0) return;
    
    setTopupLoading(true);
    setTopupError(null);
    setTopupResult(null);
    
    try {
      const result = await ipcRenderer.invoke('process-topup', {
        username: currentSelectedCustomer.name,
        amount: amount,
        message: `Nạp tiền từ admin cho ${currentSelectedCustomer.name}`
      });
      
      if (result && result.success) {
        // UI tự động cập nhật nhờ Zustand và socket event
        setTopupResult(result);
        setTimeout(() => {
          setModalTopup(false);
          setTopupAmount('');
          setTopupResult(null);
        }, 1500);
      } else {
        setTopupError(result.error || 'Lỗi không xác định');
      }
    } catch (error: any) {
      console.error('Error processing topup:', error);
      setTopupError(error.message || 'Lỗi khi nạp tiền');
    } finally {
      setTopupLoading(false);
    }
  };

  // Hàm reset password
  const handleResetPassword = async () => {
    if (!currentSelectedCustomer) return;
    try {
      const result = await ipcRenderer.invoke('customers:resetPassword', currentSelectedCustomer.id);
      if (result && result.success) {
        setNotification({ type: 'success', message: 'Đã đặt lại mật khẩu về "1"' });
      } else {
        setNotification({ type: 'error', message: result.error || 'Không thể đặt lại mật khẩu' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Không thể đặt lại mật khẩu. Vui lòng thử lại sau.' });
    }
  };

  // Xử lý khi nhấn nút Edit
  const handleEditModal = () => {
    if (currentSelectedCustomer) {
      setEditCustomerForm({
        name: currentSelectedCustomer.name,
        email: currentSelectedCustomer.email,
        phone: currentSelectedCustomer.phone || '',
        address: currentSelectedCustomer.address || '',
        dob: currentSelectedCustomer.dob || '',
        status: currentSelectedCustomer.status as CustomerStatus
      });
      setModalEdit(true);
    }
  };

  // Xử lý khi lưu chỉnh sửa
  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedCustomer) return;
    
    try {
      // Gọi IPC để cập nhật thông tin khách hàng
      const result = await ipcRenderer.invoke('customers:update', 
        currentSelectedCustomer.id, 
        editCustomerForm
      );
      
      if (result && result.success) {
        // Không cần cập nhật state cục bộ. Store sẽ xử lý.
        setModalEdit(false);
        setNotification({ type: 'success', message: 'Đã cập nhật thông tin khách hàng' });
      } else {
        setNotification({ type: 'error', message: result.error || 'Không thể cập nhật khách hàng' });
      }
    } catch (error: any) {
      console.error('Error updating customer:', error);
      setNotification({ type: 'error', message: error.message || 'Lỗi khi cập nhật thông tin khách hàng' });
    }
  };

  // Xử lý khi xác nhận xóa khách hàng
  const handleDeleteCustomer = async () => {
    if (!currentSelectedCustomer) return;
    setIsDeleting(true);
    
    try {
      // Gọi IPC để xóa khách hàng
      const result = await ipcRenderer.invoke('customers:delete', currentSelectedCustomer.id);
      
      if (result && result.success) {
        // Store sẽ xử lý việc xóa. UI sẽ tự cập nhật.
        setSelectedCustomerId(null);
        setModalDelete(false);
        setNotification({ type: 'success', message: 'Đã xóa khách hàng' });
      } else {
        setNotification({ type: 'error', message: result.error || 'Không thể xóa khách hàng' });
      }
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      setNotification({ type: 'error', message: error.message || 'Lỗi khi xóa khách hàng' });
    } finally {
      setIsDeleting(false);
    }
  };

  // Event listeners for notifications
  useEffect(() => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      
      const loginHandler = (_event: any, data: { customerName: string; time: string }) => {
        setNotification({ 
          type: 'success', 
          message: `Khách hàng ${data.customerName} vừa đăng nhập lúc ${new Date(data.time).toLocaleTimeString()}` 
        });
      };
      
      const logoutHandler = (_event: any, data: { customerName: string; time: string }) => {
        setNotification({ 
          type: 'info', 
          message: `Khách hàng ${data.customerName || 'Unknown'} vừa đăng xuất lúc ${new Date(data.time).toLocaleTimeString()}` 
        });
      };
      
      ipcRenderer.on('admin:login-notification', loginHandler);
      ipcRenderer.on('admin:logout-notification', logoutHandler);
      
      return () => {
        ipcRenderer.removeListener('admin:login-notification', loginHandler);
        ipcRenderer.removeListener('admin:logout-notification', logoutHandler);
      };
    }
  }, []);

  // Thêm hàm debug để kiểm tra trạng thái
  const debugCustomerStatus = () => {
    console.log('[DEBUG] ===== TRẠNG THÁI KHÁCH HÀNG =====');
    console.log('[DEBUG] Tổng số khách hàng:', customers.length);
    console.log('[DEBUG] Khách hàng đang hoạt động:', customers.filter(c => c.status === 'active').length);
    console.log('[DEBUG] Khách hàng không hoạt động:', customers.filter(c => c.status === 'inactive').length);
    console.log('[DEBUG] Danh sách khách hàng đang hoạt động:', 
      customers.filter(c => c.status === 'active').map(c => ({ id: c.id, name: c.name })));
    console.log('[DEBUG] Selected customer ID:', selectedCustomerId);
    console.log('[DEBUG] Current selected customer data:', currentSelectedCustomer);
    console.log('[DEBUG] ================================');

    // Hiển thị thông báo trạng thái cho người dùng
    setNotification({
      type: 'success',
      message: `Đã log trạng thái khách hàng vào console. Tổng số: ${customers.length} khách hàng, ${customers.filter(c => c.status === 'active').length} đang hoạt động.`
    });
    
    // Test emit logout event trực tiếp
    try {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('test:trigger-logout', { customerId: 1 });
      console.log('Đã gọi test:trigger-logout cho customerId: 1');
    } catch (err) {
      console.error('Error triggering test logout:', err);
    }
  };

  // Kiểm tra kết nối socket khi component load
  useEffect(() => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.invoke('socket:check-connection').then((connected: boolean) => {
        setIsSocketConnected(connected);
        console.log('[Customers.tsx] Initial socket status:', connected);
      });
      
      // Lắng nghe sự kiện socket:status
      const handleSocketStatus = (_event: any, connected: boolean) => {
        setIsSocketConnected(connected);
      };
      ipcRenderer.on('socket:status', handleSocketStatus);
      
      return () => {
        ipcRenderer.removeListener('socket:status', handleSocketStatus);
      };
    }
  }, []);

  // Listen for customer created event to automatically select the new customer
  useEffect(() => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      
      const handleCustomerCreatedSelect = (_event: any, data: { customer: CustomerDetail }) => {
        if (data.customer && data.customer.id) {
          setSelectedCustomerId(data.customer.id);
          setCurrentSelectedCustomer(data.customer);
          console.log('[Customers] Automatically selected newly created customer via IPC. ID:', data.customer.id);
          setNotification({ type: 'success', message: `Đã tạo khách hàng mới: ${data.customer.name}` });
        }
      };

      ipcRenderer.on('customer:created', handleCustomerCreatedSelect);
      
      return () => {
        ipcRenderer.removeListener('customer:created', handleCustomerCreatedSelect);
      };
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Socket Status Indicator */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1
          ${isSocketConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <div className={`w-2 h-2 rounded-full ${isSocketConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{isSocketConnected ? 'Đã kết nối' : 'Mất kết nối'}</span>
        </div>
        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <span>{activeCustomers} khách hàng online</span>
        </div>
        <Button 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs font-medium"
          onClick={debugCustomerStatus}
        >
          <Activity className="w-3 h-3 mr-1" />
          Debug
        </Button>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý khách hàng</h1>
          <p className="text-gray-600">Quản lý tài khoản và hoạt động của khách hàng</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setModalAdd(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Thêm khách hàng
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng khách hàng</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter((c: CustomerDetail) => c.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">0đ</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cấp độ trung bình</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            placeholder="Tìm kiếm khách hàng..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            className={selectedStatus === 'all' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-700'}
            onClick={() => setSelectedStatus('all')}
          >
            Tất cả
          </Button>
          <Button 
            className={selectedStatus === 'active' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-700'}
            onClick={() => setSelectedStatus('active')}
          >
            Đang hoạt động
          </Button>
          <Button 
            className={selectedStatus === 'suspended' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-700'}
            onClick={() => setSelectedStatus('suspended')}
          >
            Đã khóa
          </Button>
        </div>
      </motion.div>

      {/* Customer List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách khách hàng</CardTitle>
                <CardDescription>Quản lý và giám sát tài khoản khách hàng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCustomers.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Không tìm thấy khách hàng
                    </div>
                  ) : (
                    filteredCustomers.map((customer: CustomerDetail) => (
                      <CustomerRow 
                        key={customer.id} 
                        customer={customer} 
                        onClick={() => handleSelectCustomer(customer)}
                        isSelected={selectedCustomerId === customer.id}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="h-full overflow-auto">
              <CardContent className="p-0">
                <AnimatePresence>
                  <motion.div
                    key={currentSelectedCustomer?.id || 'empty'}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CustomerDetails 
                      customer={currentSelectedCustomer} 
                      onTopup={() => setModalTopup(true)} 
                      onResetPassword={handleResetPassword}
                      onEdit={handleEditModal}
                      onDelete={() => setModalDelete(true)}
                    />
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Testing tools toggle */}
      <div className="flex justify-center mt-8">
        <Button 
          onClick={() => setShowTestingTools(prev => !prev)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          {showTestingTools ? "Ẩn công cụ kiểm thử" : "Hiển thị công cụ kiểm thử"}
        </Button>
      </div>
      
      {/* Testing tools */}
      {showTestingTools && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="border-t-2 border-dashed border-gray-300 pt-6 mt-6">
            <h2 className="text-xl font-bold mb-6 text-center">Công cụ kiểm thử nạp tiền</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bot simulator */}
              <div className="md:col-span-1">
                <BotSimulator />
              </div>
              
              {/* User client simulator */}
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserRound className="w-5 h-5 text-green-500" />
                      Mô phỏng Client
                    </CardTitle>
                    <CardDescription>Giao diện người dùng để kiểm tra nhận thông báo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserTopUpTester />
                  </CardContent>
                </Card>
              </div>
              
              {/* Connection monitor */}
              <div className="md:col-span-1">
                <ConnectionMonitor />
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Modals */}
      <Modal open={modalAdd} onClose={() => setModalAdd(false)} title="Thêm khách hàng mới">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2"
        >
          <p className="text-sm text-gray-500 mb-4">
            Chỉ cần nhập tên đăng nhập và mật khẩu. 
            Các thông tin chi tiết khác có thể thêm sau khi tạo tài khoản.
          </p>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            const username = formData.get('username') as string;
            const password = formData.get('password') as string;
            if (!username || !password) return;
            try {
              // customerService.createCustomer giờ đã trả về full detail
              // và ipc handler cũng đã emit event với full detail
              // nên không cần làm gì thêm ở đây.
              const result = await ipcRenderer.invoke('customers:create', {
                name: username,
                password_hash: password
              });

              if (result && result.success) {
                setModalAdd(false);
                setNotification({ type: 'success', message: `Đã tạo khách hàng mới: ${username}` });
                console.log('[Customers] Newly created customer. Waiting for store update via IPC.');
              } else {
                setNotification({ type: 'error', message: result.error || 'Lỗi: Không thể tạo khách hàng mới' });
              }
            } catch (error) {
              console.error('Error creating customer:', error);
              setNotification({ type: 'error', message: 'Không thể tạo khách hàng mới. Vui lòng thử lại sau.' });
            }
          }} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <input 
                id="username"
                name="username"
                required
                className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" 
                placeholder="Nhập tên đăng nhập"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input 
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" 
                placeholder="Nhập mật khẩu"
              />
            </div>
            
          <div className="flex justify-end gap-2">
            <motion.button 
              type="button" 
              className="px-4 py-2 bg-gray-200 text-foreground rounded" 
              onClick={() => setModalAdd(false)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Hủy
            </motion.button>
            <motion.button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
                Tạo
            </motion.button>
          </div>
        </form>
        </motion.div>
      </Modal>
      <Modal open={modalTopup} onClose={() => setModalTopup(false)} title={`Nạp tiền cho ${currentSelectedCustomer?.name || 'khách hàng'}`}>
        <form onSubmit={e => { e.preventDefault(); handleTopup(); }} className="space-y-5">
          <div>
            <label htmlFor="topup-amount" className="block text-sm font-medium text-gray-700 mb-1">
              Chọn gói nạp tiền có sẵn
            </label>
            <div className="grid grid-cols-3 gap-2">
              {predefinedPackages.map((pkg) => (
                <motion.button
                  key={pkg.amount}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => selectPackage(pkg.amount)}
                  className={`p-2 border rounded-md text-center transition-colors ${
                    Number(topupAmount) === pkg.amount
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pkg.label}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <label htmlFor="topup-amount" className="block text-sm font-medium text-gray-700 mb-1">
              Hoặc nhập số tiền tùy chọn (VND)
            </label>
            <div className="flex items-center">
            <input
              id="topup-amount"
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground"
              placeholder="Số tiền nạp (VND)"
              type="number"
              min="1000"
              step="1000"
              value={topupAmount}
              onChange={e => setTopupAmount(e.target.value)}
              required
              disabled={topupLoading}
            />
            </div>
            <p className="text-xs text-gray-500 mt-1">Tối thiểu 1.000đ</p>
          </div>
          
          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              className="px-4 py-2 bg-gray-200 text-foreground rounded hover:bg-gray-300" 
              onClick={() => setModalTopup(false)}
              disabled={topupLoading}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
              disabled={topupLoading || !topupAmount || Number(topupAmount) < 1000}
            >
              {topupLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Nạp {topupAmount ? Number(topupAmount).toLocaleString() : 0}đ
                </>
              )}
            </button>
          </div>
          
          {topupError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md mt-3">
              {topupError}
            </div>
          )}
          
          {topupResult && topupResult.success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md mt-3">
              <p className="font-medium">Nạp tiền thành công!</p>
              <p className="text-sm">ID giao dịch: {topupResult.transaction._id}</p>
            </div>
          )}
        </form>
      </Modal>
      <Modal open={modalEdit} onClose={() => setModalEdit(false)} title={`Chỉnh sửa thông tin: ${currentSelectedCustomer?.name}`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2"
        >
          <form onSubmit={handleSaveCustomer} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Tên người dùng <span className="text-red-500">*</span>
              </label>
              <input 
                id="name"
                name="name"
                value={editCustomerForm.name}
                onChange={(e) => setEditCustomerForm({...editCustomerForm, name: e.target.value})}
                required
                className="w-full px-3 py-2 bg-white border border-border rounded text-foreground"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input 
                id="email"
                name="email"
                type="email"
                value={editCustomerForm.email}
                onChange={(e) => setEditCustomerForm({...editCustomerForm, email: e.target.value})}
                required
                className="w-full px-3 py-2 bg-white border border-border rounded text-foreground"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input 
                id="phone"
                name="phone"
                value={editCustomerForm.phone}
                onChange={(e) => setEditCustomerForm({...editCustomerForm, phone: e.target.value})}
                className="w-full px-3 py-2 bg-white border border-border rounded text-foreground"
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ
              </label>
              <input 
                id="address"
                name="address"
                value={editCustomerForm.address}
                onChange={(e) => setEditCustomerForm({...editCustomerForm, address: e.target.value})}
                className="w-full px-3 py-2 bg-white border border-border rounded text-foreground"
              />
            </div>
            
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                Ngày sinh
              </label>
              <input 
                id="dob"
                name="dob"
                type="date"
                value={editCustomerForm.dob}
                onChange={(e) => setEditCustomerForm({...editCustomerForm, dob: e.target.value})}
                className="w-full px-3 py-2 bg-white border border-border rounded text-foreground"
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                id="status"
                name="status"
                value={editCustomerForm.status}
                onChange={(e) => setEditCustomerForm({...editCustomerForm, status: e.target.value as CustomerStatus})}
                className="w-full px-3 py-2 bg-white border border-border rounded text-foreground"
              >
                <option value="active">Đang hoạt động</option>
                <option value="suspended">Đã khóa</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <button 
                type="button" 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={() => setModalEdit(false)}
              >
                Hủy
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </motion.div>
      </Modal>
      <Modal open={modalDelete} onClose={() => !isDeleting && setModalDelete(false)} title="Xác nhận xóa khách hàng">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <p className="mb-4 text-gray-700">
              Bạn có chắc chắn muốn xóa khách hàng <span className="font-semibold">{currentSelectedCustomer?.name}</span>?
              <br />
              <span className="text-sm text-gray-500">Thao tác này không thể hoàn tác.</span>
            </p>
          </div>
          
          <div className="flex justify-center gap-3 mt-4">
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={() => setModalDelete(false)}
              disabled={isDeleting}
            >
              Hủy bỏ
            </button>
            <button 
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
              onClick={handleDeleteCustomer}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa khách hàng
                </>
              )}
            </button>
          </div>
        </motion.div>
      </Modal>
      {notification && (
        <SystemNotification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Add a debug button */}
      <div className="absolute bottom-4 left-4">
        <Button 
          onClick={() => {
            console.log('[DEBUG] ===== TRẠNG THÁI KHÁCH HÀNG =====');
            console.log('[DEBUG] Tổng số khách hàng:', customers.length);
            console.log('[DEBUG] Khách hàng đang hoạt động:', customers.filter(c => c.status === 'active').length);
            console.log('[DEBUG] Khách hàng không hoạt động:', customers.filter(c => c.status === 'inactive').length);
            console.log('[DEBUG] Danh sách khách hàng đang hoạt động:', 
              customers.filter(c => c.status === 'active').map(c => ({ id: c.id, name: c.name })));
            console.log('[DEBUG] Selected customer ID:', selectedCustomerId);
            console.log('[DEBUG] Current selected customer data:', currentSelectedCustomer);
            console.log('[DEBUG] ================================');
        
            // Hiển thị thông báo trạng thái cho người dùng
            setNotification({
              type: 'success',
              message: `Đã log trạng thái khách hàng vào console. Tổng số: ${customers.length} khách hàng, ${customers.filter(c => c.status === 'active').length} đang hoạt động.`
            });
            
            // Test emit logout event trực tiếp
            try {
              const { ipcRenderer } = window.require('electron');
              ipcRenderer.send('test:trigger-logout', { customerId: 1 });
              console.log('Đã gọi test:trigger-logout cho customerId: 1');
            } catch (err) {
              console.error('Error triggering test logout:', err);
            }
          }}
          variant="secondary"
          size="sm"
        >
          Debug Status
        </Button>
      </div>
    </div>
  );
};

export default Customers; 