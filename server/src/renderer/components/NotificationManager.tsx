import React, { useEffect, useState } from 'react';
import TopUpNotification from './TopUpNotification';
import LoginNotification from './LoginNotification';

interface TopUpEvent {
  id: string;
  transaction: {
    _id: string;
    username: string;
    amount: number;
    description?: string;
  };
  notification: string;
}

interface LoginEvent {
  id: string;
  customer: {
    id: number;
    name: string;
    email?: string;
  };
  timestamp: number;
}

interface Notification {
  id: string;
  type: 'topup' | 'login';
  data: any;
}

interface NotificationManagerProps {
  username?: string; // Optional prop for username
  isAdmin?: boolean; // Optional prop to indicate if the user is admin
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ 
  username = 'guest', // Default username if none provided
  isAdmin = false // Default to regular user
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Get ipcRenderer
  const ipcRenderer = window.require ? window.require('electron').ipcRenderer : undefined;

  useEffect(() => {
    if (!ipcRenderer) {
      console.error('IPC Renderer not available');
      return;
    }

    // Check socket connection status
    const checkSocketConnection = async () => {
      try {
        const connected = await ipcRenderer.invoke('socket:check-connection');
        setIsConnected(connected);
      } catch (error) {
        console.error('Error checking socket status:', error);
        setIsConnected(false);
      }
    };
    
    checkSocketConnection();
      
    // Register with main process
    const registerWithMainProcess = async () => {
      try {
        // Register the user via IPC
        await ipcRenderer.invoke('socket:register-user', username);
        console.log(`Registered user ${username} with main process`);
        
        // If admin, register for admin events
      if (isAdmin) {
          await ipcRenderer.invoke('auth:register-admin', { secretKey: 'admin123' });
          console.log('Registered as admin with main process');
        }
      } catch (error) {
        console.error('Error registering with main process:', error);
      }
    };
    
    registerWithMainProcess();

    // Handle topup notifications
    const handleTopupNotification = (_event: any, data: any) => {
      console.log('Received topup notification via IPC:', data);
      
      // Add to notifications with type
      const notificationWithId = {
        id: `topup-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: 'topup' as const,
        data: data
      };
      
      setNotifications(prev => [...prev, notificationWithId]);
    };

    // Handle login notifications (admin only)
    const handleLoginNotification = (_event: any, data: any) => {
      if (!isAdmin) return;
      
      console.log('Received customer login notification:', data);
        
        const loginEvent: LoginEvent = {
          id: `login-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          customer: data.customer,
          timestamp: Date.now()
        };
        
        const notification = {
          id: loginEvent.id,
          type: 'login' as const,
          data: loginEvent
        };
        
        setNotifications(prev => [...prev, notification]);
    };

    // Register for socket status changes
    ipcRenderer.on('socket:status', (_event: any, connected: boolean) => {
      setIsConnected(connected);
    });
        
    // Register for notifications
    ipcRenderer.on('topup:completed', handleTopupNotification);
    ipcRenderer.on('admin:customer-login', handleLoginNotification);
    if (isAdmin) {
      ipcRenderer.on('admin:topup-notification', handleTopupNotification);
    }

    // Cleanup event listeners
    return () => {
      ipcRenderer.removeListener('socket:status', () => {});
      ipcRenderer.removeListener('topup:completed', handleTopupNotification);
      ipcRenderer.removeListener('admin:customer-login', handleLoginNotification);
      if (isAdmin) {
        ipcRenderer.removeListener('admin:topup-notification', handleTopupNotification);
      }
    };
  }, [ipcRenderer, username, isAdmin]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <>
      {notifications.map((notification) => {
        // Render based on notification type
        if (notification.type === 'topup') {
          const topupData = notification.data;
          return (
            <TopUpNotification
              key={notification.id}
              username={topupData.transaction.username}
              amount={topupData.transaction.amount}
              message={topupData.transaction.description}
              onClose={() => removeNotification(notification.id)}
              autoClose={true}
              autoCloseTime={5000}
              isAdminView={topupData.isAdminNotification}
            />
          );
        } else if (notification.type === 'login' && isAdmin) {
          const loginData = notification.data;
          return (
            <LoginNotification
              key={notification.id}
              customer={loginData.customer}
              timestamp={loginData.timestamp}
              onClose={() => removeNotification(notification.id)}
              autoClose={true}
              autoCloseTime={5000}
            />
          );
        }
        return null;
      })}
    </>
  );
};

export default NotificationManager; 