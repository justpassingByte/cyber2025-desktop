import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';

// Keep a global reference of the window object to avoid garbage collection
let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
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

  // Load the app
  const startUrl = isDev
    ? 'http://localhost:8080/renderer/index.html'
    : `file://${path.join(__dirname, '../renderer/index.html')}`;

  mainWindow.loadURL(startUrl);

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
}

// This method will be called when Electron has finished initialization
app.on('ready', createWindow);

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

// IPC listeners for communication with renderer
ipcMain.on('app-ready', (event) => {
  event.reply('app-status', 'Server is running');
});

// Handle server status
ipcMain.handle('get-server-status', async () => {
  return {
    status: 'online',
    activeUsers: 24,
    stationsInUse: 8,
    stationsAvailable: 4,
  };
}); 