import { ipcMain } from 'electron';
import authService from '../services/auth';
import socketService from '../services/socket';
import systemLogService from '../services/systemLog';
import { BrowserWindow } from 'electron';
import database from '../services/database';
import { Customer } from '../models';

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
      
      console.log('IPC login: Authentication result customer:', JSON.stringify(customer, null, 2));
      
      if (customer) {
        // Sử dụng hàm validateAndActivateCustomer
        const validation = await authService.validateAndActivateCustomer(customer);
        if (!validation.success) {
          return {
            success: false,
            error: validation.error
          };
        }
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
  ipcMain.handle('auth:logout', async (_, userId) => {
    try {
      console.log('LOGOUT DEBUG [Main Process]: Received logout request for userId:', userId, 'type:', typeof userId);
      
      // Đảm bảo userId là number
      const numericUserId = Number(userId);
      if (isNaN(numericUserId)) {
        console.error('LOGOUT DEBUG [Main Process]: Invalid userId format:', userId);
        return { 
          success: false, 
          error: 'Invalid user ID format'
        };
      }
      
      console.log('LOGOUT DEBUG [Main Process]: Converted userId to number:', numericUserId);
      
      const socket = socketService.getAdminSocket();
      
      if (!socket || !socket.connected) {
        console.log('LOGOUT DEBUG [Main Process]: Socket not connected, cannot logout');
        return { 
          success: false, 
          error: 'Không thể kết nối đến máy chủ' 
        };
      }
      
      console.log('LOGOUT DEBUG [Main Process]: Socket connected, calling handleSocketLogout with userId:', numericUserId);
      // Xử lý đăng xuất
      await authService.handleSocketLogout(socket, { userId: numericUserId });
      
      console.log('LOGOUT DEBUG [Main Process]: Logout handled successfully');
      return { success: true };
    } catch (error) {
      console.error('LOGOUT DEBUG [Main Process]: IPC auth:logout error:', error);
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

  // Thêm test handler
  ipcMain.on('test:trigger-logout', async (event, data) => {
    console.log('LOGOUT DEBUG [Main Process IPC]: Received test:trigger-logout with data:', data);
    
    try {
      const customerId = data.customerId || 1;
      
      // Gửi event test
      const windows = BrowserWindow.getAllWindows();
      console.log(`LOGOUT DEBUG [Main Process IPC]: Sending test event to ${windows.length} windows`);
      
      windows.forEach((window, idx) => {
        if (!window.isDestroyed()) {
          console.log(`LOGOUT DEBUG [Main Process IPC]: Sending test event to window #${idx}`);
          window.webContents.send('test:debug-event', {
            customerId: customerId,
            customerName: 'Test User',
            time: new Date().toISOString(),
            isDirectTest: true
          });
          
          // Thử gửi trực tiếp admin:logout-notification
          window.webContents.send('admin:logout-notification', {
            customerId: customerId,
            customerName: 'Test User (Direct)',
            time: new Date().toISOString(),
            isDirectTest: true
          });
        }
      });
      
      // Cũng gửi qua socket service bình thường
      try {
        const socket = socketService.getAdminSocket();
        if (socket && socket.connected) {
          console.log('LOGOUT DEBUG [Main Process IPC]: Also sending via socket service');
          await authService.handleSocketLogout(socket, { userId: customerId });
        }
      } catch (err) {
        console.error('LOGOUT DEBUG [Main Process IPC]: Error during socket service test:', err);
      }
      
      event.reply('test:trigger-logout-reply', { success: true });
    } catch (error) {
      console.error('LOGOUT DEBUG [Main Process IPC]: Error in test handler:', error);
      event.reply('test:trigger-logout-reply', { success: false, error });
    }
  });
} 