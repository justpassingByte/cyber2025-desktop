import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Database, 
  Server, 
  Shield, 
  Bell, 
  Monitor, 
  Wifi, 
  Key,
  Save,
  ChevronRight,
  Globe,
  Clock,
  User,
  DollarSign,
  Brush,
  Mail,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ListTree,
  Plus, Edit, Trash2, X
} from 'lucide-react';
import Modal from '../../components/Modal';
import { useTheme } from '../../components/ThemeProvider';
import { Card, CardHeader, CardTitle, CardContent, SettingsCard, SettingsGroup, SettingsField, SettingsToggle, Badge, Button } from '../../components/ui';
import SystemNotification from '../../components/SystemNotification';
import { useCategoryStore } from '../../stores/categoryStore';

// Import electron IPC renderer
const { ipcRenderer } = window.require('electron');

interface CategoryItem {
  id: number;
  name: string;
  description?: string;
  display_order: number;
  image_url?: string;
  status: string; // active, inactive
  created_at: Date;
  updated_at: Date;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'database' | 'security' | 'notifications' | 'categories'>('general');
  const [saving, setSaving] = useState<boolean>(false);
  const [modalType, setModalType] = useState<null | 'save' | 'backup' | 'clearLogs' | 'testEmail' | 'addCategory' | 'editCategory' | 'deleteCategory'>(null);
  const [actionStatus, setActionStatus] = useState<string>('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Category management states
  const { categories, loading: categoriesLoading, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const [newCategory, setNewCategory] = useState({ name: '', description: '', display_order: 0, image_url: '', status: 'active' });
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
  
  // General settings
  const [serverName, setServerName] = useState<string>('CyberCafe Server');
  const [serverPort, setServerPort] = useState<string>('3000');
  const [language, setLanguage] = useState<string>('vi');
  const [clientTimeout, setClientTimeout] = useState<string>('30');
  const [currency, setCurrency] = useState<string>('VND');
  
  // Database settings
  const [dbHost, setDbHost] = useState<string>('localhost');
  const [dbPort, setDbPort] = useState<string>('27017');
  const [dbName, setDbName] = useState<string>('cybercafe');
  const [dbUsername, setDbUsername] = useState<string>('admin');
  const [dbPassword, setDbPassword] = useState<string>('********');
  
  // Security settings
  const [enableTwoFactor, setEnableTwoFactor] = useState<boolean>(false);
  const [passwordExpiration, setPasswordExpiration] = useState<string>('30');
  const [adminSessionTimeout, setAdminSessionTimeout] = useState<string>('60');
  const [backupFrequency, setBackupFrequency] = useState<string>('daily');
  
  // Notifications settings
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [lowBalanceAlert, setLowBalanceAlert] = useState<boolean>(true);
  const [systemAlerts, setSystemAlerts] = useState<boolean>(true);
  const [alertEmailAddress, setAlertEmailAddress] = useState<string>('admin@cybercafe.com');
  
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    if (activeTab === 'categories') {
      fetchCategories();
    }
  }, [activeTab, fetchCategories]);
  
  const handleSaveSettings = () => {
    setModalType('save');
  };
  
