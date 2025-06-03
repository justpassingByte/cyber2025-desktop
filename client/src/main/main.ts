import { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function createWindow() {
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
    icon: path.join(__dirname, '../../assets/icon.svg'),
  });

  // and load the index.html of the app.
  if (isDev) {
    // In development, load from the dev server
    mainWindow.loadURL('http://localhost:3001');
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the bundled HTML file
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
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

  // Create system tray
  createTray();
}

function createTray() {
  // For a real app, use a proper icon
  const icon = nativeImage.createFromPath(
    path.join(__dirname, '../../assets/icon.svg')
  ).resize({ width: 16, height: 16 });

  tray = new Tray(icon);
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

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