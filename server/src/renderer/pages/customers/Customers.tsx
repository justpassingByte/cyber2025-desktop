import React, { useState } from 'react';
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
  MoreVertical 
} from 'lucide-react';
import Modal from '../../components/Modal';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Badge, Button } from '../../components/ui';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  totalSpent: number;
  status: 'active' | 'inactive' | 'suspended';
  hoursPlayed?: number;
  level?: number;
  balance?: number;
  lastSeen?: string;
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    memberSince: '12/05/2023',
    totalSpent: 1250000,
    status: 'active',
    hoursPlayed: 156,
    level: 5,
    balance: 240000,
    lastSeen: '2 giờ trước'
  },
  {
    id: '2',
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0912345678',
    memberSince: '25/06/2023',
    totalSpent: 850000,
    status: 'active',
    hoursPlayed: 89,
    level: 4,
    balance: 120000,
    lastSeen: 'Đang online'
  },
  {
    id: '3',
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    phone: '0923456789',
    memberSince: '10/07/2023',
    totalSpent: 2100000,
    status: 'suspended',
    hoursPlayed: 234,
    level: 7,
    balance: 0,
    lastSeen: '1 tuần trước'
  },
  {
    id: '4',
    name: 'Phạm Thị D',
    email: 'phamthid@example.com',
    phone: '0934567890',
    memberSince: '05/08/2023',
    totalSpent: 750000,
    status: 'active',
    hoursPlayed: 67,
    level: 3,
    balance: 450000,
    lastSeen: '30 phút trước'
  },
  {
    id: '5',
    name: 'Hoàng Văn E',
    email: 'hoangvane@example.com',
    phone: '0945678901',
    memberSince: '18/09/2023',
    totalSpent: 1500000,
    status: 'inactive',
    hoursPlayed: 178,
    level: 6,
    balance: 85000,
    lastSeen: '1 giờ trước'
  },
];

const CustomerDetails = ({ customer, onTopup }: { customer: Customer | null, onTopup: () => void }) => {
  if (!customer) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Chọn khách hàng để xem chi tiết</p>
      </div>
    );
  }

  const contactDetails = [
    { label: 'Email', value: customer.email, icon: <Mail className="w-4 h-4 text-blue-500" /> },
    { label: 'Số điện thoại', value: customer.phone, icon: <Phone className="w-4 h-4 text-green-500" /> },
    { label: 'Ngày đăng ký', value: customer.memberSince, icon: <CalendarDays className="w-4 h-4 text-purple-500" /> }
  ];

  const activityList = [
    { id: 1, title: 'Đăng nhập vào máy #5', time: 'Hôm nay, 14:30', type: 'login' },
    { id: 2, title: 'Nạp 200.000đ vào tài khoản', time: 'Hôm qua, 10:15', type: 'topup' },
    { id: 3, title: 'Đăng xuất khỏi máy #5', time: 'Hôm qua, 12:45', type: 'logout' }
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login': return 'bg-green-500';
      case 'topup': return 'bg-blue-500';
      case 'logout': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

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
          >
            <Edit className="w-5 h-5" />
          </motion.button>
          <motion.button 
            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-destructive"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
          <motion.button 
            className="p-2 rounded-md bg-green-100 text-green-700 hover:bg-green-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onTopup}
          >
            <DollarSign className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

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
              className="space-y-3"
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
              {activityList.map((activity) => (
                <motion.div 
                  key={activity.id} 
                  className="flex items-center py-2 border-b border-border"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                >
                  <motion.div 
                    className={`w-2 h-2 rounded-full ${getActivityColor(activity.type)} mr-3`}
                    whileHover={{ scale: 1.5 }}
                  ></motion.div>
                  <div>
                    <p className="text-sm text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
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
  customer: Customer, 
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
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">{customer.hoursPlayed || 0}h</p>
          <p className="text-xs text-gray-500">Đã chơi</p>
        </div>
        <Badge className={getStatusColor(customer.status)}>
          {customer.status === 'active' ? 'Hoạt động' : 
           customer.status === 'suspended' ? 'Đã khóa' : 'Không hoạt động'}
        </Badge>
      </div>
    </motion.div>
  )
};

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'suspended' | 'inactive'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalTopup, setModalTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [customers, setCustomers] = useState(mockCustomers);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleTopup = () => {
    if (!selectedCustomer) return;
    const amount = parseInt(topupAmount, 10);
    if (isNaN(amount) || amount <= 0) return;
    
    const updatedCustomers = customers.map(c => {
      if (c.id === selectedCustomer.id) {
        const balance = (c.balance || 0) + amount;
        return { ...c, balance, totalSpent: c.totalSpent + amount };
      }
      return c;
    });
    
    setCustomers(updatedCustomers);
    setSelectedCustomer(prev => prev ? { ...prev, balance: (prev.balance || 0) + amount, totalSpent: prev.totalSpent + amount } : prev);
    setModalTopup(false);
    setTopupAmount('');
  };

  return (
    <div className="p-6 space-y-6">
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
                  {customers.filter(c => c.status === 'active').length}
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
                <p className="text-2xl font-bold text-gray-900">
                  {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString('vi-VN')}đ
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(customers.reduce((sum, c) => sum + (c.level || 0), 0) / customers.length)}
                </p>
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
                    filteredCustomers.map((customer) => (
                      <CustomerRow 
                        key={customer.id} 
                        customer={customer} 
                        onClick={() => setSelectedCustomer(customer)}
                        isSelected={selectedCustomer?.id === customer.id}
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
                    key={selectedCustomer?.id || 'empty'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CustomerDetails 
                      customer={selectedCustomer} 
                      onTopup={() => setModalTopup(true)} 
                    />
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <Modal open={modalAdd} onClose={() => setModalAdd(false)} title="Thêm khách hàng mới">
        <form className="space-y-4">
          <input className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" placeholder="Tên khách hàng" />
          <input className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" placeholder="Email" />
          <input className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" placeholder="Số điện thoại" />
          <input className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" placeholder="Ngày đăng ký (dd/mm/yyyy)" />
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
              Lưu
            </motion.button>
          </div>
        </form>
      </Modal>
      <Modal open={modalTopup} onClose={() => setModalTopup(false)} title="Nạp tiền cho khách hàng">
        <form onSubmit={e => { e.preventDefault(); handleTopup(); }} className="space-y-4">
          <input
            className="w-full px-3 py-2 bg-white border border-border rounded text-foreground"
            placeholder="Số tiền nạp (VND)"
            type="number"
            min="1000"
            value={topupAmount}
            onChange={e => setTopupAmount(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 bg-gray-200 text-foreground rounded" onClick={() => setModalTopup(false)}>Hủy</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Nạp</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers; 