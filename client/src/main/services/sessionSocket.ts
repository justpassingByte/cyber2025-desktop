import { getSocket } from './socket';
import { ipcMain, BrowserWindow } from 'electron';

export function setupSessionSocketHandlers(mainWindow: BrowserWindow | null) {
  const socket = getSocket();

  if (!socket) {
    console.error('Socket not initialized, cannot setup session handlers.');
    return;
  }

  // Lắng nghe sự kiện cập nhật session từ server
  socket.on('session:update', (data: { time_remaining: number; balance: number }) => {
    console.log('[SessionSocket] Received session:update from server:', data);
    if (mainWindow && !mainWindow.isDestroyed()) {
      // Gửi dữ liệu cập nhật đến renderer process
      mainWindow.webContents.send('session:data-updated', data);
    }
  });

  // Lắng nghe sự kiện yêu cầu đăng xuất từ server
  socket.on('session:logout', () => {
    console.log('[SessionSocket] Received session:logout from server.');
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('auth:force-logout');
    }
  });
} 