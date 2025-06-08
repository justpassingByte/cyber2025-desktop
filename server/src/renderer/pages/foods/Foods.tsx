import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  RefreshCw,
  X
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Badge, Button } from '../../components/ui';
import Modal from '../../components/Modal';
import SystemNotification from '../../components/SystemNotification';
import { useFoodStore } from '../../stores/foodStore';
import { useCategoryStore } from '../../stores/categoryStore';

interface FoodItem {
  id: number;
  name: string;
  type: string; // "food" or "drink"
  price: number;
  description?: string;
  image_url?: string;
  stock: number;
  status: string; // active, out_of_stock, discontinued
  created_at: Date;
  updated_at: Date;
  menu_category_id: number;
  cost?: number; // Assuming cost might be in the database too
  sold?: number; // Assuming sold is tracked, might be from transactions
}
interface FoodItemDisplay extends FoodItem {
  categoryName: string;
}

const Foods: React.FC = () => {
  const { foods, loading: foodsLoading, fetchFoods, addFood, updateFood, deleteFood } = useFoodStore();
  const { categories, loading: categoriesLoading, fetchCategories } = useCategoryStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string | number>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    type: "food", // Default to food, can be drink
    price: 0,
    cost: 0,
    stock: 0,
    image_url: "",
    menu_category_id: 0, // Will be set from dropdown
    description: "",
  });
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [isDeletingItem, setIsDeletingItem] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FoodItem | null>(null);

  // Get ipcRenderer
  const ipcRenderer = window.require ? window.require('electron').ipcRenderer : undefined;

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, [fetchFoods, fetchCategories]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ipcRenderer) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        // Send to main process to save and get persistent URL
        try {
          const imageUrl = await ipcRenderer.invoke('save-food-image', base64Image);
          if (isAddingItem) {
            setNewItem({ ...newItem, image_url: imageUrl });
          } else if (isEditingItem && editingItem) {
            setEditingItem({ ...editingItem, image_url: imageUrl });
          }
        } catch (error) {
          console.error('Error saving image via IPC:', error);
          setNotification({ type: 'error', message: 'Không thể lưu hình ảnh.' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const foodItemsForDisplay: FoodItemDisplay[] = useMemo(() => {
    return foods.map(food => ({
      ...food,
      categoryName: getCategoryName(food.menu_category_id),
    }));
  }, [foods, categories]);

  const filteredItems = useMemo(() => {
    return foodItemsForDisplay.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.menu_category_id === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [foodItemsForDisplay, selectedCategory, searchQuery]);

  const getStatusColor = (stock: number, status: string) => {
    if (status === 'discontinued') return 'bg-gray-100 text-gray-800';
    if (stock <= 0) return "bg-red-100 text-red-800";
    if (stock < 10) return "bg-yellow-100 text-yellow-800"; // Example low stock threshold
    return "bg-green-100 text-green-800";
  };

  const getStatusText = (stock: number, status: string) => {
    if (status === 'discontinued') return 'Ngừng kinh doanh';
    if (stock <= 0) return "Hết hàng";
    if (stock < 10) return "Sắp hết";
    return "Có sẵn";
  };

  const totalRevenue = useMemo(() => foods.reduce((sum, item) => sum + item.price * (item.sold || 0), 0), [foods]);
  const totalProfit = useMemo(() => foods.reduce((sum, item) => sum + (item.price - (item.cost || 0)) * (item.sold || 0), 0), [foods]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || newItem.price <= 0 || newItem.menu_category_id === 0) {
      setNotification({ type: 'error', message: 'Vui lòng điền đầy đủ tên, giá và chọn danh mục.' });
      return;
    }

    const success = await addFood({
      name: newItem.name,
      type: newItem.type,
      price: Number(newItem.price),
      cost: Number(newItem.cost),
      stock: Number(newItem.stock),
      image_url: newItem.image_url,
      menu_category_id: Number(newItem.menu_category_id),
      description: newItem.description,
    });

    if (success) {
      setNotification({ type: 'success', message: `Đã thêm mặt hàng: ${newItem.name}` });
      setIsAddingItem(false);
      setNewItem({
        name: "",
        type: "food",
        price: 0,
        cost: 0,
        stock: 0,
        image_url: "",
        menu_category_id: 0,
        description: "",
      });
    } else {
      setNotification({ type: 'error', message: 'Không thể thêm mặt hàng.' });
    }
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name || editingItem.price <= 0 || editingItem.menu_category_id === 0) {
      setNotification({ type: 'error', message: 'Vui lòng điền đầy đủ tên, giá và chọn danh mục.' });
      return;
    }

    const success = await updateFood(editingItem.id, {
      name: editingItem.name,
      type: editingItem.type,
      price: Number(editingItem.price),
      cost: Number(editingItem.cost),
      stock: Number(editingItem.stock),
      image_url: editingItem.image_url,
      menu_category_id: Number(editingItem.menu_category_id),
      description: editingItem.description,
      status: editingItem.status, // Ensure status is passed for updates
    });

    if (success) {
      setNotification({ type: 'success', message: `Đã cập nhật mặt hàng: ${editingItem.name}` });
      setIsEditingItem(false);
      setEditingItem(null);
    } else {
      setNotification({ type: 'error', message: 'Không thể cập nhật mặt hàng.' });
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    const success = await deleteFood(itemToDelete.id);

    if (success) {
      setNotification({ type: 'success', message: `Đã xóa mặt hàng: ${itemToDelete.name}` });
      setIsDeletingItem(false);
      setItemToDelete(null);
    } else {
      setNotification({ type: 'error', message: 'Không thể xóa mặt hàng.' });
    }
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
                <p className="text-2xl font-bold text-gray-900">{foods.length}</p>
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
                  {foods.filter((item) => item.stock < 10 || item.stock <= 0).length}
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
            placeholder="Tìm kiếm đồ ăn/thức uống..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            className={selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-700'}
            onClick={() => setSelectedCategory('all')}
          >
            Tất cả
          </Button>
          {categories.map((category) => (
            <Button 
              key={category.id} // Ensure key is unique
              className={selectedCategory === category.id ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-700'}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Food List */}
      {foodsLoading || categoriesLoading ? (
        <div className="text-center py-8 text-gray-500">
          Đang tải dữ liệu...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy mặt hàng nào
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredItems.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <div className="relative w-full h-40 bg-gray-100 rounded-t-lg overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <UtensilsCrossed size={48} />
                  </div>
                )}
                <Badge className={
                  `${getStatusColor(item.stock, item.status)} absolute top-2 right-2`
                }>
                  {getStatusText(item.stock, item.status)}
                </Badge>
              </div>
              <CardContent className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.categoryName}</p>
                  <p className="text-xl font-bold text-green-600 mt-2">{item.price.toLocaleString("vi-VN")}₫</p>
                  <div className="text-sm text-gray-600 mt-2">
                    <p>Tồn kho: {item.stock}</p>
                    <p>Đã bán: {item.sold}</p>
                  </div>
                </div>
                <div className="flex mt-4 space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-50"
                    onClick={() => {
                      setEditingItem(item);
                      setIsEditingItem(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Sửa
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => {
                      setItemToDelete(item);
                      setIsDeletingItem(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Xóa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Add Item Modal */}
      <Modal open={isAddingItem} onClose={() => setIsAddingItem(false)} title="Thêm mặt hàng mới">
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label htmlFor="new-item-name" className="block text-sm font-medium text-gray-700">Tên mặt hàng <span className="text-red-500">*</span></label>
            <input
              id="new-item-name"
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="new-item-type" className="block text-sm font-medium text-gray-700">Loại</label>
            <select
              id="new-item-type"
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="food">Đồ ăn</option>
              <option value="drink">Đồ uống</option>
            </select>
          </div>
          <div>
            <label htmlFor="new-item-category" className="block text-sm font-medium text-gray-700">Danh mục <span className="text-red-500">*</span></label>
            <select
              id="new-item-category"
              value={newItem.menu_category_id}
              onChange={(e) => setNewItem({ ...newItem, menu_category_id: Number(e.target.value) })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value={0}>Chọn danh mục</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="new-item-price" className="block text-sm font-medium text-gray-700">Giá bán (VND) <span className="text-red-500">*</span></label>
              <input
                id="new-item-price"
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
                required
              />
            </div>
            <div>
              <label htmlFor="new-item-cost" className="block text-sm font-medium text-gray-700">Giá vốn (VND)</label>
              <input
                id="new-item-cost"
                type="number"
                value={newItem.cost}
                onChange={(e) => setNewItem({ ...newItem, cost: Number(e.target.value) })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
          </div>
          <div>
            <label htmlFor="new-item-stock" className="block text-sm font-medium text-gray-700">Tồn kho ban đầu</label>
            <input
              id="new-item-stock"
              type="number"
              value={newItem.stock}
              onChange={(e) => setNewItem({ ...newItem, stock: Number(e.target.value) })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="new-item-description" className="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea
              id="new-item-description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div>
            <label htmlFor="new-item-image" className="block text-sm font-medium text-gray-700">Hình ảnh</label>
            <input
              id="new-item-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {newItem.image_url && (
              <div className="mt-2 relative w-24 h-24">
                <img src={newItem.image_url} alt="Preview" className="w-full h-full object-cover rounded-md" />
                <button 
                  type="button" 
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  onClick={() => setNewItem({...newItem, image_url: ""})}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsAddingItem(false)}>Hủy</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Thêm mặt hàng</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Item Modal */}
      {editingItem && (
        <Modal open={isEditingItem} onClose={() => setIsEditingItem(false)} title={`Chỉnh sửa: ${editingItem.name}`}>
          <form onSubmit={handleEditItem} className="space-y-4">
            <div>
              <label htmlFor="edit-item-name" className="block text-sm font-medium text-gray-700">Tên mặt hàng <span className="text-red-500">*</span></label>
              <input
                id="edit-item-name"
                type="text"
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="edit-item-type" className="block text-sm font-medium text-gray-700">Loại</label>
              <select
                id="edit-item-type"
                value={editingItem.type}
                onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="food">Đồ ăn</option>
                <option value="drink">Đồ uống</option>
              </select>
            </div>
            <div>
              <label htmlFor="edit-item-category" className="block text-sm font-medium text-gray-700">Danh mục <span className="text-red-500">*</span></label>
              <select
                id="edit-item-category"
                value={editingItem.menu_category_id}
                onChange={(e) => setEditingItem({ ...editingItem, menu_category_id: Number(e.target.value) })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value={0}>Chọn danh mục</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-item-price" className="block text-sm font-medium text-gray-700">Giá bán (VND) <span className="text-red-500">*</span></label>
                <input
                  id="edit-item-price"
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-item-cost" className="block text-sm font-medium text-gray-700">Giá vốn (VND)</label>
                <input
                  id="edit-item-cost"
                  type="number"
                  value={editingItem.cost}
                  onChange={(e) => setEditingItem({ ...editingItem, cost: Number(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label htmlFor="edit-item-stock" className="block text-sm font-medium text-gray-700">Tồn kho</label>
              <input
                id="edit-item-stock"
                type="number"
                value={editingItem.stock}
                onChange={(e) => setEditingItem({ ...editingItem, stock: Number(e.target.value) })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="edit-item-description" className="block text-sm font-medium text-gray-700">Mô tả</label>
              <textarea
                id="edit-item-description"
                value={editingItem.description || ''}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <div>
              <label htmlFor="edit-item-image" className="block text-sm font-medium text-gray-700">Hình ảnh</label>
              <input
                id="edit-item-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {editingItem.image_url && (
                <div className="mt-2 relative w-24 h-24">
                  <img src={editingItem.image_url} alt="Preview" className="w-full h-full object-cover rounded-md" />
                  <button 
                    type="button" 
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    onClick={() => setEditingItem({...editingItem, image_url: ""})}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="edit-item-status" className="block text-sm font-medium text-gray-700">Trạng thái</label>
              <select
                id="edit-item-status"
                value={editingItem.status}
                onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Có sẵn</option>
                <option value="out_of_stock">Hết hàng</option>
                <option value="discontinued">Ngừng kinh doanh</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditingItem(false)}>Hủy</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Lưu thay đổi</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Item Confirmation Modal */}
      {itemToDelete && (
        <Modal open={isDeletingItem} onClose={() => setIsDeletingItem(false)} title="Xác nhận xóa mặt hàng">
          <div className="text-center space-y-4">
            <Trash2 className="w-16 h-16 text-red-500 mx-auto" />
            <p className="text-lg text-gray-700">
              Bạn có chắc chắn muốn xóa mặt hàng <span className="font-bold">{itemToDelete.name}</span> không?
            </p>
            <p className="text-sm text-gray-500">Thao tác này không thể hoàn tác.</p>
            <div className="flex justify-center space-x-4 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDeletingItem(false)}>Hủy</Button>
              <Button type="button" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteItem}>Xóa</Button>
            </div>
          </div>
        </Modal>
      )}
      {notification && (
        <SystemNotification 
          type={notification.type} 
          message={notification.message} 
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default Foods; 