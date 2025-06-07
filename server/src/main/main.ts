import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { Server } from 'socket.io';
import 'reflect-metadata';

// Import services
import database from './services/database';
import socketService from './services/socket';

import authService from './services/auth';
import xamppService from './services/xampp';
import setupManager from './setup';
// Thay thế service logging cũ với system log và customer log mới
import systemLogService from './services/systemLog';
import customerLogService from './services/customerLog';

// Import các handler IPC
import { registerCustomerHandlers } from './ipcHandlers/customers';
import { registerTopupHandlers } from './ipcHandlers/topup';
import { registerLogHandlers } from './ipcHandlers/logs';
import { registerTransactionHandlers } from './ipcHandlers/transactions';
import { registerAuthHandlers } from './ipcHandlers/auth';
import { registerSocketHandlers } from './ipcHandlers/socket';

// Import auto login script
import './adminAutoLogin';

// Better environment detection
const isDev = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
console.log('Running in development mode?', isDev);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Is packaged?', app.isPackaged);

// Keep a global reference of the window object to avoid garbage collection
let mainWindow: BrowserWindow | null = null;
let setupComplete: boolean = false;

// Setup Socket.IO server directly
function setupSocketServer() {
  // Create a standalone Socket.IO server (no HTTP server)
  const io = new Server({
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Start listening on a specific port
  const SOCKET_PORT = 3000;
  io.listen(SOCKET_PORT);
  console.log(`Socket.IO server listening on port ${SOCKET_PORT}`);

  // Initialize socket service with our IO instance
  socketService.initializeStandalone(io);
  
  // Setup Socket.IO authentication handler
  socketService.onConnection((socket) => {
    console.log('New socket connection:', socket.id);
    
    // Lắng nghe sự kiện đăng nhập
    socket.on('auth:login', async (credentials, callback) => {
      try {
        console.log(`Login attempt for: ${credentials.username}`);
        const ip_address = socket.handshake.address || 'unknown';
        const customer = await authService.authenticate(credentials.username, credentials.password, ip_address);
        
        if (customer) {
          console.log(`Customer ${customer.name} authenticated successfully`);
          
          // Đăng ký socket với customer ID để dễ dàng emit tới họ sau này
          socket.join(`customer:${customer.id}`);
          
          // Loại bỏ password_hash trước khi gửi về client
          const { password_hash, ...customerData } = customer;
          
          // Gửi kết quả đăng nhập thành công
          callback({
            success: true,
            customer: customerData
          });
          
          // Ghi log đăng nhập khách hàng
          await customerLogService.log(
            customer.id,
            'login',
            {
              username: credentials.username,
              ip_address: ip_address,
              time: new Date().toISOString()
            },
            ip_address
          );
          
          // Thông báo admin về đăng nhập của khách hàng
          socketService.emitToAdmins('admin:login-notification', {
            customerId: customer.id,
            customerName: customer.name,
            time: new Date().toISOString()
          });
        } else {
          console.log(`Authentication failed for: ${credentials.username}`);
          callback({
            success: false,
            error: 'Username hoặc mật khẩu không đúng'
          });
          
          // Ghi log thất bại
          await systemLogService.log(
            'security',
            'Failed authentication attempt',
            {
              username: credentials.username,
              ip_address: ip_address,
              time: new Date().toISOString()
            },
            'warning',
            ip_address
          );
        }
      } catch (error) {
        console.error('Socket login error:', error);
        callback({
          success: false,
          error: 'Lỗi xác thực'
        });
        
        // Ghi log lỗi
        await systemLogService.error(
          'security',
          'Socket login error',
          error,
          socket.handshake.address
        );
      }
    });
    
    // Lắng nghe sự kiện đăng xuất
    socket.on('auth:logout', async (data, callback) => {
      console.log('LOGOUT DEBUG [SERVER]: Received auth:logout event with data:', data);
      
      try {
        // Parse userId from different formats
        const userId = typeof data === 'object' && data !== null && 'userId' in data 
          ? Number(data.userId) 
          : typeof data === 'number' || typeof data === 'string' 
            ? Number(data) 
            : null;
            
        if (userId === null) {
          console.error('LOGOUT DEBUG [SERVER]: Invalid userId format in auth:logout:', data);
          if (typeof callback === 'function') {
            callback({ success: false, error: 'Invalid user ID format' });
          }
          return;
        }
        
        console.log(`LOGOUT DEBUG [SERVER]: Processing logout for userId: ${userId}`);
        
        // Call auth service to handle the logout logic
        await authService.handleSocketLogout(socket, { userId });
        
        console.log(`LOGOUT DEBUG [SERVER]: Logout processed successfully for user ${userId}`);
        
        // Send success response
        if (typeof callback === 'function') {
          console.log('LOGOUT DEBUG [SERVER]: Sending success callback');
          callback({ success: true });
        }
      } catch (error) {
        console.error('LOGOUT DEBUG [SERVER]: Error in auth:logout handler:', error);
        if (typeof callback === 'function') {
          callback({ success: false, error: 'Server error during logout' });
        }
      }
    });
  });
}

// Initialize database and services
async function initServices() {
  console.log('Initializing services...');
  
  try {
    // Start MySQL via XAMPP
    const mysqlStarted = await xamppService.startMySql();
    if (!mysqlStarted) {
      console.error('Failed to start MySQL via XAMPP');
      throw new Error('MySQL failed to start');
    }
    
    // Initialize database if needed
    await xamppService.initializeDatabase();
    
    // Connect to MySQL database
    await database.connect();
    
    // Create default customers if needed
    await authService.createDefaultCustomers();
    
    // Đăng ký các IPC handler
    registerCustomerHandlers();
    registerTopupHandlers();
    registerLogHandlers();
    registerTransactionHandlers();
    registerAuthHandlers();
    registerSocketHandlers();
    
    // Log application startup
    await systemLogService.log(
      'app',
      'Application started',
      {
        version: app.getVersion(),
        node_env: process.env.NODE_ENV,
        is_dev: isDev
      },
      'info'
    );
    
    // Setup Socket.IO server (without Express/HTTP)
    setupSocketServer();
    console.log('Socket.IO server initialized successfully');
  } catch (error) {
    console.error('Failed to initialize services:', error);
    
    // Log error
    await systemLogService.error('app', 'Failed to initialize services', error);
  }
}

async function runSetup(): Promise<boolean> {
  // Check if this is the first run
  if (setupManager.isFirstRunCheck()) {
    console.log('First run detected, starting setup...');
    return await setupManager.performFirstRunSetup();
  }
  
  return true;
}

function createWindow(): void {
  console.log('Creating window...');
  
  try {
    // Create the browser window
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 1024,
      minHeight: 768,
      backgroundColor: '#121212',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: !isDev,
      },
    });

    // Load app directly from file
    const htmlPath = path.join(__dirname, '../renderer/index.html');
    console.log('Loading HTML from path:', htmlPath);
    
    // Check if HTML file exists
    const fs = require('fs');
    if (!fs.existsSync(htmlPath)) {
      console.error('HTML file does not exist at path:', htmlPath);
      mainWindow.loadURL(`data:text/html,<html><body><h1>Error: Could not load application content</h1><p>Missing file: ${htmlPath}</p></body></html>`);
    } else {
      mainWindow.loadFile(htmlPath);
    }

    // Open DevTools if in dev mode
    if (isDev) {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    // Maximize the window
    mainWindow.maximize();

    // Emitted when the window is closed
    mainWindow.on('closed', () => {
      // Dereference the window object
      mainWindow = null;
    });
    
  } catch (err) {
    console.error('Error creating window:', err);
  }
}

// Handle any uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  systemLogService.error('app', 'Uncaught exception', err);
});

// This method will be called when Electron has finished initialization
app.on('ready', async () => {
  console.log('App ready, starting setup process...');
  
  // Run setup if needed
  setupComplete = await runSetup();
  
  if (setupComplete) {
    console.log('Setup complete, initializing services...');
    await initServices();
    createWindow();
  } else {
    console.error('Setup failed, exiting application');
    app.exit(1);
  }
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, applications keep their menu bar unless the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create a window in the app when the dock icon is clicked and there are no other windows open
  if (mainWindow === null) {
    createWindow();
  }
});

// Clean up on app quit
app.on('quit', async () => {
  try {
    // Log application shutdown
    await systemLogService.log('app', 'Application shutdown', {
      time: new Date().toISOString()
    });
    
    // Stop MySQL
    await xamppService.stopMySql();
    
    // Close database connection
    await database.disconnect();
  } catch (error) {
    console.error('Error during app quit cleanup:', error);
  }
}); 