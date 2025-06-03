import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Clock, 
  Power, 
  UserRound,
  Search,
  Settings,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  RefreshCcw
} from 'lucide-react';
import Modal from '../../components/Modal';
import { StationCard, Card, CardHeader, CardTitle, CardContent } from '../../components/ui';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

// Define computer station interface
interface ComputerStation {
  id: number;
  name: string;
  status: 'available' | 'occupied' | 'maintenance';
  currentUser?: string;
  timeRemaining?: string;
  startTime?: string;
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  networkSpeed: number;
  specs: {
    cpu: string;
    ram: string;
    gpu: string;
    storage: string;
  };
  ipAddress: string;
  lastRestart: string;
  usage: {
    cpu: number;
    ram: number;
    gpu: number;
    network: number;
  };
}

// Sample data
const computerStations: ComputerStation[] = Array.from({ length: 12 }, (_, i) => {
  const id = i + 1;
  const status = id === 4 ? 'maintenance' : id <= 8 ? 'occupied' : 'available';
  
  return {
    id,
    name: `PC #${id}`,
    status,
    currentUser: status === 'occupied' ? ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E'][i % 5] : undefined,
    timeRemaining: status === 'occupied' ? `${Math.floor(Math.random() * 3)}h ${Math.floor(Math.random() * 60)}m` : undefined,
    startTime: status === 'occupied' ? '14:30' : undefined,
    cpuUsage: status === 'occupied' ? Math.floor(Math.random() * 60) + 20 : Math.floor(Math.random() * 10) + 5,
    ramUsage: status === 'occupied' ? Math.floor(Math.random() * 50) + 30 : Math.floor(Math.random() * 20) + 10,
    diskUsage: Math.floor(Math.random() * 30) + 50,
    networkSpeed: status === 'occupied' ? Math.floor(Math.random() * 50) + 5 : 0,
    specs: {
      cpu: 'Intel Core i7-12700K',
      ram: '32GB DDR5 4800MHz',
      gpu: 'NVIDIA RTX 4070 12GB',
      storage: '1TB NVMe SSD',
    },
    ipAddress: `192.168.1.${100 + id}`,
    lastRestart: `${Math.floor(Math.random() * 24)}h ago`,
    usage: {
      cpu: Math.floor(Math.random() * 100),
      ram: Math.floor(Math.random() * 100),
      gpu: Math.floor(Math.random() * 100),
      network: Math.floor(Math.random() * 100),
    },
  };
});

