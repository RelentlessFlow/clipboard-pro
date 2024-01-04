import React from 'react';

function App() {
	const handleClick = async () => {
		const clipBoard = await ipc.IPC_READ_CLIPBOARD();
		console.log(clipBoard);
	};

	return (
		<div>
			<input />
			<button onClick={handleClick}>读取剪切板</button>
			<button>复制到剪切板</button>
			<div>当前剪切板内容</div>
		</div>
	);
}

export default App;
