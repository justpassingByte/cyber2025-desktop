import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee,
  Search,
  Plus,
  Edit,
  Trash2,
  ShoppingBag,
  DollarSign,
  Tag,
  BadgeCheck,
  Clock,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Pizza
} from 'lucide-react';
import Modal from '../../components/Modal';
import { Card, CardHeader, CardTitle, CardContent, FoodCard } from '../../components/ui';

interface FoodItem {
  id: number;
  name: string;
  category: 'drink' | 'snack' | 'meal' | 'dessert';
  price: number;
  stock: number;
  image: string;
  popular: boolean;
  available: boolean;
  description?: string;
}

interface Order {
  id: number;
  items: { foodId: number; quantity: number }[];
  customerName: string;
  station: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  timestamp: string;
  total: number;
}

const foodItems: FoodItem[] = [
  {
    id: 1,
    name: "Cà phê đen",
    category: 'drink',
    price: 20000,
    stock: 50,
    image: "coffee",
    popular: true,
    available: true,
    description: "Cà phê nguyên chất được pha theo phong cách Việt Nam truyền thống."
  },
  {
    id: 2,
    name: "Coca Cola",
    category: 'drink',
    price: 15000,
    stock: 48,
    image: "cola",
    popular: true,
    available: true
  },
  {
    id: 3,
    name: "Red Bull",
    category: 'drink',
    price: 25000,
    stock: 30,
    image: "redbull",
    popular: true,
    available: true,
    description: "Nước tăng lực giúp tỉnh táo và tập trung hơn."
  },
  {
    id: 4,
    name: "Mì tôm trứng",
    category: 'meal',
    price: 25000,
    stock: 25,
    image: "noodles",
    popular: true,
    available: true,
    description: "Mì gói được nấu với trứng, hành và các gia vị đặc trưng."
  },
  {
    id: 5,
    name: "Snack khoai tây",
    category: 'snack',
    price: 12000,
    stock: 40,
    image: "chips",
    popular: false,
    available: true,
    description: "Snack khoai tây giòn rụm với nhiều hương vị."
  },
  {
    id: 6,
    name: "Bánh mì trứng",
    category: 'meal',
    price: 25000,
    stock: 15,
    image: "sandwich",
    popular: false,
    available: true,
    description: "Bánh mì giòn với trứng, chả, pate và rau tươi."
  },
  {
    id: 7,
    name: "Sandwich gà",
    category: 'meal',
    price: 35000,
    stock: 0,
    image: "sandwich_chicken",
    popular: false,
    available: false,
    description: "Sandwich với thịt gà nướng, rau xà lách và sốt đặc biệt."
  },
  {
    id: 8,
    name: "Trà đào",
    category: 'drink',
    price: 25000,
    stock: 25,
    image: "tea",
    popular: false,
    available: true,
    description: "Trà đào thơm mát với đào tươi và đá."
  },
];

const orders: Order[] = [
  {
    id: 1,
    items: [{ foodId: 1, quantity: 2 }, { foodId: 4, quantity: 1 }],
    customerName: "Nguyễn Văn A",
    station: "PC #2",
    status: 'pending',
    timestamp: "10:45 AM",
    total: 65000
  },
  {
    id: 2,
    items: [{ foodId: 3, quantity: 1 }, { foodId: 5, quantity: 2 }],
    customerName: "Trần Thị B",
    station: "PC #5",
    status: 'preparing',
    timestamp: "10:30 AM",
    total: 49000
  },
  {
    id: 3,
    items: [{ foodId: 8, quantity: 1 }],
    customerName: "Lê Văn C",
    station: "PC #8",
    status: 'ready',
    timestamp: "10:15 AM",
    total: 25000
  },
  {
    id: 4,
    items: [{ foodId: 2, quantity: 2 }, { foodId: 5, quantity: 1 }, { foodId: 6, quantity: 1 }],
    customerName: "Phạm Thị D",
    station: "PC #3",
    status: 'delivered',
    timestamp: "09:50 AM",
    total: 67000
  },
];

