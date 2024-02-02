import { Menu, BrowserWindow } from 'electron';

const isMac = process.platform === 'darwin';

function createMenu(window: BrowserWindow) {
  const menu = Menu.buildFromTemplate([
    {
      label: '菜单',
      submenu: [
        {
          label: '打开新窗口',
          click: () => new BrowserWindow({ width: 800, height: 600 }).loadURL('https://baidu.com'),
          accelerator: 'CommandOrControl+n',
        },
        {
          // 主进程向渲染进程发送消息
          label: '增加',
          click: () => window.webContents.send('CHANNEL_INCREMENT', 1),
        },
      ],
    },
    {
      type: 'separator',
    },
    isMac ? { label: '关闭', role: 'close' } : { role: 'quit' },
  ]);

  Menu.setApplicationMenu(menu);
}

export { createMenu };
