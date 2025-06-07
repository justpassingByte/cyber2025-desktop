import * as socketIO from 'socket.io-client';
import { ipcMain } from 'electron';

let socket: socketIO.Socket | null = null;
let isSocketConnected = false;

export function setupSocketClient(mainWindow: Electron.BrowserWindow | null) {
  try {
    socket = socketIO.connect('http://localhost:3000', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true
    });

    socket.on('connect', () => {
      console.log('Socket connected to server:', socket?.id);
      isSocketConnected = true;
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('socket:status', true);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected from server');
      isSocketConnected = false;
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('socket:status', false);
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      isSocketConnected = false;
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      isSocketConnected = false;
    });

    // Không lắng nghe notification ở đây nữa
  } catch (error) {
    console.error('Setup socket client error:', error);
  }
}

export function getSocket() {
  return socket;
}

export function isConnected() {
  return isSocketConnected;
}

// Đăng ký userId với server để nhận notification
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