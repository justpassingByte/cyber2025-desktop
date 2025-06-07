import { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain } from 'electron';
import * as path from 'path';
// import * as socketIO from 'socket.io-client'; // Xóa dòng này
import { setupSocketClient, isConnected, getSocket } from './services/socket';
import { setupAllAuthHandlers } from './services/authSocket';
import { setupNotiSocketHandlers } from './services/notiSocket';
import { setupSessionSocketHandlers } from './services/sessionSocket';
// Thay đổi cách phát hiện development mode để đảm bảo chính xác hơn
const isDev = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
console.log('Running in development mode?', isDev);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Is packaged?', app.isPackaged);

// Import services
import authService from './services/auth';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
// let socket: socketIO.Socket | null = null; // Xóa dòng này
// let isSocketConnected = false; // Xóa dòng này

// Thiết lập IPC handlers để xử lý các yêu cầu từ renderer process
function setupIpcHandlers() {
  // Kiểm tra trạng thái kết nối socket
  ipcMain.handle('socket:check-connection', () => {
    return isConnected();
  });
  
  // Thử kết nối lại socket
  ipcMain.handle('socket:reconnect', () => {
    try {
      const socket = getSocket();
      if (socket && !socket.connected) {
        socket.connect();
        return socket.connected;
      }
      return isConnected();
    } catch (error) {
      console.error('Socket reconnect error:', error);
      return false;
    }
  });
}

function createWindow() {
  console.log('Creating window...');
  console.log('__dirname:', __dirname);
  console.log('isDev:', isDev);

  // Try-catch for debugging
  try {
    // Check if icon exists, use null if not
    let iconPath;
    try {
      iconPath = path.join(__dirname, '../../assets/icon.svg');
      console.log('Trying to use icon from path:', iconPath);
      // Check if file exists
      const fs = require('fs');
      if (!fs.existsSync(iconPath)) {
        console.log('Icon file does not exist, using null');
        iconPath = null;
      }
    } catch (err) {
      console.error('Error checking icon path:', err);
      iconPath = null;
    }

    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1100,
      height: 700,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      show: false, // Don't show until ready-to-show
      frame: true,
      titleBarStyle: 'default',
      backgroundColor: '#111827', // Dark background color
      icon: iconPath,
    });

    // and load the index.html of the app.
    if (isDev && !app.isPackaged) {
      // In development, load from the dev server
      console.log('Loading from dev server at http://localhost:3001');
      mainWindow.loadURL('http://localhost:3001');
      // Open the DevTools.
      mainWindow.webContents.openDevTools();
    } else {
      // In production or packaged app, load the bundled HTML file
      const htmlPath = path.join(__dirname, '../renderer/index.html');
      console.log('Loading HTML from path:', htmlPath);
      mainWindow.loadFile(htmlPath);

      // Log if the HTML file exists
      const fs = require('fs');
      if (!fs.existsSync(htmlPath)) {
        console.error('HTML file does not exist at path:', htmlPath);
        // Try to load a basic HTML as fallback
        mainWindow.loadURL(`data:text/html,<html><body><h1>Error: Could not load application content</h1><p>Missing file: ${htmlPath}</p></body></html>`);
      }
    }

    // Log any load errors
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Failed to load:', errorCode, errorDescription);
    });

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
      console.log('Window ready to show');
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
      // Dereference the window object
      mainWindow = null;
    });

    // Create system tray with error handling
    try {
      createTray();
    } catch (err) {
      console.error('Error creating tray:', err);
      // Continue without tray if it fails
    }

  } catch (err) {
    console.error('Error creating window:', err);
  }
}

function createTray() {
  console.log('Creating tray...');
  
  // For a real app, use a proper icon
  let trayIcon;
  try {
    const iconPath = path.join(__dirname, '../../assets/icon.svg');
    console.log('Tray icon path:', iconPath);
    
    // Check if file exists
    const fs = require('fs');
    if (fs.existsSync(iconPath)) {
      trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
    } else {
      console.log('Tray icon file not found, using empty image');
      // Create a minimal 16x16 transparent icon as fallback
      trayIcon = nativeImage.createEmpty();
    }
  } catch (err) {
    console.error('Error loading tray icon:', err);
    trayIcon = nativeImage.createEmpty();
  }

  tray = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mở Cybercafe Client',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createWindow();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Thoát',
      click: () => {
        app.quit();
      }
    },
  ]);

  tray.setToolTip('Cybercafe Client');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.focus();
      } else {
        mainWindow.show();
      }
    } else {
      createWindow();
    }
  });
}

// Handle any uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  console.log('App ready, creating window...');
  createWindow();
  
  // Khởi tạo Socket.IO client
  setupSocketClient(mainWindow);
  setupAllAuthHandlers();
  setupNotiSocketHandlers(mainWindow);
  setupSessionSocketHandlers(mainWindow);
  
  // Thiết lập IPC handlers
  setupIpcHandlers();

});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
}); 