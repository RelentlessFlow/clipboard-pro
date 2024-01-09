import React from 'react';
import Title from './Title';
import { ThemeProvider } from './context/theme.context';

function App() {
	const handleClick = async () => {
		const clipBoard = await ipc.READ_CLIPBOARD();
		console.log(clipBoard);
	};

	const handlePermission = async () => {
		const permission = await ipc.PERMISSION_ACTIVE();
		if (!permission.permission && !permission.accessibility)
			ipc.OPEN_SETTINGS_SECURITY('Accessibility');
		if (!permission.permission && !permission.screenRecording)
			ipc.OPEN_SETTINGS_SECURITY('ScreenCapture');
	};

	return (
		<>
			<ThemeProvider>
				<div>
					<input />
					<button onClick={handleClick}>读取剪切板</button>
					<button>复制到剪切板</button>
					<div>当前剪切板内容</div>
					<div onClick={handlePermission}>权限检测</div>

					<Title />
				</div>
			</ThemeProvider>
		</>
	);
}

export default App;
