import { ipcMain } from 'electron';
import socketService from '../services/socket';

export function registerSocketHandlers() {
  // Check socket connection status
  ipcMain.handle('socket:check-connection', (event) => {
    return socketService.isConnected();
  });
  
  // Register user with socket
  ipcMain.handle('socket:register-user', (event, username) => {
    try {
      // This will be called from renderer to register a user through main process
      return true;
    } catch (error) {
      console.error('Error registering user via IPC:', error);
      return false;
    }
  });

  // Forward top-up notification through IPC
  ipcMain.on('socket:topup-notification', (event, data) => {
    try {
      const { username, amount, message } = data;
      // Forward the notification to the appropriate user through socket
      socketService.emitToUser(username, 'topup:completed', {
        transaction: {
          _id: `ipc-${Date.now()}`,
          username,
          amount,
          description: message
        },
        notification: `Tài khoản của bạn vừa được nạp ${amount.toLocaleString()} VND`
      });
      return true;
    } catch (error) {
      console.error('Error sending topup notification via IPC:', error);
      return false;
    }
  });
} 