import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Power, 
  Settings,
  RefreshCw
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Badge, Button, Progress } from '../../components/ui';

interface Station {
  id: number;
  status: "occupied" | "available" | "maintenance" | "reserved";
  user?: string;
  timeRemaining?: string;
  game?: string;
  cpuUsage: number;
  ramUsage: number;
  temperature: number;
  specs: string;
  type: string;
  issue?: string;
}

const stations: Station[] = [
  {
    id: 1,
    status: "occupied",
    user: "Nguyễn Văn A",
    timeRemaining: "1h 45m",
    game: "CS:GO",
    cpuUsage: 45,
    ramUsage: 68,
    temperature: 65,
    specs: "RTX 4080, i9-13900K, 32GB RAM",
    type: "Gaming Pro",
  },
  {
    id: 2,
    status: "occupied",
    user: "Trần Thị B",
    timeRemaining: "2h 15m",
    game: "League of Legends",
    cpuUsage: 35,
    ramUsage: 52,
    temperature: 58,
    specs: "RTX 4080, i9-13900K, 32GB RAM",
    type: "Gaming Pro",
  },
  {
    id: 3,
    status: "available",
    cpuUsage: 5,
    ramUsage: 15,
    temperature: 42,
    specs: "RTX 4090, i9-13900K, 64GB RAM",
    type: "Gaming Elite",
  },
  {
    id: 4,
    status: "maintenance",
    cpuUsage: 0,
    ramUsage: 0,
    temperature: 35,
    specs: "RTX 4070, i7-13700K, 16GB RAM",
    type: "Gaming Standard",
    issue: "Cập nhật driver GPU",
  },
  {
    id: 5,
    status: "available",
    cpuUsage: 8,
    ramUsage: 20,
    temperature: 45,
    specs: "RTX 4070, i7-13700K, 16GB RAM",
    type: "Gaming Standard",
  },
  {
    id: 6,
    status: "occupied",
    user: "Hoàng Văn C",
    timeRemaining: "45m",
    game: "Valorant",
    cpuUsage: 55,
    ramUsage: 72,
    temperature: 70,
    specs: "RTX 4080, i9-13900K, 32GB RAM",
    type: "Gaming Pro",
  },
  {
    id: 7,
    status: "occupied",
    user: "Lê Thị D",
    timeRemaining: "3h 20m",
    game: "Fortnite",
    cpuUsage: 40,
    ramUsage: 48,
    temperature: 62,
    specs: "RTX 4090, i9-13900K, 64GB RAM",
    type: "Gaming Elite",
  },
  {
    id: 8,
    status: "available",
    cpuUsage: 3,
    ramUsage: 12,
    temperature: 40,
    specs: "RTX 4070, i7-13700K, 16GB RAM",
    type: "Gaming Standard",
  },
  {
    id: 9,
    status: "reserved",
    user: "Phạm Văn E",
    timeRemaining: "Đặt trước cho 18:00",
    cpuUsage: 5,
    ramUsage: 18,
    temperature: 43,
    specs: "RTX 4080, i9-13900K, 32GB RAM",
    type: "Gaming Pro",
  },
  {
    id: 10,
    status: "available",
    cpuUsage: 6,
    ramUsage: 16,
    temperature: 41,
    specs: "RTX 4090, i9-13900K, 64GB RAM",
    type: "Gaming Elite",
  },
  {
    id: 11,
    status: "available",
    cpuUsage: 4,
    ramUsage: 14,
    temperature: 39,
    specs: "RTX 4070, i7-13700K, 16GB RAM",
    type: "Gaming Standard",
  },
  {
    id: 12,
    status: "occupied",
    user: "Vũ Thị F",
    timeRemaining: "1h 30m",
    game: "Dota 2",
    cpuUsage: 50,
    ramUsage: 65,
    temperature: 68,
    specs: "RTX 4080, i9-13900K, 32GB RAM",
    type: "Gaming Pro",
  },
];

