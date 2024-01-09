import { ClipboardHistory } from './clipboard';
import { ipcRenderer } from 'electron';

declare global {
	const ipc: {
		// 剪切板相关
		READ_CLIPBOARD: () => Promise<ClipboardHistory[]>;

		// 权限相关
		PERMISSION_ACTIVE: () => Promise<{
			permission: boolean,
			accessibility?: boolean,
			screenRecording?: boolean
		}>;
		// 打开权限设置页面，仅支持Mac
		OPEN_SETTINGS_SECURITY: (target?: '' | 'ScreenCapture' | 'Accessibility') => void
	};
}

enum IPC_CHANNEL {
	READ_CLIPBOARD = 'CHANNEL_READ_CLIPBOARD',
	PERMISSION_ACTIVE = 'CHANNEL_PERMISSION_ACTIVE',
	OPEN_SETTINGS_SECURITY = 'CHANNEL_OPEN_SECURITY_PRIVACY_SETTINGS',
}

const ipc = {
	// 剪切板相关
	READ_CLIPBOARD: () => ipcRenderer.invoke(IPC_CHANNEL.READ_CLIPBOARD),

	// 权限相关
	// 录屏、辅助功能权限检测
	PERMISSION_ACTIVE: () => ipcRenderer.invoke(IPC_CHANNEL.PERMISSION_ACTIVE),
	// 前往权限授予界面
	OPEN_SETTINGS_SECURITY: (target: '' | 'ScreenCapture' | 'Accessibility' = '') => ipcRenderer.send(IPC_CHANNEL.OPEN_SETTINGS_SECURITY, target),
};

export {
	IPC_CHANNEL,
	ipc
}