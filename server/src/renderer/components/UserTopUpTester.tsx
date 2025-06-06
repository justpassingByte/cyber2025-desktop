import React, { useState, useEffect } from 'react';
import TopUpTester from './TopUpTester';
import TopUpNotification from './TopUpNotification';

interface TopUpEvent {
  transaction: {
    _id: string;
    username: string;
    amount: number;
    description?: string;
  };
  notification: string;
}

const UserTopUpTester: React.FC = () => {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [debugMode, setDebugMode] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Get ipcRenderer
  const ipcRenderer = window.require ? window.require('electron').ipcRenderer : undefined;

  useEffect(() => {
    if (!loggedIn) return;

    // Using IPC for socket connection instead of direct socket.io connection
    const checkSocketConnection = async () => {
      try {
        const connected = await ipcRenderer?.invoke('socket:check-connection');
        setIsConnected(connected);
        setLastMessage(connected ? 'Connected to server via IPC' : 'Not connected to server');
      } catch (error) {
        console.error('Error checking socket connection:', error);
        setIsConnected(false);
        setLastMessage('Error checking socket connection status');
      }
    };

    // Check connection status initially
    checkSocketConnection();

    // Set up IPC listeners for topup events
    const handleTopupEvent = (_event: any, data: TopUpEvent) => {
      console.log('Received topup notification via IPC:', data);
      setLastMessage(`Received topup notification for: ${data.transaction.username}`);
      
      // Add unique id for managing notifications
      const notificationWithId = {
        ...data,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      };
      
      setNotifications(prev => [...prev, notificationWithId]);
    };

    // Register for topup notifications
    ipcRenderer?.on('topup:completed', handleTopupEvent);
    ipcRenderer?.on('socket:status', (_event: any, connected: boolean) => {
      setIsConnected(connected);
      setLastMessage(connected ? 'Socket connected' : 'Socket disconnected');
    });

    // Register user with main process
    const registerUser = async () => {
      try {
        const success = await ipcRenderer?.invoke('socket:register-user', username);
        if (success) {
          setLastMessage(`User ${username} registered with server via IPC`);
        } else {
          setLastMessage('Failed to register user with server');
        }
      } catch (error) {
        console.error('Error registering user:', error);
        setLastMessage('Error registering user with server');
      }
    };

    registerUser();

    return () => {
      // Clean up IPC listeners
      ipcRenderer?.removeListener('topup:completed', handleTopupEvent);
      ipcRenderer?.removeListener('socket:status', () => {});
    };
  }, [loggedIn, username, ipcRenderer]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setNotifications([]);
    setLastMessage(null);
    setIsConnected(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {!loggedIn ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Đăng nhập để kiểm tra</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Tên người dùng
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nhập tên người dùng"
                required
              />
              <div className="mt-1">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={debugMode}
                    onChange={() => setDebugMode(!debugMode)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-600">Chế độ debug</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <span className="font-medium">Đã đăng nhập với tên:</span>{' '}
              <span className="font-bold text-blue-600">{username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
            >
              Đăng xuất
            </button>
          </div>
          
          {lastMessage && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-md text-sm text-blue-700">
              {lastMessage}
            </div>
          )}
          
          <div className="bg-gray-50 border border-gray-200 p-3 rounded-md text-sm">
            Socket status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
          
          {/* Display notifications */}
          {notifications.map((notification) => (
            <TopUpNotification
              key={notification.id}
              username={notification.transaction.username}
              amount={notification.transaction.amount}
              message={notification.transaction.description}
              onClose={() => removeNotification(notification.id)}
              autoClose={true}
              autoCloseTime={8000}
            />
          ))}
          
        </div>
      )}
    </div>
  );
};

export default UserTopUpTester; 