// Let's fix the Progress bars by re-implementing them with pure divs
const CustomProgressBar = ({ value, className }: { value: number; className?: string }) => {
  const safeValue = value || 0;
  return (
    <div className={`w-full bg-gray-200 rounded-full ${className || 'h-1'}`}>
      <div
        className="bg-blue-600 rounded-full h-full"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
};

const Room: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "occupied" | "available" | "maintenance" | "reserved">("all");
  
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-red-100 border-red-200 text-red-800";
      case "available":
        return "bg-green-100 border-green-200 text-green-800";
      case "reserved":
        return "bg-yellow-100 border-yellow-200 text-yellow-800";
      case "maintenance":
        return "bg-gray-100 border-gray-200 text-gray-800";
      default:
        return "bg-gray-100 border-gray-200 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "occupied":
        return <Users className="w-5 h-5" />;
      case "available":
        return <CheckCircle className="w-5 h-5" />;
      case "reserved":
        return <Monitor className="w-5 h-5" />;
      case "maintenance":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const occupiedStations = stations.filter((s) => s.status === "occupied").length;
  const availableStations = stations.filter((s) => s.status === "available").length;
  const maintenanceStations = stations.filter((s) => s.status === "maintenance").length;
  const reservedStations = stations.filter((s) => s.status === "reserved").length;

  const filteredStations = selectedFilter === "all" 
    ? stations 
    : stations.filter(station => station.status === selectedFilter);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
    <motion.div
        initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trạng thái phòng máy</h1>
          <p className="text-gray-600">Giám sát và điều khiển tất cả máy trạm</p>
            </div>
        <Button onClick={handleRefresh} disabled={refreshing} className="bg-blue-600 hover:bg-blue-700 text-white">
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Đang làm mới..." : "Làm mới"}
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
                <p className="text-sm font-medium text-gray-600">Đang sử dụng</p>
                <p className="text-2xl font-bold text-gray-900">{occupiedStations}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
      </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Còn trống</p>
                <p className="text-2xl font-bold text-gray-900">{availableStations}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

      <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã đặt trước</p>
                <p className="text-2xl font-bold text-gray-900">{reservedStations}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Monitor className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bảo trì</p>
                <p className="text-2xl font-bold text-gray-900">{maintenanceStations}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        <Button 
          variant={selectedFilter === "all" ? "default" : "outline"}
          onClick={() => setSelectedFilter("all")}
          className={selectedFilter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300"}
        >
          Tất cả ({stations.length})
        </Button>
        <Button 
          variant={selectedFilter === "available" ? "default" : "outline"}
          onClick={() => setSelectedFilter("available")}
          className={selectedFilter === "available" ? "bg-green-600 text-white" : "bg-white text-gray-700 border border-gray-300"}
        >
          Còn trống ({availableStations})
        </Button>
        <Button 
          variant={selectedFilter === "occupied" ? "default" : "outline"}
          onClick={() => setSelectedFilter("occupied")}
          className={selectedFilter === "occupied" ? "bg-red-600 text-white" : "bg-white text-gray-700 border border-gray-300"}
        >
          Đang sử dụng ({occupiedStations})
        </Button>
        <Button 
          variant={selectedFilter === "reserved" ? "default" : "outline"}
          onClick={() => setSelectedFilter("reserved")}
          className={selectedFilter === "reserved" ? "bg-yellow-600 text-white" : "bg-white text-gray-700 border border-gray-300"}
        >
          Đã đặt trước ({reservedStations})
        </Button>
        <Button 
          variant={selectedFilter === "maintenance" ? "default" : "outline"}
          onClick={() => setSelectedFilter("maintenance")}
          className={selectedFilter === "maintenance" ? "bg-gray-600 text-white" : "bg-white text-gray-700 border border-gray-300"}
        >
          Bảo trì ({maintenanceStations})
        </Button>
      </motion.div>

      {/* Station Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Máy trạm</CardTitle>
            <CardDescription>Trạng thái thời gian thực của tất cả các máy trạm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredStations.map((station) => (
                <motion.div
                  key={station.id}
                  whileHover={{ scale: 1.02 }}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${getStatusColor(station.status)} ${
                    selectedStation?.id === station.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedStation(station)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">PC #{station.id}</h3>
                    {getStatusIcon(station.status)}
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{station.type}</p>
                    {station.user && <p className="text-gray-600">Người dùng: {station.user}</p>}
                    {station.timeRemaining && <p className="text-gray-600">Thời gian: {station.timeRemaining}</p>}
                    {station.game && <p className="text-gray-600">Game: {station.game}</p>}
                    {station.issue && <p className="text-red-600">Vấn đề: {station.issue}</p>}
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>CPU</span>
                      <span>{station.cpuUsage}%</span>
                    </div>
                    <CustomProgressBar value={station.cpuUsage} className="h-1" />

                    <div className="flex justify-between text-xs">
                      <span>RAM</span>
                      <span>{station.ramUsage}%</span>
                    </div>
                    <CustomProgressBar value={station.ramUsage} className="h-1" />

                    <div className="flex justify-between text-xs">
                      <span>Nhiệt độ</span>
                      <span>{station.temperature}°C</span>
                    </div>
                    <CustomProgressBar value={station.temperature} className="h-1" />
                  </div>
                </motion.div>
              ))}
          </div>
        </CardContent>
      </Card>
      </motion.div>

      {/* Station Details */}
      {selectedStation && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <Card>
            <CardHeader>
              <CardTitle>Chi tiết PC #{selectedStation.id}</CardTitle>
              <CardDescription>Thông tin chi tiết và điều khiển</CardDescription>
        </CardHeader>
        <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Station Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Thông tin máy trạm</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loại:</span>
                        <span>{selectedStation.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cấu hình:</span>
                        <span>{selectedStation.specs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trạng thái:</span>
                        <Badge className={getStatusColor(selectedStation.status)}>
                          {selectedStation.status === "occupied" 
                            ? "Đang sử dụng" 
                            : selectedStation.status === "available" 
                              ? "Còn trống" 
                              : selectedStation.status === "maintenance" 
                                ? "Bảo trì" 
                                : "Đã đặt trước"
                          }
                        </Badge>
                      </div>
                      {selectedStation.user && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Người dùng hiện tại:</span>
                          <span>{selectedStation.user}</span>
                        </div>
                      )}
                      {selectedStation.game && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Game hiện tại:</span>
                          <span>{selectedStation.game}</span>
                        </div>
                      )}
                      {selectedStation.timeRemaining && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Thời gian còn lại:</span>
                          <span>{selectedStation.timeRemaining}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Hiệu năng</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Sử dụng CPU</span>
                          <span>{selectedStation.cpuUsage}%</span>
                        </div>
                        <CustomProgressBar value={selectedStation.cpuUsage} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Sử dụng RAM</span>
                          <span>{selectedStation.ramUsage}%</span>
                        </div>
                        <CustomProgressBar value={selectedStation.ramUsage} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Nhiệt độ</span>
                          <span className={selectedStation.temperature > 75 ? "text-red-600" : "text-gray-900"}>
                            {selectedStation.temperature}°C
                          </span>
                        </div>
                        <CustomProgressBar value={selectedStation.temperature} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Điều khiển từ xa</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="border border-gray-300">
                        <Power className="w-4 h-4 mr-2" />
                        Khởi động lại
                      </Button>
                      <Button variant="outline" size="sm" className="border border-gray-300">
                        <Settings className="w-4 h-4 mr-2" />
                        Cài đặt
                      </Button>
                    </div>
                  </div>

                  {selectedStation.status === "occupied" && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Điều khiển phiên</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full border border-gray-300">
                          Gửi tin nhắn tới người dùng
                        </Button>
                        <Button variant="outline" className="w-full border border-gray-300">
                          Gia hạn thêm thời gian
                        </Button>
                        <Button variant="outline" className="w-full text-red-600 hover:text-red-700 border border-gray-300">
                          Kết thúc phiên
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedStation.status === "maintenance" && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Bảo trì</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Vấn đề: {selectedStation.issue}</p>
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                          Đánh dấu là đã sửa xong
                        </Button>
                        <Button variant="outline" className="w-full border border-gray-300">
                          Cập nhật vấn đề
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedStation.status === "available" && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Thao tác máy trạm</h3>
                      <div className="space-y-2">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Đặt trước máy
                        </Button>
                        <Button variant="outline" className="w-full border border-gray-300">
                          Đưa vào bảo trì
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
        </CardContent>
      </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Room; 