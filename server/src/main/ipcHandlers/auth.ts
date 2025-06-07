import { ipcMain } from 'electron';
import authService from '../services/auth';
import socketService from '../services/socket';
import systemLogService from '../services/systemLog';

/**
 * Đăng ký các IPC handlers cho authentication
 */
export function registerAuthHandlers(): void {
  console.log('Registering auth IPC handlers');

  // Xử lý đăng nhập
  ipcMain.handle('auth:login', async (_, credentials) => {
    try {
      const socket = socketService.getAdminSocket();
      
      if (!socket || !socket.connected) {
        return { 
          success: false, 
          error: 'Không thể kết nối đến máy chủ' 
        };
      }
      
      // Lấy địa chỉ IP của client
      const ip_address = socket.handshake.address || 'unknown';
      console.log(`IPC login attempt for: ${credentials.username} from ${ip_address}`);
      
      // Xác thực thông tin đăng nhập
      const customer = await authService.authenticate(credentials.username, credentials.password, ip_address);
      
      if (customer) {
        // Loại bỏ password_hash trước khi gửi về client
        const { password_hash, ...customerData } = customer;
        
        return {
          success: true,
          customer: customerData
        };
      } else {
        // Ghi log thất bại
        await systemLogService.log(
          'security',
          'IPC login failed',
          {
            username: credentials.username,
            time: new Date().toISOString()
          },
          'warning',
          ip_address
        );
        
        return {
          success: false,
          error: 'Username hoặc mật khẩu không đúng'
        };
      }
    } catch (error) {
      console.error('IPC auth:login error:', error);
      await systemLogService.error(
        'security',
        'IPC login error',
        error
      );
      
      return { 
        success: false, 
        error: 'Đã xảy ra lỗi khi đăng nhập' 
      };
    }
  });
  
  // Xử lý đăng xuất
  ipcMain.handle('auth:logout', async (_, { userId }) => {
    try {
      const socket = socketService.getAdminSocket();
      
      if (!socket || !socket.connected) {
        return { 
          success: false, 
          error: 'Không thể kết nối đến máy chủ' 
        };
      }
      
      // Xử lý đăng xuất
      await authService.handleSocketLogout(socket, { userId });
      
      return { success: true };
    } catch (error) {
      console.error('IPC auth:logout error:', error);
      await systemLogService.error(
        'security',
        'IPC logout error',
        error
      );
      
      return { 
        success: false, 
        error: 'Đã xảy ra lỗi khi đăng xuất' 
      };
    }
  });

  // Thử kết nối lại socket
  ipcMain.handle('socket:reconnect', () => {
    try {
      return socketService.reconnect();
    } catch (error) {
      console.error('Socket reconnect error:', error);
      return false;
    }
  });

  // Đăng ký admin (dummy handler, có thể mở rộng logic nếu cần)
  ipcMain.handle('auth:register-admin', async (_event, { secretKey }) => {
    // Ở đây bạn có thể xác thực secretKey hoặc thực hiện logic đăng ký admin
    if (secretKey === 'admin123') {
      return { success: true };
    }
    return { success: false, error: 'Invalid admin key' };
  });
} 