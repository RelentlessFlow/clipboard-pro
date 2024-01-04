import { ipcMain } from 'electron';
import { ClipboardManager } from './clipboard';

const ipcProcessingClipBoard = () => {

	const clipboardManager: ClipboardManager = ClipboardManager.getInstance();
	clipboardManager.subscribeClipboard();

	ipcMain.handle('CHANNEL_READ_CLIPBOARD', () => {
		if (!clipboardManager) return [];
		return clipboardManager.getClipboard();
	});

	return clipboardManager;
}

export {
	ipcProcessingClipBoard
}