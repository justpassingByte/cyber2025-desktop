import * as socketIO from 'socket.io-client';

let socket: socketIO.Socket | null = null;
// let isSocketConnected = false; // This flag is no longer needed with the promise-based approach for requests

// Danh sách các callback để xử lý sự kiện food:receive-all (still used for direct socket events, if any)
const foodDataCallbacks: ((data: any) => void)[] = [];

interface FoodItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string; // Changed to image_url to match backend
  status: string;
  category?: {
    name: string;
  };
  rating?: number; // Assuming backend will provide this
  prepTime?: string; // Assuming backend will provide this
  popular?: boolean; // Assuming backend will provide this
}

export function setupSocketClient(mainWindow: Electron.BrowserWindow | null) {
  try {
    console.log('[Socket] Attempting initial Socket.IO connection...');
    socket = socketIO.connect('http://localhost:3000', {
      reconnection: true, // Enable built-in reconnection
      reconnectionAttempts: Infinity, // Unlimited reconnection attempts
      reconnectionDelay: 1000, // Start with 1 second delay
      reconnectionDelayMax: 60000, // Max delay of 60 seconds
      autoConnect: true, // Automatically connect on setup
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Socket connected to server:', socket?.id);
      // No longer sending socket:status via IPC for general connection status.
      // Individual IPC calls will handle their own socket checks.
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected from server, reason:', reason);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error (connect_error event):', error);
    });

    // The food:receive-all listener is now handled by the requestFoodData promise.
    // Keep this for any other passive food updates, but main fetching is via promise.
    socket.on('food:receive-all', (data: any) => {
      console.log('[socket.ts] Received food:receive-all from server (passive listener):', data);
      foodDataCallbacks.forEach(callback => callback(data));
    });

  } catch (error) {
    console.error('Setup socket client error:', error);
  }
}

export function getSocket() {
  return socket;
}

// No longer directly used as a status flag, but keep for ipcMain.handle('socket:check-connection')
export function isConnected() {
  return socket ? socket.connected : false;
}

// Gửi yêu cầu lấy tất cả food data từ server qua socket và trả về Promise
export function requestFoodData(): Promise<FoodItem[]> {
  return new Promise((resolve, reject) => {
    if (socket && socket.connected) {
      console.log('[Client Socket] Emitting food:request-all to server and awaiting response...');

      const timeout = setTimeout(() => {
        socket?.off('food:receive-all', handleReceiveAll);
        reject(new Error('Timeout waiting for food:receive-all response.'));
      }, 10000); // 10 second timeout

      const handleReceiveAll = (data: { success: boolean; foods?: FoodItem[]; error?: string }) => {
        clearTimeout(timeout);
        socket?.off('food:receive-all', handleReceiveAll); // Remove listener after response
        if (data.success && data.foods) {
          console.log('[Client Socket] Received food:receive-all response.', data.foods.length, 'items.');
          resolve(data.foods);
        } else {
          console.error('[Client Socket] Failed to receive food data:', data.error);
          reject(new Error(data.error || 'Unknown error receiving food data.'));
        }
      };

      socket.once('food:receive-all', handleReceiveAll); // Listen for a single response
      socket.emit('food:request-all');
    } else {
      const errorMessage = '[Client Socket] Socket not connected, cannot request food data.';
      console.warn(errorMessage);
      reject(new Error(errorMessage));
    }
  });
}

// Đăng ký callback để nhận food data (nếu có các sự kiện push khác ngoài yêu cầu ban đầu)
export function onFoodDataReceived(callback: (data: any) => void) {
  foodDataCallbacks.push(callback);
}

// Hủy đăng ký callback
export function offFoodDataReceived(callback: (data: any) => void) {
  const index = foodDataCallbacks.indexOf(callback);
  if (index > -1) {
    foodDataCallbacks.splice(index, 1);
  }
}

// Đăng ký userId với server để nhận notification
/*
ipcMain.handle('socket:register-user', async (_event, userId: number) => {
  try {
    if (!socket || !socket.connected) {
      return false;
    }
    socket.emit('customer:link', userId);
    console.log('[socket.ts] Đã gửi customer:link lên server với userId:', userId);
    return true;
  } catch (error) {
    console.error('Error registering user via IPC:', error);
    return false;
  }
});
*/ 