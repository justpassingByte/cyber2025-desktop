import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { BrowserWindow } from 'electron';

interface UserConnection {
  socketId: string;
  username: string;
  isAdmin?: boolean;  // Thêm trường để phân biệt admin
}

class WebSocketService {
  private static instance: WebSocketService;
  private io: Server | null = null;
  private connected: boolean = false;
  private adminSockets: Set<string> = new Set();
  private userConnections: UserConnection[] = [];
  private adminSocket: Socket | null = null;  // Lưu trữ một socket admin cố định
  private connectedUsers: Map<string, string> = new Map(); // username -> socketId
  private customerSockets: Map<number, string> = new Map(); // customerId -> socketId

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  // Initialize with HTTP server (for backward compatibility)
  public initialize(httpServer: HttpServer): void {
    try {
      this.io = new Server(httpServer, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST']
        }
      });

      this.setupEventHandlers();
      this.connected = true;
      console.log('Socket.IO server initialized with HTTP server');
    } catch (error) {
      console.error('Failed to initialize Socket.IO:', error);
      this.connected = false;
    }
  }

  // Initialize standalone (without HTTP server)
  public initializeStandalone(io: Server): void {
    try {
      this.io = io;
      this.setupEventHandlers();
      this.connected = true;
      console.log('Socket.IO server initialized in standalone mode');
    } catch (error) {
      console.error('Failed to initialize standalone Socket.IO:', error);
      this.connected = false;
    }
  }

  // Setup common event handlers
  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      console.log('New socket connection:', socket.id);
    
      // Xử lý đăng nhập admin
      socket.on('admin:login', (data: { secretKey: string }) => {
        if (data.secretKey === 'admin123') { // Nên thay bằng xác thực thật
          this.adminSockets.add(socket.id);
          this.adminSocket = socket; // Lưu lại socket admin mới nhất
          socket.join('admins');
          socket.emit('admin:login-response', { success: true });
          console.log('Admin socket registered:', socket.id);
        } else {
          socket.emit('admin:login-response', { 
            success: false, 
            error: 'Invalid admin key' 
          });
        }
      });
    
      // Xử lý khi ngắt kết nối
      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
        // Xóa khỏi danh sách admin nếu có
        if (this.adminSockets.has(socket.id)) {
          this.adminSockets.delete(socket.id);
          if (this.adminSocket === socket) {
            this.adminSocket = null;
          }
          console.log('Admin socket removed:', socket.id);
        }
        this.removeUserConnection(socket.id);
      });

      // Handle user registration
      socket.on('register-user', (username: string) => {
        console.log(`User registered: ${username} with socket ID: ${socket.id}`);
        this.connectedUsers.set(username, socket.id);
        socket.emit('registration-successful', { username });
        
        // Notify relevant BrowserWindows
        this.notifyRenderer('socket:user-connected', { username, socketId: socket.id });
      });

      // Handle customer linking
      socket.on('customer:link', (customerId: number) => {
        this.customerSockets.set(customerId, socket.id);
        console.log(`Customer ${customerId} linked to socket ${socket.id}`);
      });
    });
  }

  // Đăng ký callback khi có kết nối socket mới
  public onConnection(callback: (socket: Socket) => void): void {
    if (!this.io || !this.connected) {
      console.error('Socket.IO not initialized');
      return;
    }

    this.io.on('connection', callback);
  }

  // Lấy socket admin để sử dụng
  public getAdminSocket(): Socket | null {
    // Nếu có adminSocket đã lưu, kiểm tra kết nối của nó
    if (this.adminSocket && this.adminSocket.connected) {
      return this.adminSocket;
    }

    // Nếu không có adminSocket hoặc nó đã ngắt kết nối, 
    // thử tìm một socket admin khác
    if (this.io && this.adminSockets.size > 0) {
      for (const socketId of this.adminSockets) {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket && socket.connected) {
          this.adminSocket = socket;
          return socket;
        }
      }
    }

    // Sử dụng bất kỳ socket nào đang kết nối nếu không có socket admin
    if (this.io && this.io.sockets.sockets.size > 0) {
      const socket = Array.from(this.io.sockets.sockets.values())[0];
      console.warn('No admin socket found, using regular socket:', socket.id);
      return socket;
    }

    return null;
  }

  // Thử kết nối lại
  public reconnect(): boolean {
    if (this.connected && this.io) {
      console.log('Socket service already connected');
      return true;
    }

    try {
      // Nếu đã khởi tạo io nhưng không kết nối, thử kết nối lại
      if (this.io) {
        this.connected = true;
        console.log('Socket service reconnected');
        return true;
      }

      console.error('Cannot reconnect: Socket.IO not initialized');
      return false;
    } catch (error) {
      console.error('Error reconnecting socket service:', error);
      return false;
    }
  }

  // Gửi thông báo đến một customer cụ thể
  public emitToCustomer(customerId: number, event: string, data: any): void {
    if (!this.io || !this.connected) {
      console.error('Socket.IO not initialized');
      return;
    }

    const socketId = this.customerSockets.get(customerId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
      console.log(`Emitted ${event} to customer ${customerId}`);
    }
    
    // Also notify the renderer process
    this.notifyRenderer(event, {
      customerId,
      ...data
    });
  }

  // Gửi thông báo đến một user cụ thể (theo username) - compatibility method
  public emitToUser(username: string, event: string, data: any): void {
    if (!this.io || !this.connected) {
      console.error('Socket.IO not initialized');
      return;
    }

    const socketId = this.connectedUsers.get(username);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
      console.log(`Emitted ${event} to user ${username}`);
    }
  }

  // Gửi thông báo đến tất cả admin
  public emitToAdmins(event: string, data: any): void {
    if (!this.io || !this.connected) {
      console.error('Socket.IO not initialized');
      return;
    }

    this.io.to('admins').emit(event, data);
    console.log(`Emitted ${event} to all admins`);
  }

  // Gửi thông báo đến tất cả clients
  public emitToAll(event: string, data: any): void {
    if (!this.io || !this.connected) {
      console.error('Socket.IO not initialized');
      return;
    }

    this.io.emit(event, data);
    console.log(`Emitted ${event} to all connected clients`);
  }

  private registerUser(socketId: string, username: string, isAdmin: boolean = false): void {
    // Remove any existing connections for this socket
    this.userConnections = this.userConnections.filter(conn => conn.socketId !== socketId);
    
    // Add the new connection
    this.userConnections.push({ socketId, username, isAdmin });
  }

  private removeUserConnection(socketId: string): void {
    const removedConnection = this.userConnections.find(conn => conn.socketId === socketId);
    if (removedConnection) {
      console.log(`User ${removedConnection.username} disconnected`);
    }
    
    this.userConnections = this.userConnections.filter(conn => conn.socketId !== socketId);
  }

  public getUserConnections(): UserConnection[] {
    return [...this.userConnections];
  }

  // Method to notify renderer process through BrowserWindow
  private notifyRenderer(channel: string, data: any) {
    try {
      const windows = BrowserWindow.getAllWindows();
      windows.forEach(window => {
        if (!window.isDestroyed()) {
          window.webContents.send(channel, data);
        }
      });
    } catch (error) {
      console.error('Error notifying renderer:', error);
    }
  }

  // Check if socket server is connected
  isConnected(): boolean {
    return this.io !== null && !!this.io.engine?.clientsCount;
  }
}

export default WebSocketService.getInstance(); 