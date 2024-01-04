import { ClipboardHistory } from './clipboard';
import { ipcRenderer, shell } from 'electron';

declare global {
	const ipc: {
		IPC_SET_TITLE(preload: unknown): void;
		IPC_INCREMENT(callback: () => unknown): void;
		IPC_FINISH: (preload: () => unknown) => void;
		IPC_MAIN_SHOW: (preload: () => unknown) => Promise<unknown>;
		IPC_OPEN_URL: (preload: { url: string }) => Promise<unknown>;
		IPC_SHOW_CONTEXT_MENU: () => void;
		IPC_APP_QUIT: () => void;
		IPC_CHOOSE_FILE: () => void;

		// 剪切板相关
		IPC_READ_CLIPBOARD: () => Promise<ClipboardHistory[]>;

		// 权限相关
		IPC_PERMISSION_DETECT: () => Promise<{
			screen: boolean; // 录屏
			accessibility: boolean; // 辅助功能
		}>
	};
}

const ipc = {
	IPC_SET_TITLE: (preload: unknown) => ipcRenderer.send("CHANNEL_SET_TITLE", preload),
	IPC_INCREMENT: (callback: () => unknown) => ipcRenderer.on("CHANNEL_INCREMENT", callback),
	IPC_FINISH: (preload: () => unknown) => ipcRenderer.send("CHANNEL_FINISH", preload),
	IPC_MAIN_SHOW: async (preload: () => unknown) => ipcRenderer.invoke("CHANNEL_MAIN_SHOW", preload),
	IPC_OPEN_URL: (preload: { url: string }) => shell.openExternal(preload.url),
	IPC_SHOW_CONTEXT_MENU: () => ipcRenderer.send("CHANNEL_SHOW_CONTEXT_MENU"),
	IPC_APP_QUIT: () => ipcRenderer.send("CHANNEL_APP_QUIT"),
	IPC_CHOOSE_FILE: () => ipcRenderer.send("CHANNEL_CHOOSE_FILE"),

	// 剪切板相关
	IPC_READ_CLIPBOARD: () => ipcRenderer.invoke("CHANNEL_READ_CLIPBOARD"),

	// 权限相关
	IPC_PERMISSION_DETECT: () => ipcRenderer.invoke('CHANNEL_PERMISSION_DETECT')
};

export { ipc }