  const confirmSaveSettings = () => {
    setSaving(true);
    setActionStatus('');
    setModalType(null);
    setTimeout(() => {
      ipcRenderer.send('save-settings', {
        general: { serverName, serverPort, language, theme, clientTimeout, currency },
        database: { dbHost, dbPort, dbName, dbUsername, dbPassword },
        security: { enableTwoFactor, passwordExpiration, adminSessionTimeout, backupFrequency },
        notifications: { emailNotifications, lowBalanceAlert, systemAlerts, alertEmailAddress }
      });
      setSaving(false);
      setActionStatus('Lưu cài đặt thành công!');
    }, 1000);
  };
  
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) {
      setNotification({ type: 'error', message: 'Tên danh mục không được để trống.' });
      return;
    }
    const success = await addCategory(newCategory);
    if (success) {
      setNotification({ type: 'success', message: `Đã thêm danh mục: ${newCategory.name}` });
      setModalType(null);
      setNewCategory({ name: '', description: '', display_order: 0, image_url: '', status: 'active' });
    } else {
      setNotification({ type: 'error', message: 'Không thể thêm danh mục.' });
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) {
      setNotification({ type: 'error', message: 'Tên danh mục không được để trống.' });
      return;
    }
    const success = await updateCategory(editingCategory.id, editingCategory);
    if (success) {
      setNotification({ type: 'success', message: `Đã cập nhật danh mục: ${editingCategory.name}` });
      setModalType(null);
      setEditingCategory(null);
    } else {
      setNotification({ type: 'error', message: 'Không thể cập nhật danh mục.' });
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    const success = await deleteCategory(deletingCategory.id);
    if (success) {
      setNotification({ type: 'success', message: `Đã xóa danh mục: ${deletingCategory.name}` });
      setModalType(null);
      setDeletingCategory(null);
    } else {
      setNotification({ type: 'error', message: 'Không thể xóa danh mục.' });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (isNew) {
        setNewCategory({ ...newCategory, image_url: imageUrl });
      } else if (editingCategory) {
        setEditingCategory({ ...editingCategory, image_url: imageUrl });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Không hoạt động";
      default:
        return "Không rõ";
    }
  };
  
  // Render General Settings
  const renderGeneralSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h2 
        className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"
      >
        <SettingsIcon className="w-5 h-5 text-primary" />
        Cài đặt chung
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingsCard 
          title="Cài đặt máy chủ" 
          icon={<Server className="w-5 h-5" />}
        >
          <SettingsGroup>
            <SettingsField label="Tên máy chủ">
              <motion.input
                type="text"
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
              />
            </SettingsField>
            
            <SettingsField label="Cổng máy chủ">
              <motion.input
                type="text"
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={serverPort}
                onChange={(e) => setServerPort(e.target.value)}
              />
            </SettingsField>
          </SettingsGroup>
        </SettingsCard>
        
        <SettingsCard 
          title="Giao diện" 
          icon={<Brush className="w-5 h-5" />}
        >
          <SettingsGroup>
            <SettingsField label="Ngôn ngữ">
              <motion.select 
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
                <option value="zh">中文</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
              </motion.select>
            </SettingsField>
            
            <SettingsField label="Chế độ giao diện">
              <motion.select 
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={theme}
                onChange={(e) => setTheme('light')}
                disabled={true}
              >
                <option value="light">Sáng</option>
              </motion.select>
              <p className="text-xs text-muted-foreground mt-1">Hiện tại ứng dụng chỉ hỗ trợ giao diện sáng</p>
            </SettingsField>
          </SettingsGroup>
        </SettingsCard>
      </div>
      
      <div className="mt-6">
        <SettingsCard 
          title="Cài đặt hệ thống" 
          icon={<Clock className="w-5 h-5" />}
        >
          <SettingsGroup>
            <SettingsField label="Thời gian chờ máy khách (phút)">
              <motion.input
                type="text"
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={clientTimeout}
                onChange={(e) => setClientTimeout(e.target.value)}
              />
            </SettingsField>
            
            <SettingsField label="Đơn vị tiền tệ">
              <motion.select 
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="VND">VND (₫)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="KRW">KRW (₩)</option>
              </motion.select>
            </SettingsField>
          </SettingsGroup>

          <motion.div 
            className="mt-4 border-t border-gray-200 pt-4"
          >
            <SettingsToggle
              label="Đặt ứng dụng khởi động cùng Windows"
              description="Ứng dụng sẽ tự động khởi động khi bật máy tính"
              checked={false}
              onChange={(value) => console.log('Auto start:', value)}
            />
          </motion.div>
        </SettingsCard>
      </div>
    </motion.div>
  );

  // Render Database Settings
  const renderDatabaseSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h2 
        className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"
      >
        <Database className="w-5 h-5 text-primary" />
        Cài đặt cơ sở dữ liệu
      </motion.h2>
      
        <SettingsCard 
          title="Cấu hình cơ sở dữ liệu" 
          icon={<Database className="w-5 h-5" />}
        >
          <SettingsGroup>
            <SettingsField label="Máy chủ">
              <motion.input
                type="text"
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={dbHost}
                onChange={(e) => setDbHost(e.target.value)}
              />
            </SettingsField>
            
            <SettingsField label="Cổng">
              <motion.input
                type="text"
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={dbPort}
                onChange={(e) => setDbPort(e.target.value)}
              />
            </SettingsField>

          <SettingsField label="Tên cơ sở dữ liệu">
              <motion.input
                type="text"
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={dbName}
                onChange={(e) => setDbName(e.target.value)}
              />
            </SettingsField>
          
          <SettingsField label="Tên người dùng">
              <motion.input
                type="text"
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={dbUsername}
                onChange={(e) => setDbUsername(e.target.value)}
              />
            </SettingsField>
            
            <SettingsField label="Mật khẩu">
              <motion.input
                type="password"
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={dbPassword}
                onChange={(e) => setDbPassword(e.target.value)}
              />
            </SettingsField>
          </SettingsGroup>

        <motion.div className="mt-4 border-t border-gray-200 pt-4">
          <Button 
            variant="outline" 
            className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100"
            onClick={() => console.log('Test DB connection')}
          >
            Kiểm tra kết nối
          </Button>
        </motion.div>
      </SettingsCard>

      <div className="mt-6">
        <SettingsCard 
          title="Sao lưu & Khôi phục" 
          icon={<RefreshCw className="w-5 h-5" />}
        >
          <SettingsGroup>
            <SettingsField label="Tần suất sao lưu">
              <motion.select 
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={backupFrequency}
                onChange={(e) => setBackupFrequency(e.target.value)}
              >
                <option value="daily">Hàng ngày</option>
                <option value="weekly">Hàng tuần</option>
                <option value="monthly">Hàng tháng</option>
              </motion.select>
            </SettingsField>
          </SettingsGroup>
          <motion.div className="mt-4 border-t border-gray-200 pt-4 flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1 bg-green-50 text-green-700 hover:bg-green-100"
              onClick={() => setModalType('backup')}
            >
              Sao lưu ngay
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
              onClick={() => console.log('Restore DB')}
            >
              Khôi phục từ bản sao lưu
            </Button>
          </motion.div>
        </SettingsCard>
      </div>
    </motion.div>
  );

  // Render Security Settings
  const renderSecuritySettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h2 
        className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"
      >
        <Shield className="w-5 h-5 text-primary" />
        Bảo mật
      </motion.h2>
      
        <SettingsCard 
        title="Cài đặt tài khoản" 
        icon={<User className="w-5 h-5" />}
        >
          <SettingsGroup>
            <SettingsToggle
            label="Bật xác thực hai yếu tố"
            description="Thêm một lớp bảo mật bổ sung cho tài khoản của bạn"
              checked={enableTwoFactor}
              onChange={setEnableTwoFactor}
            />
          <SettingsField label="Thời gian hết hạn mật khẩu (ngày)">
              <motion.input
                type="text"
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={passwordExpiration}
                onChange={(e) => setPasswordExpiration(e.target.value)}
              />
            </SettingsField>
          <SettingsField label="Thời gian chờ phiên quản trị (phút)">
              <motion.input
                type="text"
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={adminSessionTimeout}
                onChange={(e) => setAdminSessionTimeout(e.target.value)}
              />
            </SettingsField>
          </SettingsGroup>
        </SettingsCard>
        
      <div className="mt-6">
        <SettingsCard 
          title="Quản lý nhật ký" 
          icon={<Clock className="w-5 h-5" />}
        >
          <SettingsGroup>
            <SettingsField label="Kích thước nhật ký tối đa (MB)">
              <motion.input
                type="text"
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value="100"
                onChange={() => {}}
              />
            </SettingsField>
          </SettingsGroup>
          <motion.div className="mt-4 border-t border-gray-200 pt-4">
            <Button 
              variant="outline" 
              className="w-full bg-red-50 text-red-700 hover:bg-red-100"
              onClick={() => setModalType('clearLogs')}
            >
              Xóa tất cả nhật ký
            </Button>
          </motion.div>
        </SettingsCard>
      </div>
    </motion.div>
  );

  // Render Notifications Settings
  const renderNotificationsSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h2 
        className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"
      >
        <Bell className="w-5 h-5 text-primary" />
        Cài đặt thông báo
      </motion.h2>
      
      <SettingsCard 
        title="Cài đặt Email" 
        icon={<Mail className="w-5 h-5" />}
      >
        <SettingsGroup>
          <SettingsToggle
            label="Bật thông báo Email"
            description="Gửi thông báo quan trọng đến địa chỉ email được cấu hình"
            checked={emailNotifications}
            onChange={setEmailNotifications}
          />
          <SettingsField label="Địa chỉ Email nhận thông báo">
            <motion.input
              type="email"
              className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              value={alertEmailAddress}
              onChange={(e) => setAlertEmailAddress(e.target.value)}
            />
          </SettingsField>
        </SettingsGroup>
        <motion.div className="mt-4 border-t border-gray-200 pt-4">
          <Button 
            variant="outline" 
            className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100"
            onClick={() => setModalType('testEmail')}
          >
            Kiểm tra cài đặt Email
          </Button>
        </motion.div>
      </SettingsCard>

      <div className="mt-6">
        <SettingsCard 
          title="Cảnh báo hệ thống" 
          icon={<AlertTriangle className="w-5 h-5" />}
        >
          <SettingsGroup>
            <SettingsToggle
              label="Cảnh báo số dư thấp"
              description="Nhận thông báo khi số dư khách hàng sắp hết"
              checked={lowBalanceAlert}
              onChange={setLowBalanceAlert}
            />
            <SettingsToggle
              label="Cảnh báo hệ thống chung"
              description="Nhận thông báo về các vấn đề và cập nhật hệ thống"
              checked={systemAlerts}
              onChange={setSystemAlerts}
            />
          </SettingsGroup>
        </SettingsCard>
      </div>
    </motion.div>
  );

  // Render Category Management Settings
  const renderCategoryManagementSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h2 
        className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"
      >
        <ListTree className="w-5 h-5 text-primary" />
        Quản lý danh mục
      </motion.h2>

      <div className="mb-6">
        <Button onClick={() => setModalType('addCategory')} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Thêm danh mục mới
        </Button>
      </div>

      {categoriesLoading ? (
        <div className="text-center py-8 text-gray-500">Đang tải danh mục...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Chưa có danh mục nào.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="flex flex-col">
              <CardContent className="p-4 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <Badge className={getStatusColor(category.status)}>{getStatusText(category.status)}</Badge>
                </div>
                {category.description && (
                  <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                )}
                {category.image_url && (
                  <div className="mt-2 mb-2 w-24 h-24 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  <p>Thứ tự hiển thị: {category.display_order}</p>
                  <p>Tạo lúc: {new Date(category.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-50"
                    onClick={() => {
                      setEditingCategory(category);
                      setModalType('editCategory');
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Sửa
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => {
                      setDeletingCategory(category);
                      setModalType('deleteCategory');
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Xóa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      <Modal open={modalType === 'addCategory'} onClose={() => setModalType(null)} title="Thêm danh mục mới">
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label htmlFor="new-category-name" className="block text-sm font-medium text-gray-700">Tên danh mục <span className="text-red-500">*</span></label>
            <input
              id="new-category-name"
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="new-category-description" className="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea
              id="new-category-description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div>
            <label htmlFor="new-category-order" className="block text-sm font-medium text-gray-700">Thứ tự hiển thị</label>
            <input
              id="new-category-order"
              type="number"
              value={newCategory.display_order}
              onChange={(e) => setNewCategory({ ...newCategory, display_order: Number(e.target.value) })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="new-category-image" className="block text-sm font-medium text-gray-700">Hình ảnh</label>
            <input
              id="new-category-image"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, true)}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {newCategory.image_url && (
              <div className="mt-2 relative w-16 h-16 mb-4">
                <img src={newCategory.image_url} alt="Preview" className="w-full h-full object-cover rounded-md" />
                <button 
                  type="button" 
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  onClick={() => setNewCategory({...newCategory, image_url: ""})}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="new-category-status" className="block text-sm font-medium text-gray-700">Trạng thái</label>
            <select
              id="new-category-status"
              value={newCategory.status}
              onChange={(e) => setNewCategory({ ...newCategory, status: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setModalType(null)}>Hủy</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Thêm danh mục</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Category Modal */}
      {editingCategory && (
        <Modal open={modalType === 'editCategory'} onClose={() => setModalType(null)} title={`Chỉnh sửa: ${editingCategory.name}`}>
          <form onSubmit={handleEditCategory} className="space-y-4">
            <div>
              <label htmlFor="edit-category-name" className="block text-sm font-medium text-gray-700">Tên danh mục <span className="text-red-500">*</span></label>
              <input
                id="edit-category-name"
                type="text"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="edit-category-description" className="block text-sm font-medium text-gray-700">Mô tả</label>
              <textarea
                id="edit-category-description"
                value={editingCategory.description || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <div>
              <label htmlFor="edit-category-order" className="block text-sm font-medium text-gray-700">Thứ tự hiển thị</label>
              <input
                id="edit-category-order"
                type="number"
                value={editingCategory.display_order}
                onChange={(e) => setEditingCategory({ ...editingCategory, display_order: Number(e.target.value) })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="edit-category-image" className="block text-sm font-medium text-gray-700">Hình ảnh</label>
              <input
                id="edit-category-image"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, false)}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {editingCategory.image_url && (
                <div className="mt-2 relative w-16 h-16 mb-4">
                  <img src={editingCategory.image_url} alt="Preview" className="w-full h-full object-cover rounded-md" />
                  <button 
                    type="button" 
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    onClick={() => setEditingCategory({...editingCategory, image_url: ""})}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="edit-category-status" className="block text-sm font-medium text-gray-700">Trạng thái</label>
              <select
                id="edit-category-status"
                value={editingCategory.status}
                onChange={(e) => setEditingCategory({ ...editingCategory, status: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setModalType(null)}>Hủy</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Lưu thay đổi</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Category Confirmation Modal */}
      {deletingCategory && (
        <Modal open={modalType === 'deleteCategory'} onClose={() => setModalType(null)} title="Xác nhận xóa danh mục">
          <div className="text-center space-y-4">
            <Trash2 className="w-16 h-16 text-red-500 mx-auto" />
            <p className="text-lg text-gray-700">
              Bạn có chắc chắn muốn xóa danh mục <span className="font-bold">{deletingCategory.name}</span> không?
            </p>
            <p className="text-sm text-gray-500">Thao tác này không thể hoàn tác và có thể ảnh hưởng đến các mặt hàng thuộc danh mục này.</p>
            <div className="flex justify-center space-x-4 mt-6">
              <Button type="button" variant="outline" onClick={() => setModalType(null)}>Hủy</Button>
              <Button type="button" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteCategory}>Xóa</Button>
            </div>
      </div>
        </Modal>
      )}

    </motion.div>
  );

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'database':
        return renderDatabaseSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationsSettings();
      case 'categories':
        return renderCategoryManagementSettings();
      default:
        return null;
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cài đặt hệ thống</h1>
          <p className="text-gray-600">Quản lý cấu hình và tùy chọn ứng dụng</p>
        </div>
        <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="w-4 h-4 mr-2" />
          Lưu cài đặt
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex border-b border-gray-200"
      >
        <button 
          className={`py-3 px-6 text-sm font-medium ${activeTab === 'general' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            onClick={() => setActiveTab('general')}
        >
          <SettingsIcon className="inline-block w-4 h-4 mr-2" /> Chung
        </button>
        <button 
          className={`py-3 px-6 text-sm font-medium ${activeTab === 'database' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            onClick={() => setActiveTab('database')}
        >
          <Database className="inline-block w-4 h-4 mr-2" /> Cơ sở dữ liệu
        </button>
        <button 
          className={`py-3 px-6 text-sm font-medium ${activeTab === 'security' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            onClick={() => setActiveTab('security')}
        >
          <Shield className="inline-block w-4 h-4 mr-2" /> Bảo mật
        </button>
        <button 
          className={`py-3 px-6 text-sm font-medium ${activeTab === 'notifications' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            onClick={() => setActiveTab('notifications')}
        >
          <Bell className="inline-block w-4 h-4 mr-2" /> Thông báo
        </button>
        <button 
          className={`py-3 px-6 text-sm font-medium ${activeTab === 'categories' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
          onClick={() => setActiveTab('categories')}
        >
          <ListTree className="inline-block w-4 h-4 mr-2" /> Danh mục
        </button>
      </motion.div>
      
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>

      {/* Save Settings Confirmation Modal */}
      <Modal open={modalType === 'save'} onClose={() => setModalType(null)} title="Lưu cài đặt">
        <div className="text-center space-y-4">
          <Save className="w-16 h-16 text-blue-500 mx-auto" />
          <p className="text-lg text-gray-700">Bạn có chắc chắn muốn lưu các thay đổi này không?</p>
          <div className="flex justify-center space-x-4 mt-6">
            <Button type="button" variant="outline" onClick={() => setModalType(null)}>Hủy</Button>
            <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={confirmSaveSettings}>Lưu</Button>
            </div>
            </div>
      </Modal>

      {/* Backup Database Modal */}
      <Modal open={modalType === 'backup'} onClose={() => setModalType(null)} title="Sao lưu cơ sở dữ liệu">
        <div className="text-center space-y-4">
          <Database className="w-16 h-16 text-primary-500 mx-auto" />
          <p className="text-lg text-gray-700">Bạn có muốn sao lưu cơ sở dữ liệu ngay bây giờ không?</p>
          <p className="text-sm text-muted-foreground">Thao tác này sẽ tạo một bản sao lưu hiện tại của cơ sở dữ liệu.</p>
          <div className="flex justify-center space-x-4 mt-6">
            <Button type="button" variant="outline" onClick={() => setModalType(null)}>Hủy</Button>
            <Button type="button" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => {
              setActionStatus('Đang sao lưu...');
              ipcRenderer.invoke('database:backup').then((result: { success: boolean, error?: string }) => {
                if (result.success) {
                  setActionStatus('Sao lưu thành công!');
                  setNotification({ type: 'success', message: 'Cơ sở dữ liệu đã được sao lưu thành công!' });
                } else {
                  setActionStatus('Sao lưu thất bại.');
                  setNotification({ type: 'error', message: `Sao lưu thất bại: ${result.error}` });
                }
                setModalType(null);
              });
            }}>Sao lưu ngay</Button>
            </div>
            </div>
      </Modal>

      {/* Clear All Logs Modal */}
      <Modal open={modalType === 'clearLogs'} onClose={() => setModalType(null)} title="Xóa tất cả nhật ký">
        <div className="text-center space-y-4">
          <Trash2 className="w-16 h-16 text-red-500 mx-auto" />
          <p className="text-lg text-gray-700">Bạn có chắc chắn muốn xóa tất cả các nhật ký không?</p>
          <p className="text-sm text-muted-foreground">Thao tác này không thể hoàn tác.</p>
          <div className="flex justify-center space-x-4 mt-6">
            <Button type="button" variant="outline" onClick={() => setModalType(null)}>Hủy</Button>
            <Button type="button" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => {
              setActionStatus('Đang xóa nhật ký...');
              ipcRenderer.invoke('logs:clearAll').then((result: { success: boolean, error?: string }) => {
                if (result.success) {
                  setActionStatus('Xóa nhật ký thành công!');
                  setNotification({ type: 'success', message: 'Tất cả nhật ký đã được xóa thành công!' });
                } else {
                  setActionStatus('Xóa nhật ký thất bại.');
                  setNotification({ type: 'error', message: `Xóa nhật ký thất bại: ${result.error}` });
                }
                setModalType(null);
              });
            }}>Xóa tất cả</Button>
          </div>
        </div>
      </Modal>
      
      {/* Test Email Modal */}
      <Modal open={modalType === 'testEmail'} onClose={() => setModalType(null)} title="Kiểm tra cài đặt Email">
        <div className="text-center space-y-4">
          <Mail className="w-16 h-16 text-blue-500 mx-auto" />
          <p className="text-lg text-gray-700">Gửi email kiểm tra đến <span className="font-bold">{alertEmailAddress}</span>?</p>
          <p className="text-sm text-muted-foreground">Điều này sẽ xác minh cài đặt máy chủ email của bạn.</p>
          <div className="flex justify-center space-x-4 mt-6">
            <Button type="button" variant="outline" onClick={() => setModalType(null)}>Hủy</Button>
            <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => {
              setActionStatus('Đang gửi email...');
              // Simulate sending email
              setTimeout(() => {
                setActionStatus('Email kiểm tra đã gửi!');
                setNotification({ type: 'success', message: 'Email kiểm tra đã được gửi thành công!' });
                setModalType(null);
              }, 1500);
            }}>Gửi kiểm tra</Button>
          </div>
        </div>
      </Modal>

      {actionStatus && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-md shadow-lg flex items-center space-x-2 text-sm text-gray-700">
          {actionStatus.includes('thành công') ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : actionStatus.includes('thất bại') ? (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          ) : (
            <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          )}
          <span>{actionStatus}</span>
        </div>
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

export default Settings;