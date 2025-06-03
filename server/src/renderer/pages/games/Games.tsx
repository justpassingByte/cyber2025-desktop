import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Search, 
  Plus, 
  Download, 
  Trash2, 
  Settings, 
  ArrowUpDown, 
  Monitor, 
  Clock,
  Tag,
  BarChart3
} from 'lucide-react';
import Modal from '../../components/Modal';
import { Card, CardHeader, CardTitle, CardContent, GameCard } from '../../components/ui';

interface Game {
  id: number;
  name: string;
  publisher: string;
  size: string;
  genre: string[];
  installed: number;
  playTime: number;
  lastUpdated: string;
  version: string;
  status: 'active' | 'updating' | 'disabled';
  thumbnail: string;
}

// Sample data for games
const games: Game[] = [
  {
    id: 1,
    name: "Counter-Strike 2",
    publisher: "Valve",
    size: "25 GB",
    genre: ["FPS", "Competitive", "Tactical"],
    installed: 12,
    playTime: 1280,
    lastUpdated: "01/06/2024",
    version: "1.38.5.1",
    status: 'active',
    thumbnail: "cs2"
  },
  {
    id: 2,
    name: "League of Legends",
    publisher: "Riot Games",
    size: "18 GB",
    genre: ["MOBA", "Competitive", "Strategy"],
    installed: 12,
    playTime: 1450,
    lastUpdated: "28/05/2024",
    version: "14.10.1",
    status: 'active',
    thumbnail: "lol"
  },
  {
    id: 3,
    name: "Dota 2",
    publisher: "Valve",
    size: "30 GB",
    genre: ["MOBA", "Strategy", "Competitive"],
    installed: 8,
    playTime: 520,
    lastUpdated: "25/05/2024",
    version: "7.34c",
    status: 'active',
    thumbnail: "dota2"
  },
  {
    id: 4,
    name: "VALORANT",
    publisher: "Riot Games",
    size: "16 GB",
    genre: ["FPS", "Tactical", "Competitive"],
    installed: 10,
    playTime: 920,
    lastUpdated: "30/05/2024",
    version: "7.05",
    status: 'updating',
    thumbnail: "valorant"
  },
  {
    id: 5,
    name: "Fortnite",
    publisher: "Epic Games",
    size: "45 GB",
    genre: ["Battle Royale", "Action", "Survival"],
    installed: 6,
    playTime: 480,
    lastUpdated: "02/06/2024",
    version: "29.10",
    status: 'active',
    thumbnail: "fortnite"
  },
  {
    id: 6,
    name: "FIFA 24",
    publisher: "EA Sports",
    size: "55 GB",
    genre: ["Sports", "Simulation"],
    installed: 8,
    playTime: 650,
    lastUpdated: "15/05/2024",
    version: "1.7.0",
    status: 'active',
    thumbnail: "fifa24"
  },
  {
    id: 7,
    name: "GTA V",
    publisher: "Rockstar Games",
    size: "105 GB",
    genre: ["Open World", "Action", "Adventure"],
    installed: 10,
    playTime: 890,
    lastUpdated: "10/05/2024",
    version: "1.59",
    status: 'disabled',
    thumbnail: "gtav"
  },
  {
    id: 8,
    name: "Minecraft",
    publisher: "Mojang",
    size: "2 GB",
    genre: ["Sandbox", "Survival", "Creative"],
    installed: 5,
    playTime: 320,
    lastUpdated: "20/05/2024",
    version: "1.20.1",
    status: 'active',
    thumbnail: "minecraft"
  },
];

