import React, { useState } from 'react';
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
  CheckCircle
} from 'lucide-react';
import Modal from '../../components/Modal';
import { useTheme } from '../../components/ThemeProvider';
import { Card, CardHeader, CardTitle, CardContent, SettingsCard, SettingsGroup, SettingsField, SettingsToggle } from '../../components/ui';

// Import electron IPC renderer
const { ipcRenderer } = window.require('electron');

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'database' | 'security' | 'notifications'>('general');
  const [saving, setSaving] = useState<boolean>(false);
  const [modalType, setModalType] = useState<null | 'save' | 'backup' | 'clearLogs' | 'testEmail'>(null);
  const [actionStatus, setActionStatus] = useState<string>('');
  
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
        <Database className="w-5 h-5 text-blue-600" />
        Cơ sở dữ liệu
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <SettingsField label="Tên database">
              <motion.input
                type="text"
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={dbName}
                onChange={(e) => setDbName(e.target.value)}
              />
            </SettingsField>
          </SettingsGroup>
        </SettingsCard>
        
        <SettingsCard 
          title="Xác thực" 
          icon={<Key className="w-5 h-5" />}
        >
          <SettingsGroup>
            <SettingsField label="Tên đăng nhập">
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

          <motion.div className="mt-4 flex justify-center">
            <motion.button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4" />
              Kiểm tra kết nối
            </motion.button>
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
        <Shield className="w-5 h-5 text-red-600" />
        Bảo mật
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingsCard 
          title="Xác thực" 
          icon={<Shield className="w-5 h-5" />}
        >
          <SettingsGroup>
            <SettingsToggle
              label="Xác thực hai lớp"
              description="Yêu cầu xác thực bổ sung khi đăng nhập"
              checked={enableTwoFactor}
              onChange={setEnableTwoFactor}
            />
            
            <SettingsField label="Thời hạn mật khẩu (ngày)">
              <motion.input
                type="text"
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={passwordExpiration}
                onChange={(e) => setPasswordExpiration(e.target.value)}
              />
            </SettingsField>

            <SettingsField label="Thời gian phiên quản trị (phút)">
              <motion.input
                type="text"
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={adminSessionTimeout}
                onChange={(e) => setAdminSessionTimeout(e.target.value)}
              />
            </SettingsField>
          </SettingsGroup>
        </SettingsCard>
        
        <SettingsCard 
          title="Sao lưu dữ liệu" 
          icon={<Database className="w-5 h-5" />}
        >
          <SettingsGroup>
            <SettingsField label="Tần suất sao lưu">
              <motion.select 
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={backupFrequency}
                onChange={(e) => setBackupFrequency(e.target.value)}
              >
                <option value="hourly">Hàng giờ</option>
                <option value="daily">Hàng ngày</option>
                <option value="weekly">Hàng tuần</option>
                <option value="monthly">Hàng tháng</option>
              </motion.select>
            </SettingsField>
          </SettingsGroup>

          <motion.div className="space-y-3 mt-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Mã hóa cơ sở dữ liệu</p>
                <p className="text-sm text-gray-500">Bảo vệ dữ liệu nhạy cảm</p>
              </div>
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                <span className="text-xs">Đã bật</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Ghi nhật ký hoạt động</p>
                <p className="text-sm text-gray-500">Theo dõi các thao tác quản trị</p>
              </div>
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                <span className="text-xs">Đã bật</span>
              </div>
            </div>
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
        <Bell className="w-5 h-5 text-yellow-600" />
        Thông báo
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingsCard 
          title="Tùy chọn thông báo" 
          icon={<Bell className="w-5 h-5" />}
        >
          <SettingsGroup>
            <SettingsToggle
              label="Thông báo qua email"
              description="Gửi thông báo qua địa chỉ email"
              checked={emailNotifications}
              onChange={setEmailNotifications}
            />
            
            <SettingsToggle
              label="Cảnh báo số dư thấp"
              description="Thông báo khi tài khoản khách hàng còn ít tiền"
              checked={lowBalanceAlert}
              onChange={setLowBalanceAlert}
            />

            <SettingsToggle
              label="Cảnh báo hệ thống"
              description="Thông báo khi có sự cố hệ thống"
              checked={systemAlerts}
              onChange={setSystemAlerts}
            />
          </SettingsGroup>
        </SettingsCard>
        
        <SettingsCard 
          title="Cấu hình email" 
          icon={<Mail className="w-5 h-5" />}
        >
          <SettingsGroup>
            <SettingsField label="Địa chỉ email cảnh báo">
              <motion.input
                type="text"
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={alertEmailAddress}
                onChange={(e) => setAlertEmailAddress(e.target.value)}
              />
            </SettingsField>
          </SettingsGroup>

          <motion.div className="mt-4 flex justify-center">
            <motion.button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setModalType('testEmail')}
            >
              <Mail className="w-4 h-4" />
              Kiểm tra email
            </motion.button>
          </motion.div>
        </SettingsCard>
      </div>
    </motion.div>
  );
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1 
          className="text-2xl font-bold text-foreground"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Cài đặt hệ thống
        </motion.h1>
        <motion.button 
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSaveSettings}
          disabled={saving}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          <span>Lưu cài đặt</span>
        </motion.button>
      </div>

      <motion.div 
        className="bg-white border border-border rounded-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Tabs Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-gray-100 p-1">
          <motion.button 
            className={`flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-center transition-colors ${
              activeTab === 'general' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-muted-foreground hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('general')}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Chung</span>
          </motion.button>
          
          <motion.button 
            className={`flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-center transition-colors ${
              activeTab === 'database' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-muted-foreground hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('database')}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Database className="w-4 h-4" />
            <span>Dữ liệu</span>
          </motion.button>
          
          <motion.button 
            className={`flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-center transition-colors ${
              activeTab === 'security' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-muted-foreground hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('security')}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Shield className="w-4 h-4" />
            <span>Bảo mật</span>
          </motion.button>
          
          <motion.button 
            className={`flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-center transition-colors ${
              activeTab === 'notifications' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-muted-foreground hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('notifications')}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Bell className="w-4 h-4" />
            <span>Thông báo</span>
          </motion.button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'database' && renderDatabaseSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'notifications' && renderNotificationsSettings()}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Status message */}
      <AnimatePresence>
        {actionStatus && (
          <motion.div
            className="p-4 bg-green-500/10 text-green-500 rounded-lg text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {actionStatus}
          </motion.div>
        )}
      </AnimatePresence>

      {/* System Info Card */}
      <motion.div 
        className="bg-white border border-border rounded-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              Thông tin hệ thống
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phiên bản</span>
              <span className="text-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Node.js</span>
              <span className="text-foreground">18.17.1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Electron</span>
              <span className="text-foreground">25.8.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Thời gian hoạt động</span>
              <span className="text-foreground">2h 35m</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Modal for confirmation */}
      <Modal
        open={modalType === 'save'}
        title="Xác nhận lưu cài đặt"
        onClose={() => setModalType(null)}
      >
        <div className="space-y-4">
          <p className="text-foreground">Bạn có chắc chắn muốn lưu các thay đổi cài đặt không?</p>
          <div className="flex justify-end gap-3">
            <motion.button 
              className="px-4 py-2 bg-white border border-border text-foreground rounded-md"
              onClick={() => setModalType(null)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Hủy
            </motion.button>
            <motion.button 
              className="px-4 py-2 bg-primary text-white rounded-md"
              onClick={confirmSaveSettings}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Xác nhận
            </motion.button>
          </div>
        </div>
      </Modal>
      
      {/* Test Email Modal */}
      <Modal
        open={modalType === 'testEmail'}
        title="Kiểm tra email thông báo"
        onClose={() => setModalType(null)}
      >
        <div className="space-y-4">
          <p className="text-foreground">Gửi email kiểm tra đến {alertEmailAddress}?</p>
          <div className="flex justify-end gap-3">
            <motion.button 
              className="px-4 py-2 bg-white border border-border text-foreground rounded-md"
              onClick={() => setModalType(null)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Hủy
            </motion.button>
            <motion.button 
              className="px-4 py-2 bg-primary text-white rounded-md"
              onClick={() => {
                setModalType(null);
                setActionStatus('Đã gửi email kiểm tra thành công!');
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Gửi email
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;