import { app, BrowserWindow } from 'electron';
import path from 'path';
import registerIPCHandlers from './ipcHandlers';
import { isDevelopment } from './utils';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  // Preload untuk menghubungkan main dengan renderer
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const devUrl = 'http://localhost:3000'; // URL untuk development (Next.js)

  if (isDevelopment()) {
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'out', 'index.html')); // Buat production build
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  registerIPCHandlers();  // Register IPC Handlers

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
