import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Plus,
  Edit,
  Trash2,
  UtensilsCrossed,
  DollarSign,
  Package,
  TrendingUp,
  Coffee,
  Cookie,
  IceCream,
  RefreshCw
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Badge, Button } from '../../components/ui';


interface FoodItem {
  id: number;
  name: string;
  category: 'drinks' | 'snacks' | 'meals' | 'desserts';
  price: number;
  cost: number;
  stock: number;
  sold: number;
  status: 'available' | 'low_stock' | 'out_of_stock';
  image: string;
}

const foodItems: FoodItem[] = [
  {
    id: 1,
    name: "Nước tăng lực",
    category: 'drinks',
    price: 35000,
    cost: 15000,
    stock: 45,
    sold: 156,
    status: "available",
    image: "/images/energydrink.jpg",
  },
  {
    id: 2,
    name: "Burger gaming",
    category: 'meals',
    price: 65000,
    cost: 32000,
    stock: 12,
    sold: 89,
    status: "available",
    image: "/images/burger.jpg",
  },
  {
    id: 3,
    name: "Snack mì cay",
    category: 'snacks',
    price: 15000,
    cost: 7000,
    stock: 0,
    sold: 234,
    status: "out_of_stock",
    image: "/images/chips.jpg",
  },
  {
    id: 4,
    name: "Kem sundae",
    category: 'desserts',
    price: 25000,
    cost: 12000,
    stock: 8,
    sold: 67,
    status: "low_stock",
    image: "/images/icecream.jpg",
  },
  {
    id: 5,
    name: "Cà phê",
    category: 'drinks',
    price: 20000,
    cost: 8000,
    stock: 25,
    sold: 178,
    status: "available",
    image: "/images/coffee.jpg",
  },
];

const categories = [
  { id: "all", name: "Tất cả", icon: UtensilsCrossed },
  { id: "drinks", name: "Đồ uống", icon: Coffee },
  { id: "snacks", name: "Đồ ăn nhẹ", icon: Cookie },
  { id: "meals", name: "Bữa ăn", icon: UtensilsCrossed },
  { id: "desserts", name: "Tráng miệng", icon: IceCream },
];

const Foods: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "drinks",
    price: "",
    cost: "",
    stock: "",
    image: ""
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to a server
      // For now, we'll create a temporary object URL to display the image
      const imageUrl = URL.createObjectURL(file);
      setNewItem({ ...newItem, image: imageUrl });
    }
  };

  const filteredItems = foodItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "low_stock":
        return "bg-yellow-100 text-yellow-800";
      case "out_of_stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Có sẵn";
      case "low_stock":
        return "Sắp hết";
      case "out_of_stock":
        return "Hết hàng";
      default:
        return "Không rõ";
    }
  };

  const totalRevenue = foodItems.reduce((sum, item) => sum + item.price * item.sold, 0);
  const totalProfit = foodItems.reduce((sum, item) => sum + (item.price - item.cost) * item.sold, 0);

    return (
    <div className="p-6 space-y-6">
      {/* Header */}
          <motion.div 
        initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đồ ăn & thức uống</h1>
          <p className="text-gray-600">Quản lý mặt hàng, hàng tồn kho và giá cả</p>
        </div>
        <Button onClick={() => setIsAddingItem(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Thêm mặt hàng
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
                <p className="text-sm font-medium text-gray-600">Tổng mặt hàng</p>
                <p className="text-2xl font-bold text-gray-900">{foodItems.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString("vi-VN")}₫</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
        </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lợi nhuận</p>
                <p className="text-2xl font-bold text-gray-900">{totalProfit.toLocaleString("vi-VN")}₫</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
      </div>
          </CardContent>
        </Card>
  
        <Card>
          <CardContent className="p-6">
      <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sắp hết hàng</p>
                <p className="text-2xl font-bold text-gray-900">
                  {foodItems.filter((item) => item.status === "low_stock" || item.status === "out_of_stock").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-red-600" />
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tìm kiếm mặt hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              className={selectedCategory === category.id ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300"}
              onClick={() => setSelectedCategory(category.id)}
            >
              <category.icon className="w-4 h-4 mr-2" />
              {category.name}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Add Item Form */}
      {isAddingItem && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Thêm mặt hàng mới</CardTitle>
              <CardDescription>Thêm mặt hàng mới vào thực đơn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên mặt hàng</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Nhập tên mặt hàng"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="drinks">Đồ uống</option>
                    <option value="snacks">Đồ ăn nhẹ</option>
                    <option value="meals">Bữa ăn</option>
                    <option value="desserts">Tráng miệng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (₫)</label>
                  <input
                    type="number"
                    step="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá vốn (₫)</label>
                  <input
                    type="number"
                    step="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newItem.cost}
                    onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng ban đầu</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newItem.stock}
                    onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-16 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
                      {newItem.image ? (
                        <img src={newItem.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Coffee className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={newItem.image}
                        onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                        placeholder="URL hình ảnh"
                      />
                      <p className="text-xs text-gray-500 mt-1">Nhập đường dẫn hình ảnh hoặc tải lên ảnh</p>
                      <div className="mt-2">
                        <label className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md cursor-pointer hover:bg-blue-700">
                          <Plus className="w-4 h-4 mr-1" />
                          Tải lên ảnh
                          <input 
                            type="file" 
                            accept="image/*"
                            className="hidden" 
                            onChange={handleImageUpload} 
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Thêm mặt hàng</Button>
                <Button variant="outline" onClick={() => setIsAddingItem(false)} className="border border-gray-300">
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Menu Items Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle>Danh sách mặt hàng</CardTitle>
            <CardDescription>Quản lý danh sách đồ ăn và thức uống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Coffee className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <Badge className={getStatusColor(item.status)}>{getStatusText(item.status)}</Badge>
                  </div>

                  <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá bán:</span>
                      <span className="font-medium">{item.price.toLocaleString("vi-VN")}₫</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá vốn:</span>
                      <span className="font-medium">{item.cost.toLocaleString("vi-VN")}₫</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tồn kho:</span>
                      <span className={`font-medium ${item.stock <= 5 ? "text-red-600" : "text-gray-900"}`}>
                        {item.stock}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Đã bán:</span>
                      <span className="font-medium">{item.sold}</span>
          </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lợi nhuận:</span>
                      <span className="font-medium text-green-600">
                        {((item.price - item.cost) * item.sold).toLocaleString("vi-VN")}₫
                      </span>
          </div>
            </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1 border border-gray-300">
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 border border-gray-300">
                      <Package className="w-4 h-4 mr-1" />
                      Nhập hàng
                    </Button>
                    <Button variant="outline" size="sm" className="border border-gray-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

export default Foods; 