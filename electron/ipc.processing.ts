import { ipcMain, shell } from 'electron';
import { ClipboardManager } from './clipboard';
import { IPC_CHANNEL } from './ipc.bridge';
import { getActivePermission, isMac } from './common';

// 获取剪切板内容
const ipcProcessingClipBoard = (clipboardManager: ClipboardManager) => {
	ipcMain.handle(IPC_CHANNEL.READ_CLIPBOARD, () => {
		if (!clipboardManager) return [];
		return clipboardManager.getClipboard();
	});
};

// 录屏、辅助功能检测
const ipcPermissionDetect = () => {
	ipcMain.handle(IPC_CHANNEL.PERMISSION_ACTIVE, () => {
		return getActivePermission();
	});
};

// 打开权限设置界面
const ipcOpenSettingsSecurity = () => {
	if (!isMac) return;
	ipcMain.on(
		IPC_CHANNEL.OPEN_SETTINGS_SECURITY,
		async (_, args: '' | 'ScreenCapture' | 'Accessibility' = '') => {
			const url = 'x-apple.systempreferences:com.apple.preference.security?Privacy_' + args;
			await shell.openExternal(url)
		}
	);
};

export {
	ipcProcessingClipBoard,
	ipcPermissionDetect,
	ipcOpenSettingsSecurity
};