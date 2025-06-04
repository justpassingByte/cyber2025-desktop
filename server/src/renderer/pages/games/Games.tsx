import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  Search, 
  Plus, 
  Download, 
  Play,
  Pause,
  Trash2, 
  Settings, 
  HardDrive,
  Users,
  Star
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Badge, Button } from '../../components/ui';

// Custom Progress Bar implementation
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

interface Game {
  id: number;
  name: string;
  category: string;
  size: string;
  players: number;
  rating: number;
  status: 'installed' | 'updating' | 'not_installed';
  lastUpdated: string;
  playtime: string;
  image: string;
  version: string;
  updateProgress?: number;
}

const games: Game[] = [
  {
    id: 1,
    name: "Counter-Strike: Global Offensive",
    category: "FPS",
    size: "15.2 GB",
    players: 156,
    rating: 4.8,
    status: "installed",
    lastUpdated: "2024-06-01",
    playtime: "2,450 hours",
    image: "/images/cs2.jpg",
    version: "1.38.7.8",
  },
  {
    id: 2,
    name: "League of Legends",
    category: "MOBA",
    size: "22.1 GB",
    players: 89,
    rating: 4.6,
    status: "installed",
    lastUpdated: "2024-05-28",
    playtime: "1,890 hours",
    image: "/images/lol.jpg",
    version: "14.11",
  },
  {
    id: 3,
    name: "Valorant",
    category: "FPS",
    size: "8.9 GB",
    players: 234,
    rating: 4.7,
    status: "updating",
    lastUpdated: "2024-06-02",
    playtime: "1,234 hours",
    image: "/images/valorant.jpg",
    version: "8.11",
    updateProgress: 65,
  },
  {
    id: 4,
    name: "Fortnite",
    category: "Battle Royale",
    size: "26.4 GB",
    players: 67,
    rating: 4.3,
    status: "installed",
    lastUpdated: "2024-05-30",
    playtime: "890 hours",
    image: "/images/fortnite.jpg",
    version: "30.10",
  },
  {
    id: 5,
    name: "Apex Legends",
    category: "Battle Royale",
    size: "75.2 GB",
    players: 45,
    rating: 4.5,
    status: "not_installed",
    lastUpdated: "N/A",
    playtime: "0 hours",
    image: "/images/apex.jpg",
    version: "20.1",
  },
  {
    id: 6,
    name: "Dota 2",
    category: "MOBA",
    size: "45.8 GB",
    players: 78,
    rating: 4.4,
    status: "installed",
    lastUpdated: "2024-06-01",
    playtime: "1,567 hours",
    image: "/images/dota2.jpg",
    version: "7.36c",
  },
];

const categories = ["All", "FPS", "MOBA", "Battle Royale", "RPG", "Strategy", "Sports"];

const Games: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredGames = games.filter((game) => {
    const matchesCategory = selectedCategory === "All" || game.category === selectedCategory;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || game.status === selectedStatus;
    return matchesCategory && matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "installed":
        return "bg-green-100 text-green-800";
      case "updating":
        return "bg-blue-100 text-blue-800";
      case "not_installed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "installed":
        return "Đã cài đặt";
      case "updating":
        return "Đang cập nhật";
      case "not_installed":
        return "Chưa cài đặt";
      default:
        return "Không xác định";
    }
  };

  const totalGames = games.length;
  const installedGames = games.filter((game) => game.status === "installed").length;
  const totalSize = games
    .filter((game) => game.status === "installed")
    .reduce((sum, game) => {
      // Extract numeric value from size string (e.g., "15.2 GB" -> 15.2)
      const sizeValue = parseFloat(game.size);
      return isNaN(sizeValue) ? sum : sum + sizeValue;
    }, 0);
  const totalPlayers = games.reduce((sum, game) => sum + game.players, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý trò chơi</h1>
          <p className="text-gray-600">Quản lý cài đặt và cập nhật trò chơi</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Cài đặt trò chơi
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
                <p className="text-sm font-medium text-gray-600">Tổng số trò chơi</p>
                <p className="text-2xl font-bold text-gray-900">{totalGames}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã cài đặt</p>
                <p className="text-2xl font-bold text-gray-900">{installedGames}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Download className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dung lượng sử dụng</p>
                <p className="text-2xl font-bold text-gray-900">{totalSize.toFixed(1)} GB</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Người chơi hiện tại</p>
                <p className="text-2xl font-bold text-gray-900">{totalPlayers}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
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
            placeholder="Tìm kiếm trò chơi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300"}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button 
            variant={selectedStatus === "all" ? "default" : "outline"}
            onClick={() => setSelectedStatus("all")}
            className={selectedStatus === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300"}
          >
            Tất cả
          </Button>
          <Button
            variant={selectedStatus === "installed" ? "default" : "outline"}
            onClick={() => setSelectedStatus("installed")}
            className={selectedStatus === "installed" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300"}
          >
            Đã cài đặt
          </Button>
          <Button
            variant={selectedStatus === "not_installed" ? "default" : "outline"}
            onClick={() => setSelectedStatus("not_installed")}
            className={selectedStatus === "not_installed" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300"}
          >
            Khả dụng
          </Button>
        </div>
      </motion.div>

      {/* Games Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Thư viện trò chơi</CardTitle>
            <CardDescription>Quản lý bộ sưu tập và cài đặt trò chơi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
        <motion.div 
              key={game.id}
                  whileHover={{ scale: 1.02 }}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="relative">
                    <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                      {game.image ? (
                        <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
                      ) : (
                        <Gamepad2 className="w-12 h-12 text-gray-400" />
                      )}
                </div>
                    <Badge className={`absolute top-2 right-2 ${getStatusColor(game.status)}`}>
                      {getStatusText(game.status)}
                    </Badge>
            </div>
            
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{game.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{game.category}</p>

                    {game.status === "updating" && game.updateProgress !== undefined && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Đang cập nhật...</span>
                          <span className="text-gray-900">{game.updateProgress}%</span>
                        </div>
                        <CustomProgressBar value={game.updateProgress || 0} className="h-2" />
                      </div>
                    )}

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dung lượng:</span>
                        <span className="font-medium">{game.size}</span>
                  </div>
                  <div className="flex justify-between">
                        <span className="text-gray-600">Người chơi:</span>
                        <span className="font-medium">{game.players}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Đánh giá:</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="font-medium">{game.rating}</span>
                </div>
              </div>
                      {game.status === "installed" && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Thời gian chơi:</span>
                          <span className="font-medium">{game.playtime}</span>
          </div>
        )}
      </div>

                    <div className="flex gap-2">
                      {game.status === "installed" ? (
                        <>
                          <Button variant="outline" size="sm" className="flex-1 border border-gray-300">
                            <Play className="w-4 h-4 mr-1" />
                            Chạy
                          </Button>
                          <Button variant="outline" size="sm" className="border border-gray-300">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border border-gray-300">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      ) : game.status === "updating" ? (
                        <Button variant="outline" size="sm" className="flex-1 border border-gray-300">
                          <Pause className="w-4 h-4 mr-1" />
                          Tạm dừng
                        </Button>
                      ) : (
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                          <Download className="w-4 h-4 mr-1" />
                          Cài đặt
                        </Button>
                      )}
            </div>
          </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Games; 