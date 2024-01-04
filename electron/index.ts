// Native
import { join } from "path";

// Packages
import { app, BrowserWindow, ipcMain } from "electron";
import isDev from "electron-is-dev";
import { ClipboardManager } from "./clipboard";
import { ipcProcessingClipBoard } from './ipc.processing';

const height = 600;
const width = 800;
const isMac = process.platform === 'darwin';

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
			preload: join(__dirname, 'preload.js')
		}
	});

	const port = process.env.PORT || 3000;
	const url = isDev ? `http://localhost:${port}` : join(__dirname, '../src/out/index.html');

	isDev ? window.loadURL(url) : window.loadFile(url);
	window.webContents.openDevTools();
}

const performanceMonitor = () => {
	return setInterval(() => {
		const cpuUsage = process.cpuUsage();
		const memoryUsage = process.memoryUsage();

		console.log('CPU Usage:', cpuUsage);
		console.log('Memory Usage:', memoryUsage);
	}, 5000);
}

// IPC 监听
const clipBoardManager = ipcProcessingClipBoard()

app.whenReady().then(() => {
	createWindow();
	// MacOS 兼容写法
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', () => {
	// MacOS 兼容写法
	if (!isMac) app.quit();
});

app.on('will-quit', () => {
	clipBoardManager.unSubscribeClipboard();
});
