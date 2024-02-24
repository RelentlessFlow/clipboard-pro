// Native
import path, { join } from 'path';
import express from 'express';
// Packages
import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { CHistoryManager } from './clipboard';
import {
  ipcAppIconPath,
  ipcFileServerHost,
  ipcOpenSettingsSecurity,
  ipcPermissionDetect,
  ipcReadClipboards,
  ipcWriteClipboards
} from './ipc.processing';
import { getActivePermission, isMac } from './assets/common';
import { Constant } from './assets/constant';

const clipboardManager: CHistoryManager = CHistoryManager.getInstance();

function createWindow() {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 600,
    height: 800,
    minWidth: 300,
    minHeight: 500,
    frame: false,
    show: true,
    transparent: false,
    resizable: true,
    titleBarStyle: 'hidden',
    fullscreenable: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });

  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}` : join(__dirname, '../src/out/index.html');
  isDev ? window.loadURL(url) : window.loadFile(url);
  window.webContents.openDevTools();
  const app = express();
  const appPort = Constant.EXPRESS_PORT;
  // 设置允许跨域访问
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
  });
  app.use("/static", express.static(path.join(path.resolve(__dirname, '..'), 'static'))) // 静态资源目录
  app.listen(appPort);
}
app.whenReady().then(async () => {
  createWindow();
  // MacOS 兼容写法
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  const activePermission = await getActivePermission();
  if (activePermission.permission) {
    await clipboardManager.init();
    clipboardManager.activate();
  }
});
app.on('window-all-closed', () => {
  // MacOS 兼容写法
  if (!isMac) app.quit();
});
app.on('will-quit', () => {
  clipboardManager.deactivate();
});
// IPC 监听
ipcReadClipboards(clipboardManager);
ipcWriteClipboards(clipboardManager);
ipcPermissionDetect();
ipcOpenSettingsSecurity();
ipcAppIconPath();
ipcFileServerHost();