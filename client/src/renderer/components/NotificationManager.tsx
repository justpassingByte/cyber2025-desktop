import React, { useEffect, useState } from 'react';
import TopUpNotification from './TopUpNotification';
import type { TopUpNotificationData } from '../../main/types/noti';
import { useUserStore } from '../context/UserContext';

console.log('[NotificationManager] Component file loaded');

interface NotificationWithId extends TopUpNotificationData {
  id: string; // Đảm bảo id luôn có giá trị
}

interface NotificationManagerProps {
  onBalanceUpdate?: (amount: number) => void;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ 
  onBalanceUpdate
}) => {
  const [notifications, setNotifications] = useState<NotificationWithId[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [debugMessage, setDebugMessage] = useState<string>('Waiting for login...');
  const [showDebug, setShowDebug] = useState(true);
  
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  // Lấy ipcRenderer
  const ipcRenderer = window.require ? window.require('electron').ipcRenderer : undefined;

  useEffect(() => {
    console.log('[NotificationManager] useEffect mount, ipcRenderer =', ipcRenderer);
    if (!ipcRenderer) {
      console.error('[NotificationManager] ipcRenderer is undefined!');
      return;
    }
      
    // Lắng nghe sự kiện topup:completed từ main process
    const handleTopupCompleted = (_event: any, data: TopUpNotificationData) => {
      console.log('[NotificationManager] Renderer received topup:completed:', data);
      setDebugMessage(`Received topup for: ${data.transaction?.username}, amount: ${data.transaction?.amount}`);
      if (user && data.transaction) {
        const newBalance = (user.balance || 0) + data.transaction.amount;
        updateUser({ balance: newBalance });
        console.log(`[NotificationManager] Updating user balance from ${user.balance} to ${newBalance}`);
      const notificationWithId: NotificationWithId = {
        ...data,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      };
      setNotifications(prev => [...prev, notificationWithId]);
        if (typeof onBalanceUpdate === 'function' && data.transaction.amount) {
        onBalanceUpdate(data.transaction.amount);
        }
      } else {
        console.log('[NotificationManager] Ignored topup notification - no user logged in or missing transaction');
      }
    };
    ipcRenderer.on('topup:completed', handleTopupCompleted);

    // Lắng nghe trạng thái kết nối socket từ main process
    const handleSocketStatus = (_event: any, connected: boolean) => {
      setIsConnected(connected);
      setDebugMessage(connected ? 'Connected to server' : 'Disconnected from server');
      console.log('[NotificationManager] Socket status:', connected);
    };
    ipcRenderer.on('socket:status', handleSocketStatus);
    
    ipcRenderer.invoke('socket:check-connection').then((connected: boolean) => {
      setIsConnected(connected);
      setDebugMessage(connected ? 'Connected to server' : 'Disconnected from server');
      console.log('[NotificationManager] Initial socket status:', connected);
    });
    
    return () => {
      ipcRenderer.removeListener('topup:completed', handleTopupCompleted);
      ipcRenderer.removeListener('socket:status', handleSocketStatus);
    };
  }, [user, updateUser, onBalanceUpdate]);

  // Function for adding test notification - can be called from external components
  const addTestNotification = () => {
    if (!user) {
      setDebugMessage('Cannot add test notification: No user logged in');
      return;
    }

    const testNotification: NotificationWithId = {
      id: `test-${Date.now()}`,
      transaction: {
        _id: `test-tx-${Date.now()}`,
        username: user.username,
        amount: 50000,
        description: 'Test notification added manually'
      },
      notification: 'Test notification'
    };
    
    // Update user balance in store
    const newBalance = (user.balance || 0) + testNotification.transaction.amount;
    updateUser({ balance: newBalance });
    console.log(`[NotificationManager] Updating user balance from ${user.balance} to ${newBalance}`);
    
    setNotifications(prev => [...prev, testNotification]);
    
    if (onBalanceUpdate) {
      onBalanceUpdate(testNotification.transaction.amount);
    }
    setDebugMessage(`Added test notification at ${new Date().toLocaleTimeString()}`);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Nút test IPC thủ công
  const handleTestIPC = () => {
    if (!ipcRenderer) {
      alert('ipcRenderer is undefined!');
      return;
    }
    const testData: TopUpNotificationData = {
      transaction: {
        _id: `test-${Date.now()}`,
        username: user?.username || 'testuser',
        amount: 10000,
        description: 'Test notification from renderer'
      },
      notification: 'Test notification from renderer'
    };
    // Gửi event IPC tới chính renderer (giả lập main process gửi)
    ipcRenderer.emit('topup:completed', {}, testData);
    console.log('[NotificationManager] Đã gửi test IPC topup:completed:', testData);
  };

  return (
    <>
    
      {showDebug && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
          <div className="text-xs text-gray-500 bg-white/80 p-2 rounded shadow flex flex-col items-end">
            <div>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'} - Notifications: {notifications.length}
              <br />
            Status: {debugMessage}
            </div>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow transition-colors duration-200 flex items-center space-x-1"
              onClick={handleTestIPC}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Test TopUp</span>
            </button>
          </div>
        </div>
      )}
      {notifications.map((notification) => {
        console.log('[NotificationManager] Render notification:', notification);
        return (
        <TopUpNotification
          key={notification.id}
          username={notification.transaction.username}
          amount={notification.transaction.amount}
          message={notification.transaction.description}
          onClose={() => removeNotification(notification.id)}
          autoClose={true}
          autoCloseTime={5000}
          isAdminView={false}
        />
        );
      })}
    </>
  );
};

export default NotificationManager; 