const Foods: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [modalType, setModalType] = useState<null | 'add' | 'edit' | 'delete'>(null);
  const [foodImage, setFoodImage] = useState<string | null>(null);
  
  // Filter food items based on search and category
  const filteredFoodItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  // Get food item by id
  const getFoodItemById = (id: number) => {
    return foodItems.find(item => item.id === id);
  };
  
  // Get status color and text
  const getOrderStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', text: 'Đang chờ' };
      case 'preparing':
        return { color: 'text-blue-400', bgColor: 'bg-blue-500/20', text: 'Đang chuẩn bị' };
      case 'ready':
        return { color: 'text-green-400', bgColor: 'bg-green-500/20', text: 'Sẵn sàng' };
      case 'delivered':
        return { color: 'text-purple-400', bgColor: 'bg-purple-500/20', text: 'Đã giao' };
      default:
        return { color: 'text-gray-400', bgColor: 'bg-gray-500/20', text: 'Không xác định' };
    }
  };
  
  // Xử lý chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFoodImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Khi mở modal edit, set ảnh preview
  React.useEffect(() => {
    if (modalType === 'edit' && selectedFoodItem) {
      setFoodImage(selectedFoodItem.image || null);
    }
    if (modalType === 'add') {
      setFoodImage(null);
    }
  }, [modalType, selectedFoodItem]);
  
  // Render menu tab
  const renderMenuTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <motion.div 
            className="relative flex-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm đồ ăn..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {['all', 'drink', 'snack', 'meal', 'dessert'].map((category, index) => (
              <motion.button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  categoryFilter === category
                    ? 'bg-primary text-white'
                    : 'bg-white border border-border text-foreground hover:bg-gray-50'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (index * 0.05), duration: 0.3 }}
              >
                {category === 'all' && 'Tất cả'}
                {category === 'drink' && 'Đồ uống'}
                {category === 'snack' && 'Đồ ăn vặt'}
                {category === 'meal' && 'Bữa ăn'}
                {category === 'dessert' && 'Tráng miệng'}
              </motion.button>
            ))}
          </motion.div>
        </div>
        
        {filteredFoodItems.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.07
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {filteredFoodItems.map((item, index) => (
              <FoodCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                category={item.category}
                available={item.available}
                popular={item.popular}
                stock={item.stock}
                image={item.image}
                description={item.description}
                onClick={() => setSelectedFoodItem(item)}
                isSelected={selectedFoodItem?.id === item.id}
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="flex flex-col items-center justify-center py-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Coffee className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">Không tìm thấy đồ ăn nào</h3>
            <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
          </motion.div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Quản lý đồ ăn</h1>
        <div className="flex gap-2">
          <motion.button 
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === 'menu' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white border border-border text-foreground hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('menu')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Coffee className="w-4 h-4" />
            <span>Menu</span>
          </motion.button>
          <motion.button 
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === 'orders' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white border border-border text-foreground hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('orders')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Đơn hàng</span>
          </motion.button>
          <motion.button
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center gap-2 transition-colors"
            onClick={() => setModalType('add')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" />
            <span>Thêm món mới</span>
          </motion.button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'menu' ? renderMenuTab() : /* renderOrdersTab() */ null}
      </motion.div>

      {/* Modal logic */}
      <Modal open={modalType === 'add'} onClose={() => setModalType(null)} title="Thêm món ăn mới">
        <form className="space-y-4">
          {/* Ảnh preview */}
          <div className="flex flex-col items-center gap-2">
            {foodImage ? (
              <img src={foodImage} alt="Ảnh món ăn" className="w-20 h-20 object-cover rounded-full bg-background" />
            ) : (
              <Coffee className="w-12 h-12 text-gray-500 bg-background rounded-full p-2" />
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="text-foreground" />
          </div>
          <input className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" placeholder="Tên món ăn" />
          <input className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" placeholder="Giá (VND)" type="number" />
          <input className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" placeholder="Tồn kho" type="number" />
          <textarea className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" placeholder="Mô tả" />
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 bg-gray-200 text-foreground rounded" onClick={() => setModalType(null)}>Hủy</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Lưu</button>
          </div>
        </form>
      </Modal>
      <Modal open={modalType === 'edit'} onClose={() => setModalType(null)} title="Chỉnh sửa món ăn">
        {selectedFoodItem ? (
          <form className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              {foodImage ? (
                <img src={foodImage} alt="Ảnh món ăn" className="w-20 h-20 object-cover rounded-full bg-background" />
              ) : (
                <Coffee className="w-12 h-12 text-gray-500 bg-background rounded-full p-2" />
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="text-foreground" />
            </div>
            <input className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" defaultValue={selectedFoodItem.name} />
            <input className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" defaultValue={selectedFoodItem.price} type="number" />
            <input className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" defaultValue={selectedFoodItem.stock} type="number" />
            <textarea className="w-full px-3 py-2 bg-white border border-border rounded text-foreground" defaultValue={selectedFoodItem.description} />
            <div className="flex justify-end gap-2">
              <button type="button" className="px-4 py-2 bg-gray-200 text-foreground rounded" onClick={() => setModalType(null)}>Hủy</button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Lưu</button>
            </div>
          </form>
        ) : null}
      </Modal>
      <Modal open={modalType === 'delete'} onClose={() => setModalType(null)} title="Xóa món ăn">
        {selectedFoodItem ? (
          <div className="space-y-4">
            <div className="text-foreground">Bạn có chắc muốn xóa món <b>{selectedFoodItem.name}</b>?</div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-200 text-foreground rounded" onClick={() => setModalType(null)}>Hủy</button>
              <button className="px-4 py-2 bg-red-500 text-white rounded">Xóa</button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default Foods; 