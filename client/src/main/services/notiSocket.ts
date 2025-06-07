import { getSocket } from './socket';
import { BrowserWindow } from 'electron';
import type { TopUpNotificationData } from '../types/noti';

export function setupNotiSocketHandlers(mainWindow: Electron.BrowserWindow | null) {
  const socket = getSocket();
  if (!socket) return;

  // Lắng nghe sự kiện topup:completed từ server và forward qua IPC
  socket.on('topup:completed', (data: TopUpNotificationData) => {
    console.log('[notiSocket] Received topup:completed from server:', data);
    if (mainWindow && !mainWindow.isDestroyed()) {
      console.log('[notiSocket] Sending IPC topup:completed to renderer:', data);
      mainWindow.webContents.send('topup:completed', data);
    } else {
      console.log('[notiSocket] mainWindow is null or destroyed, cannot send IPC');
    }
  });

  // (Có thể thêm các sự kiện notification khác ở đây, dùng type tương ứng)
} 