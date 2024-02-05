import React from 'react';
import Title from './Title';
import { ThemeProvider } from './context/theme.context';

function App() {
  const handleReadClipboard = async () => {
    const clipBoard = await ipc.READ_CLIPBOARD();
    console.dir(clipBoard, { depth: null });
  };

  const handleWriteClipboard = async () => {
    // void await ipc.WRITE_CLIPBOARD();
  }

  const handlePermission = async () => {
    const permission = await ipc.PERMISSION_ACTIVE();
    if (!permission.permission && !permission.accessibility) ipc.OPEN_SETTINGS_SECURITY('Accessibility');
    if (!permission.permission && !permission.screenRecording) ipc.OPEN_SETTINGS_SECURITY('ScreenCapture');
  };

  return (
    <>
      <ThemeProvider>
        <div>
          <input />
          <button onClick={handleReadClipboard}>读取剪切板</button>
          <button onClick={handleWriteClipboard}>复制到剪切板</button>
          <div>当前剪切板内容</div>
          <div onClick={handlePermission}>权限检测</div>

          <Title />
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
