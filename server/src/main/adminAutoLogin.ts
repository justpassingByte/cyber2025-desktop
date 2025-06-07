import { io } from 'socket.io-client';

/**
 * Script để tự động đăng nhập admin vào socket server
 * Chạy script này để test tính năng admin khi chưa có giao diện đăng nhập
 */
function autoLoginAdmin() {
  console.log('Attempting to auto-login admin...');
  
  // Kết nối đến Socket.IO server
  const socket = io('http://localhost:3000');
  
  socket.on('connect', () => {
    console.log('Connected to socket server with ID:', socket.id);
    
    // Gửi yêu cầu đăng nhập admin
    socket.emit('admin:login', { secretKey: 'admin123' });
    
    // Lắng nghe phản hồi
    socket.on('admin:login-response', (response: { success: boolean; error?: string }) => {
      if (response.success) {
        console.log('Admin auto-login successful!');
        console.log('Admin socket is now registered. You should see customer status updates.');
      } else {
        console.error('Admin auto-login failed:', response.error);
      }
    });
    
    // Lắng nghe sự kiện thay đổi trạng thái khách hàng
    socket.on('customer:status-changed', (data: { customer_id: number; status: string }) => {
      console.log('Received customer status change:', data);
    });
    
    // Lắng nghe admin:login-notification
    socket.on('admin:login-notification', (data: any) => {
      console.log('Received admin login notification:', data);
    });
    
    // Lắng nghe admin:logout-notification
    socket.on('admin:logout-notification', (data: any) => {
      console.log('Received admin logout notification:', data);
    });
  });
  
  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  });
  
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
  
  // Giữ kết nối socket mở
  return socket;
}

// Tự động chạy khi module được import
const adminSocket = autoLoginAdmin();

export default adminSocket; 