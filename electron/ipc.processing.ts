import { ipcMain, shell } from 'electron';
import { CHistoryManager, type ClipboardHistory } from './clipboard';
import { IPC_CHANNEL } from './ipc.bridge';
import { getActivePermission, isMac } from './assets/common';
import { getAppIconPath } from './assets/icon';
import { Constant } from './assets/constant';

// 获取剪切板内容
const ipcReadClipboards = (manager: CHistoryManager) => {
  ipcMain.handle(IPC_CHANNEL.READ_CLIPBOARD, () => {
    if (!manager) return [];
    return manager.getHistories();
  });
};

const ipcWriteClipboards = (manager: CHistoryManager) => {
  if (!manager) return [];
  ipcMain.on(IPC_CHANNEL.WRITE_CLIPBOARD, (_, history: ClipboardHistory) => {
    return manager.historiesToClipBoards(history);
  })
}


// 录屏、辅助功能检测
const ipcPermissionDetect = () => {
  ipcMain.handle(IPC_CHANNEL.PERMISSION_ACTIVE, () => {
    return getActivePermission();
  });
};

// 打开权限设置界面
const ipcOpenSettingsSecurity = () => {
  if (!isMac) return;
  ipcMain.on(IPC_CHANNEL.OPEN_SETTINGS_SECURITY, async (_, args: '' | 'ScreenCapture' | 'Accessibility' = '') => {
    const url = 'x-apple.systempreferences:com.apple.preference.security?Privacy_' + args;
    await shell.openExternal(url);
  });
};

const ipcAppIconPath = () => {
  ipcMain.handle(IPC_CHANNEL.APP_ICON_PATH, (_, appPath: string) => {
    return "http://" + getAppIconPath(appPath);
  });
}

const ipcFileServerHost = () => {
  ipcMain.handle(IPC_CHANNEL.FILE_SERVER_HOST, () => {
    return 'http://' + Constant.EXPRESS_HOST;
  });
}

export {
  ipcReadClipboards,
  ipcWriteClipboards,
  ipcPermissionDetect,
  ipcOpenSettingsSecurity,
  ipcAppIconPath,
  ipcFileServerHost
};
