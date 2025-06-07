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

  // Đăng xuất - xử lý cả hai format có thể nhận được: trực tiếp userId hoặc object { userId }
  ipcMain.handle('auth:logout', async (_, data) => {
    const socket = getSocket();
    try {
      console.log('LOGOUT DEBUG [Main Process]: auth:logout received data:', data);
      
      // Xác định userId từ nhiều format khác nhau
      let userId;
      if (typeof data === 'object' && data !== null && 'userId' in data) {
        userId = Number(data.userId); // Format { userId: xxx }
      } else if (typeof data === 'number' || typeof data === 'string') {
        userId = Number(data); // Format trực tiếp userId
      } else {
        console.error('LOGOUT DEBUG [Main Process]: Invalid data format for logout:', data);
        return { success: false, error: 'Định dạng dữ liệu đăng xuất không hợp lệ' };
      }
      
      console.log(`LOGOUT DEBUG [Main Process]: Processed userId=${userId}, type=${typeof userId}`);
      
      // Kiểm tra kết nối
      if (!socket || !socket.connected) {
        console.error('LOGOUT DEBUG [Main Process]: Socket not connected');
        return { success: false, error: 'Không thể kết nối đến máy chủ' };
      }
      
      console.log(`LOGOUT DEBUG [Main Process]: Sending logout to server for userId=${userId}`);
      
      // Gửi yêu cầu đăng xuất đến server
      return await new Promise<{ success: boolean; error?: string }>((resolve) => {
        socket.emit('auth:logout', { userId }, (response: { success: boolean; error?: string }) => {
          console.log('LOGOUT DEBUG [Main Process]: Server response:', response);
          resolve(response);
        });
        
        // Timeout để tránh chờ mãi không phản hồi
        setTimeout(() => {
          console.log('LOGOUT DEBUG [Main Process]: Timeout reached, forcing success response');
          resolve({ success: true });
        }, 3000);
      });
    } catch (error) {
      console.error('LOGOUT DEBUG [Main Process]: Error in auth:logout handler:', error);
      return { success: false, error: 'Đã xảy ra lỗi khi đăng xuất' };
    }
  });
}

// Hàm mới để xử lý xác thực session đã lưu
function setupSessionValidator() {
  const socket = getSocket();
  if (!socket) return;

  ipcMain.handle('auth:validate-stored-session', async (event, { userId }) => {
    if (!socket.connected) {
      console.warn('[Validator] Socket not connected, cannot validate session.');
      return { isValid: false }; // Nếu không có kết nối, coi như không hợp lệ
    }

    return new Promise((resolve) => {
      // Đặt một timeout để tránh chờ đợi vô hạn
      const timeout = setTimeout(() => {
        console.error(`[Validator] Timeout validating session for user ${userId}`);
        socket.off('auth:validate-session-response');
        resolve({ isValid: false });
      }, 5000); // 5 giây timeout

      // Lắng nghe phản hồi từ server
      socket.once('auth:validate-session-response', (response: { isValid: boolean, customer?: any }) => {
        clearTimeout(timeout);
        console.log(`[Validator] Received validation response for user ${userId}:`, response);
        resolve(response);
      });

      // Gửi yêu cầu xác thực đến server
      console.log(`[Validator] Sending validation request for user ${userId}...`);
      socket.emit('auth:validate-session', { userId });
    });
  });
}

// Gọi cả hai hàm thiết lập
export function setupAllAuthHandlers() {
    setupAuthSocketHandlers();
    setupSessionValidator();
} 