const Room: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStation, setSelectedStation] = useState<ComputerStation | null>(null);
  const [modalType, setModalType] = useState<null | 'restart' | 'logout' | 'maintenance' | 'endMaintenance'>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'occupied' | 'maintenance'>('all');

  // Filter stations based on search term
  const filteredStations = computerStations.filter(station => {
    // Apply status filter
    if (filter !== 'all' && station.status !== filter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm && !station.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Count stations by status
  const availableCount = computerStations.filter(s => s.status === 'available').length;
  const occupiedCount = computerStations.filter(s => s.status === 'occupied').length;
  const maintenanceCount = computerStations.filter(s => s.status === 'maintenance').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full flex flex-col md:flex-row">
        <motion.div 
          className="w-full md:w-2/3 overflow-y-auto p-4 md:pr-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <motion.h2 
                className="text-xl font-bold text-foreground"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Quản lý phòng máy
              </motion.h2>
              <motion.div 
                className="flex space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <motion.button 
                  className={`px-3 py-1.5 text-sm rounded-md shadow-sm ${
                    filter === 'all' 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-foreground border border-border hover:bg-gray-50'
                  }`}
                  onClick={() => setFilter('all')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Tất cả ({computerStations.length})
                </motion.button>
                <motion.button 
                  className={`px-3 py-1.5 text-sm rounded-md shadow-sm ${
                    filter === 'available' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white text-foreground border border-border hover:bg-gray-50'
                  }`}
                  onClick={() => setFilter('available')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sẵn sàng ({availableCount})
                </motion.button>
                <motion.button 
                  className={`px-3 py-1.5 text-sm rounded-md shadow-sm ${
                    filter === 'occupied' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-foreground border border-border hover:bg-gray-50'
                  }`}
                  onClick={() => setFilter('occupied')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Đang sử dụng ({occupiedCount})
                </motion.button>
                <motion.button 
                  className={`px-3 py-1.5 text-sm rounded-md shadow-sm ${
                    filter === 'maintenance' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-white text-foreground border border-border hover:bg-gray-50'
                  }`}
                  onClick={() => setFilter('maintenance')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Bảo trì ({maintenanceCount})
                </motion.button>
              </motion.div>
            </div>
            <motion.div 
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm máy trạm..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredStations.length > 0 ? (
              filteredStations.map((station, index) => (
                <StationCard
                  key={station.id}
                  id={station.id}
                  name={station.name}
                  status={station.status}
                  currentUser={station.currentUser}
                  timeRemaining={station.timeRemaining}
                  cpuUsage={station.cpuUsage}
                  ramUsage={station.ramUsage}
                  isSelected={selectedStation?.id === station.id}
                  onClick={() => setSelectedStation(station)}
                  index={index}
                />
              ))
            ) : (
              <motion.div 
                className="col-span-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-soft border border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <AlertCircle className="w-10 h-10 text-muted-foreground mb-2" />
                <h3 className="font-medium text-foreground mb-1">Không tìm thấy máy trạm nào</h3>
                <p className="text-sm text-muted-foreground">Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        <motion.div 
          className="w-full md:w-1/3 border-t md:border-t-0 md:border-l border-border bg-white p-4 md:overflow-y-auto"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
        >
          <StationDetails station={selectedStation} />
          <div className="mt-6 grid grid-cols-2 gap-3">
            {selectedStation && selectedStation.status === 'occupied' && (
              <>
                <motion.button
                  className="flex items-center justify-center px-4 py-2 bg-white border border-border rounded shadow-sm text-foreground hover:bg-slate-50"
                  onClick={() => setModalType('logout')}
                  whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Power className="w-4 h-4 mr-2 text-red-500" />
                  <span>Đăng xuất</span>
                </motion.button>
                <motion.button
                  className="flex items-center justify-center px-4 py-2 bg-white border border-border rounded shadow-sm text-foreground hover:bg-slate-50"
                  onClick={() => setModalType('restart')}
                  whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCcw className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Khởi động lại</span>
                </motion.button>
              </>
            )}
            
            {selectedStation && selectedStation.status === 'available' && (
              <motion.button
                className="flex items-center justify-center px-4 py-2 bg-white border border-border rounded shadow-sm text-foreground hover:bg-slate-50 col-span-2"
                onClick={() => setModalType('maintenance')}
                whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                <span>Đưa vào bảo trì</span>
              </motion.button>
            )}
            
            {selectedStation && selectedStation.status === 'maintenance' && (
              <motion.button
                className="flex items-center justify-center px-4 py-2 bg-white border border-border rounded shadow-sm text-foreground hover:bg-slate-50 col-span-2"
                onClick={() => setModalType('endMaintenance')}
                whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span>Kết thúc bảo trì</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {modalType && (
        <Modal
          open={true}
          title={
            modalType === 'restart' 
              ? 'Xác nhận khởi động lại' 
              : modalType === 'logout' 
                ? 'Xác nhận đăng xuất'
                : modalType === 'maintenance'
                  ? 'Xác nhận bảo trì'
                  : 'Kết thúc bảo trì'
          }
          onClose={() => setModalType(null)}
        >
          <div className="space-y-4">
            <p className="text-foreground">
              {modalType === 'restart' && 'Bạn có chắc chắn muốn khởi động lại máy này không?'}
              {modalType === 'logout' && 'Bạn có chắc chắn muốn đăng xuất người dùng này không?'}
              {modalType === 'maintenance' && 'Bạn có chắc chắn muốn đưa máy này vào chế độ bảo trì không?'}
              {modalType === 'endMaintenance' && 'Bạn có chắc chắn muốn kết thúc chế độ bảo trì cho máy này không?'}
            </p>
            
            <div className="flex justify-end gap-3 mt-4">
              <motion.button 
                className="px-4 py-2 bg-white border border-border text-foreground rounded-md shadow-sm"
                onClick={() => setModalType(null)}
                whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                Huỷ
              </motion.button>
              
              <motion.button 
                className={`px-4 py-2 text-white rounded-md shadow-sm ${
                  modalType === 'restart' 
                    ? 'bg-blue-500' 
                    : modalType === 'logout' 
                      ? 'bg-red-500' 
                      : modalType === 'maintenance' 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                }`}
                onClick={() => {
                  // Handle action based on modalType
                  setModalType(null);
                }}
                whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                {modalType === 'restart' && 'Khởi động lại'}
                {modalType === 'logout' && 'Đăng xuất'}
                {modalType === 'maintenance' && 'Bảo trì'}
                {modalType === 'endMaintenance' && 'Kết thúc'}
              </motion.button>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  );
};

const StationDetails = ({ station }: { station: ComputerStation | null }) => {
  if (!station) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Chọn một máy trạm để xem chi tiết</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mr-4 ${
                station.status === 'available' 
                  ? 'bg-green-100 text-green-500' 
                  : station.status === 'occupied'
                    ? 'bg-blue-100 text-blue-500'
                    : 'bg-amber-100 text-amber-500'
              }`}>
                {station.status === 'available' ? (
                  <CheckCircle className="w-7 h-7" />
                ) : station.status === 'occupied' ? (
                  <Monitor className="w-7 h-7" />
                ) : (
                  <AlertTriangle className="w-7 h-7" />
                )}
              </div>
              <div>
                <motion.h2 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-foreground"
                >
                  {station.name}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`${
                    station.status === 'available' 
                      ? 'text-green-600' 
                      : station.status === 'occupied'
                        ? 'text-blue-600'
                        : 'text-amber-600'
                  }`}
                >
                  {station.status === 'available' 
                    ? 'Sẵn sàng sử dụng' 
                    : station.status === 'occupied'
                      ? `Đang sử dụng (${station.timeRemaining} còn lại)`
                      : 'Đang bảo trì'}
                </motion.p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {station.status === 'occupied' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Thông tin phiên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Người dùng</p>
                <p className="text-foreground font-medium">{station.currentUser}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thời gian bắt đầu</p>
                <p className="text-foreground font-medium">{station.startTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thời gian còn lại</p>
                <p className="text-foreground font-medium">{station.timeRemaining}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Thông số kỹ thuật</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="p-2 rounded-md bg-primary/10 text-primary mr-3">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CPU</p>
                <p className="text-foreground">{station.specs.cpu}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-2 rounded-md bg-primary/10 text-primary mr-3">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">GPU</p>
                <p className="text-foreground">{station.specs.gpu}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-2 rounded-md bg-primary/10 text-primary mr-3">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">RAM</p>
                <p className="text-foreground">{station.specs.ram}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-2 rounded-md bg-primary/10 text-primary mr-3">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Storage</p>
                <p className="text-foreground">{station.specs.storage}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Tình trạng sử dụng</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              { label: 'CPU', value: station.usage.cpu, color: getProgressBarColor(station.usage.cpu) },
              { label: 'RAM', value: station.usage.ram, color: getProgressBarColor(station.usage.ram) },
              { label: 'GPU', value: station.usage.gpu, color: getProgressBarColor(station.usage.gpu) },
              { label: 'Network', value: station.usage.network, color: getProgressBarColor(station.usage.network) }
            ].map((item, index) => (
              <motion.div 
                key={item.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                }}
              >
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm text-foreground font-medium">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                    className={`h-2.5 rounded-full ${item.color}`}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

const getProgressBarColor = (value: number) => {
  if (value > 80) return 'bg-red-500';
  if (value > 60) return 'bg-amber-500';
  return 'bg-primary';
};

export default Room; 