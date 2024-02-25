import { type ClipboardHistory } from './clipboard';
import { ipcRenderer } from 'electron';

declare global {
  const ipc: {
    // 剪切板相关
    READ_CLIPBOARD: () => Promise<ClipboardHistory[]>;
    LOAD_CLIPBOARD: () => Promise<ClipboardHistory[]>;
    WRITE_CLIPBOARD: (history: ClipboardHistory) => Promise<void>;
    // 权限相关
    PERMISSION_ACTIVE: () => Promise<{
      permission: boolean;
      accessibility?: boolean;
      screenRecording?: boolean;
    }>;
    // 打开权限设置页面，仅支持Mac
    OPEN_SETTINGS_SECURITY: (target?: '' | 'ScreenCapture' | 'Accessibility') => void;
    // 通过AppPath获取存放ICON的路径
    APP_ICON_PATH: (appPath: string) => Promise<string>;
    // 获取文件服务器地址
    FILE_SERVER_HOST: () => Promise<string>;
  };
}
enum IPC_CHANNEL {
  READ_CLIPBOARD = 'CHANNEL_READ_CLIPBOARD',
  LOAD_CLIPBOARD = 'CHANNEL_LOAD_CLIPBOARD',
  WRITE_CLIPBOARD = 'CHANNEL_WRITE_CLIPBOARD',
  PERMISSION_ACTIVE = 'CHANNEL_PERMISSION_ACTIVE',
  OPEN_SETTINGS_SECURITY = 'CHANNEL_OPEN_SECURITY_PRIVACY_SETTINGS',
  APP_ICON_PATH = 'CHANNEL_APP_ICON_PATH',
  FILE_SERVER_HOST = 'CHANNEL_FILE_SERVER_HOST'
}

const ipc = {
  // 剪切板相关
  READ_CLIPBOARD: () => ipcRenderer.invoke(IPC_CHANNEL.READ_CLIPBOARD),
  LOAD_CLIPBOARD: () => ipcRenderer.invoke(IPC_CHANNEL.LOAD_CLIPBOARD),
  WRITE_CLIPBOARD: () => ipcRenderer.invoke(IPC_CHANNEL.WRITE_CLIPBOARD),
  // 权限相关
  // 录屏、辅助功能权限检测
  PERMISSION_ACTIVE: () => ipcRenderer.invoke(IPC_CHANNEL.PERMISSION_ACTIVE),
  // 前往权限授予界面
  OPEN_SETTINGS_SECURITY: (target: '' | 'ScreenCapture' | 'Accessibility' = '') => ipcRenderer.send(IPC_CHANNEL.OPEN_SETTINGS_SECURITY, target),
  APP_ICON_PATH: (appPath: string) => ipcRenderer.invoke(IPC_CHANNEL.APP_ICON_PATH, appPath),
  FILE_SERVER_HOST: () => ipcRenderer.invoke(IPC_CHANNEL.FILE_SERVER_HOST),
};

export { IPC_CHANNEL, ipc };
