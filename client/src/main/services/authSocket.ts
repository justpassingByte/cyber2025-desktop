import { ipcMain } from 'electron';
import { getSocket } from './socket';
import type { LoginCredentials, LoginResult } from './auth';

export function setupAuthSocketHandlers() {
  // Đăng nhập
  ipcMain.handle('auth:login', async (_, credentials: LoginCredentials) => {
    const socket = getSocket();
    try {
      if (!socket || !socket.connected) {
        return { success: false, error: 'Không thể kết nối đến máy chủ' };
      }
      return await new Promise<LoginResult>((resolve) => {
        socket.emit('auth:login', credentials, (response: LoginResult) => {
          resolve(response);
        });
        setTimeout(() => {
          resolve({ success: false, error: 'Hết thời gian kết nối' });
        }, 5000);
      });
    } catch (error) {
      return { success: false, error: 'Đã xảy ra lỗi khi đăng nhập' };
    }
  });

  // Đăng xuất
  ipcMain.handle('auth:logout', async (_, { userId }: { userId: number }) => {
    const socket = getSocket();
    try {
      if (!socket || !socket.connected) {
        return { success: false, error: 'Không thể kết nối đến máy chủ' };
      }
      return await new Promise<{ success: boolean; error?: string }>((resolve) => {
        socket.emit('auth:logout', { userId }, (response: { success: boolean; error?: string }) => {
          resolve(response);
        });
        setTimeout(() => {
          resolve({ success: true });
        }, 3000);
      });
    } catch (error) {
      return { success: false, error: 'Đã xảy ra lỗi khi đăng xuất' };
    }
  });
} 