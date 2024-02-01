// Native
import { join } from 'path';

// Packages
import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { ClipboardManager } from './clipboard';
import { ipcOpenSettingsSecurity, ipcPermissionDetect, ipcProcessingClipBoard } from './ipc.processing';
import { getActivePermission, isMac } from './assets/common';

const height = 600;
const width = 800;
const clipboardManager: ClipboardManager = ClipboardManager.getInstance();

function createWindow() {
	// Create the browser window.
	const window = new BrowserWindow({
		width,
		height,
		frame: true,
		show: true,
		transparent: false,
		resizable: true,
		fullscreenable: false,
		webPreferences: {
			preload: join(__dirname, 'preload.js'),
		},
	});

	const port = process.env.PORT || 3000;
	const url = isDev ? `http://localhost:${port}` : join(__dirname, '../src/out/index.html');

	isDev ? window.loadURL(url) : window.loadFile(url);
	window.webContents.openDevTools();
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
		clipboardManager.subscribe();
	}
});

app.on('window-all-closed', () => {
	// MacOS 兼容写法
	if (!isMac) app.quit();
});

app.on('will-quit', () => {
	clipboardManager.unSubscribe();
});

// IPC 监听
ipcProcessingClipBoard(clipboardManager);
ipcPermissionDetect();
ipcOpenSettingsSecurity();
