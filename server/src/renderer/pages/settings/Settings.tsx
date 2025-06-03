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
  Mail
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
    </motion.div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1 
          className="text-2xl font-bold text-foreground"
        >
          Cài đặt hệ thống
        </motion.h1>
        <motion.button 
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? (
            <motion.div 
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Lưu cài đặt</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <motion.div 
          className="bg-white border border-border rounded-lg overflow-hidden p-1"
        >
          <nav className="space-y-1">
            <motion.button 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'general' 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-muted-foreground hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('general')}
            >
              <SettingsIcon className="w-5 h-5" />
              <span>Cài đặt chung</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </motion.button>
            
            <motion.button 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'database' 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-muted-foreground hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('database')}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <Database className="w-5 h-5" />
              <span>Cơ sở dữ liệu</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </motion.button>
            
            <motion.button 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'security' 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-muted-foreground hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('security')}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <Shield className="w-5 h-5" />
              <span>Bảo mật</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </motion.button>
            
            <motion.button 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'notifications' 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-muted-foreground hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('notifications')}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <Bell className="w-5 h-5" />
              <span>Thông báo</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </motion.button>
          </nav>
          
          <Card className="mt-6 mx-2 mb-2">
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

        {/* Settings Content */}
            <motion.div
          className="md:col-span-3 bg-white border border-border rounded-lg overflow-hidden p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'general' && renderGeneralSettings()}
            {/* Other tabs will be rendered here with their own components */}
          </AnimatePresence>
          
          {/* Status message */}
          <AnimatePresence>
            {actionStatus && (
            <motion.div
                className="mt-6 p-4 bg-green-500/10 text-green-500 rounded-lg text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {actionStatus}
            </motion.div>
          )}
          </AnimatePresence>
            </motion.div>
      </div>
      
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
    </div>
  );
};

export default Settings;