import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, UserRound, Clock, DollarSign, Mail, Phone, CalendarDays, UserPlus } from 'lucide-react';
import Modal from '../../components/Modal';
import { Card, CardHeader, CardTitle, CardContent, CustomerCard } from '../../components/ui';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  totalSpent: number;
  status: 'active' | 'inactive';
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
  },
  {
    id: '2',
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0912345678',
    memberSince: '25/06/2023',
    totalSpent: 850000,
    status: 'active',
  },
  {
    id: '3',
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    phone: '0923456789',
    memberSince: '10/07/2023',
    totalSpent: 2100000,
    status: 'inactive',
  },
  {
    id: '4',
    name: 'Phạm Thị D',
    email: 'phamthid@example.com',
    phone: '0934567890',
    memberSince: '05/08/2023',
    totalSpent: 750000,
    status: 'active',
  },
  {
    id: '5',
    name: 'Hoàng Văn E',
    email: 'hoangvane@example.com',
    phone: '0945678901',
    memberSince: '18/09/2023',
    totalSpent: 1500000,
    status: 'inactive',
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
              <p className="text-xs text-muted-foreground">Trạng thái</p>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                customer.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {customer.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
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

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalTopup, setModalTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [customers, setCustomers] = useState(mockCustomers);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTopup = () => {
    if (!selectedCustomer) return;
    const amount = parseInt(topupAmount, 10);
    if (isNaN(amount) || amount <= 0) return;
    setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? { ...c, totalSpent: c.totalSpent + amount } : c));
    setSelectedCustomer(prev => prev ? { ...prev, totalSpent: prev.totalSpent + amount } : prev);
    setModalTopup(false);
    setTopupAmount('');
  };

  return (
    <div className="h-full flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 lg:w-2/5 border-r border-border">
        <motion.div 
          className="p-4 border-b border-border"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <motion.h2 
              className="text-lg font-medium text-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              Danh sách khách hàng
            </motion.h2>
            <motion.button 
              className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary" 
              onClick={() => setModalAdd(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <UserPlus className="w-4 h-4" />
            </motion.button>
          </div>
          <motion.div 
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </motion.div>
        <div className="overflow-y-auto h-[calc(100%-5rem)]">
          {filteredCustomers.length === 0 ? (
            <motion.div 
              className="p-4 text-center text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              Không tìm thấy khách hàng
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {filteredCustomers.map((customer, index) => (
                <CustomerCard
                  key={customer.id}
                  id={customer.id}
                  name={customer.name}
                  email={customer.email}
                  status={customer.status}
                  isSelected={selectedCustomer?.id === customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CustomerDetails customer={selectedCustomer} onTopup={() => setModalTopup(true)} />
        </motion.div>
      </div>
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