const Games: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<Game['status'] | 'all'>('all');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [modalType, setModalType] = useState<null | 'add' | 'edit' | 'activate' | 'disable'>(null);
  const [gameImage, setGameImage] = useState<string | null>(null);
  
  // Get unique genres
  const allGenres = Array.from(
    new Set(games.flatMap(game => game.genre))
  ).sort();

  // Filter games based on search term, genre, and status
  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         game.publisher.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = !selectedGenreFilter || game.genre.includes(selectedGenreFilter);
    
    const matchesStatus = selectedStatusFilter === 'all' || game.status === selectedStatusFilter;
    
    return matchesSearch && matchesGenre && matchesStatus;
  });

  // Game card background based on status
  const getStatusClass = (status: Game['status']) => {
    switch (status) {
      case 'active':
        return 'border-green-500/20 bg-green-500/5';
      case 'updating':
        return 'border-blue-500/20 bg-blue-500/5';
      case 'disabled':
        return 'border-red-500/20 bg-red-500/5';
      default:
        return 'border-gray-700';
    }
  };

  // Color and text for status badge
  const getStatusBadge = (status: Game['status']) => {
    switch (status) {
      case 'active':
        return { bgColor: 'bg-green-500/20', textColor: 'text-green-400', text: 'Hoạt động' };
      case 'updating':
        return { bgColor: 'bg-blue-500/20', textColor: 'text-blue-400', text: 'Đang cập nhật' };
      case 'disabled':
        return { bgColor: 'bg-red-500/20', textColor: 'text-red-400', text: 'Bị vô hiệu hóa' };
      default:
        return { bgColor: 'bg-gray-500/20', textColor: 'text-gray-400', text: 'Không xác định' };
    }
  };

  // Xử lý chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setGameImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Khi mở modal edit, set ảnh preview
  React.useEffect(() => {
    if (modalType === 'edit' && selectedGame) {
      setGameImage(selectedGame.thumbnail || null);
    }
    if (modalType === 'add') {
      setGameImage(null);
    }
  }, [modalType, selectedGame]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1 
          className="text-2xl font-bold text-foreground"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          Quản lý trò chơi
        </motion.h1>
        <motion.button 
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center gap-2 transition-colors" 
          onClick={() => setModalType('add')}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Plus className="w-4 h-4" />
          <span>Thêm trò chơi mới</span>
        </motion.button>
      </div>

      {/* Search and Filters */}
      <motion.div 
        className="bg-white border border-border rounded-lg p-4 flex flex-col md:flex-row gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc nhà phát hành..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <motion.select 
            className="px-3 py-2 bg-white border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedGenreFilter || ''}
            onChange={(e) => setSelectedGenreFilter(e.target.value === '' ? null : e.target.value)}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <option value="">Tất cả thể loại</option>
            {allGenres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </motion.select>
          <motion.select 
            className="px-3 py-2 bg-white border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="updating">Đang cập nhật</option>
            <option value="disabled">Đã vô hiệu hóa</option>
          </motion.select>
        </div>
      </motion.div>

      {/* Game Grid */}
      {filteredGames.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredGames.map((game, index) => (
            <GameCard 
              key={game.id}
              id={game.id}
              name={game.name}
              publisher={game.publisher}
              genre={game.genre}
              installed={game.installed}
              playTime={game.playTime}
              lastUpdated={game.lastUpdated}
              version={game.version}
              status={game.status}
              thumbnail={game.thumbnail}
              size={game.size}
              onClick={() => setSelectedGame(game)}
              isSelected={selectedGame?.id === game.id}
              index={index}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="flex flex-col items-center justify-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Gamepad2 className="w-10 h-10 text-primary opacity-60" />
          </div>
          <h3 className="text-xl font-medium text-foreground mb-2">Không tìm thấy trò chơi nào</h3>
          <p className="text-muted-foreground text-center">
            Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc
          </p>
        </motion.div>
      )}

      {/* Game Details */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        {selectedGame ? (
          <motion.div 
            key={selectedGame.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
          >
            <div className="p-6 border-b border-border flex items-center gap-4">
              {/* Ảnh game chi tiết */}
              {selectedGame.thumbnail && selectedGame.thumbnail.startsWith('data:') ? (
                <img src={selectedGame.thumbnail} alt={selectedGame.name} className="w-16 h-16 object-cover rounded bg-gray-700" />
              ) : (
                <Gamepad2 className="w-12 h-12 text-gray-500 bg-gray-700 rounded p-2" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">{selectedGame.name}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(selectedGame.status).bgColor} ${getStatusBadge(selectedGame.status).textColor}`}>
                    {getStatusBadge(selectedGame.status).text}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{selectedGame.publisher}</p>
              </div>
            </div>
            
            <div className="p-6 flex-1 overflow-auto space-y-6">
              {/* Game Info & Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-gray-400">Phiên bản</div>
                  <div className="text-foreground">{selectedGame.version}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-400">Dung lượng</div>
                  <div className="text-foreground">{selectedGame.size}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-400">Cập nhật lần cuối</div>
                  <div className="text-foreground">{selectedGame.lastUpdated}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-400">Đã cài đặt</div>
                  <div className="text-foreground">{selectedGame.installed}/12 máy</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-foreground mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-blue-400" />
                  Thể loại
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedGame.genre.map((genre, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-foreground mb-3 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-blue-400" />
                  Thống kê sử dụng
                </h3>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400 text-sm">Tổng thời gian chơi</span>
                    <span className="text-foreground text-sm">{Math.floor(selectedGame.playTime / 60)}h {selectedGame.playTime % 60}m</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400 text-sm">Trung bình mỗi ngày</span>
                    <span className="text-foreground text-sm">{Math.floor((selectedGame.playTime / 30) / 60)}h {Math.floor(selectedGame.playTime / 30) % 60}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Xếp hạng phổ biến</span>
                    <span className="text-foreground text-sm">#{games.sort((a, b) => b.playTime - a.playTime).findIndex(g => g.id === selectedGame.id) + 1}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-foreground mb-3 flex items-center">
                  <Monitor className="w-4 h-4 mr-2 text-blue-400" />
                  Trạng thái cài đặt
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 12 }, (_, i) => {
                    const isInstalled = i < selectedGame.installed;
                    return (
                      <div 
                        key={i} 
                        className={`rounded-md h-12 flex items-center justify-center ${
                          isInstalled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-500'
                        }`}
                      >
                        <span className="text-xs">PC #{i+1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-border flex space-x-2">
              {selectedGame.status === 'active' ? (
                <>
                  <button className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center justify-center gap-2" onClick={() => setModalType('edit')}>
                    <Download className="w-4 h-4" />
                    <span>Cập nhật tất cả</span>
                  </button>
                  <button className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded transition-colors flex items-center justify-center" onClick={() => setModalType('disable')}>
                    <Settings className="w-4 h-4" />
                  </button>
                </>
              ) : selectedGame.status === 'updating' ? (
                <button className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors flex items-center justify-center gap-2" onClick={() => setModalType('edit')}>
                  <Settings className="w-4 h-4" />
                  <span>Dừng cập nhật</span>
                </button>
              ) : (
                <button className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors flex items-center justify-center gap-2" onClick={() => setModalType('activate')}>
                  <Settings className="w-4 h-4" />
                  <span>Kích hoạt</span>
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex items-center justify-center p-6 text-center">
            <div className="text-gray-400">
              <div className="w-16 h-16 mx-auto bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                <Gamepad2 className="w-8 h-8 text-gray-500" />
              </div>
              <p>Chọn một trò chơi để xem chi tiết</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal logic */}
      <Modal open={modalType === 'add'} onClose={() => setModalType(null)} title="Thêm trò chơi mới">
        <form className="space-y-4">
          {/* Ảnh preview */}
          <div className="flex flex-col items-center gap-2">
            {gameImage ? (
              <img src={gameImage} alt="Ảnh game" className="w-20 h-20 object-cover rounded bg-background" />
            ) : (
              <Gamepad2 className="w-12 h-12 text-gray-500 bg-background rounded p-2" />
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="text-foreground" />
          </div>
          <input className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" placeholder="Tên trò chơi" />
          <input className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" placeholder="Nhà phát hành" />
          <input className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" placeholder="Dung lượng (GB)" />
          <input className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" placeholder="Thể loại (cách nhau bởi dấu phẩy)" />
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 bg-gray-200 text-foreground rounded" onClick={() => setModalType(null)}>Hủy</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Lưu</button>
          </div>
        </form>
      </Modal>
      <Modal open={modalType === 'edit'} onClose={() => setModalType(null)} title="Chỉnh sửa trò chơi">
        {selectedGame ? (
          <form className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              {gameImage ? (
                <img src={gameImage} alt="Ảnh game" className="w-20 h-20 object-cover rounded bg-background" />
              ) : (
                <Gamepad2 className="w-12 h-12 text-gray-500 bg-background rounded p-2" />
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="text-foreground" />
            </div>
            <input className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" defaultValue={selectedGame.name} />
            <input className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" defaultValue={selectedGame.publisher} />
            <input className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" defaultValue={selectedGame.size} />
            <input className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" defaultValue={selectedGame.genre.join(', ')} />
            <div className="flex justify-end gap-2">
              <button type="button" className="px-4 py-2 bg-gray-200 text-foreground rounded" onClick={() => setModalType(null)}>Hủy</button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Lưu</button>
            </div>
          </form>
        ) : null}
      </Modal>
      <Modal open={modalType === 'activate'} onClose={() => setModalType(null)} title="Kích hoạt trò chơi">
        {selectedGame ? (
          <div className="space-y-4">
            <div className="text-foreground">Bạn có chắc muốn kích hoạt trò chơi <b>{selectedGame.name}</b>?</div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-200 text-foreground rounded" onClick={() => setModalType(null)}>Hủy</button>
              <button className="px-4 py-2 bg-green-500 text-white rounded">Kích hoạt</button>
            </div>
          </div>
        ) : null}
      </Modal>
      <Modal open={modalType === 'disable'} onClose={() => setModalType(null)} title="Vô hiệu hóa trò chơi">
        {selectedGame ? (
          <div className="space-y-4">
            <div className="text-foreground">Bạn có chắc muốn vô hiệu hóa trò chơi <b>{selectedGame.name}</b>?</div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-200 text-foreground rounded" onClick={() => setModalType(null)}>Hủy</button>
              <button className="px-4 py-2 bg-red-500 text-white rounded">Vô hiệu hóa</button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default Games; 