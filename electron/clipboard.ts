import { betterClipboard } from 'better-clipboard';
import { clipboard } from 'electron';
import { clearInterval } from 'timers';
import { arrEqual } from './common';
import dayjs, { Dayjs } from "dayjs";
import activeWindow from 'active-win'

type Type = 'BUFFER' | 'TEXT' | 'IMAGE' | 'NULL' | string;

type Content = string[];

interface Clipboard {
	type: 'BUFFER' | 'TEXT' | 'IMAGE' | 'NULL' | string;
	content: string[];
}

interface ClipboardHistory extends Clipboard {
	copyTime: Dayjs;
	owner: {
		platform: 'macos' | 'linux' | 'windows',
		path: string, // '/Applications/WebStorm.app',
		name: string, // 'WebStorm'
		bundleId: string, // only support mac
	};
}

const readClipboard: () => Clipboard = () => {
	const buffers = betterClipboard.readFilePathList();
	const text = clipboard.readText();
	const image = clipboard.readImage('clipboard').toDataURL();

	let type: Type = 'NULL';
	let content: Content = [];

	if (buffers.length > 0) {
		type = 'BUFFER';
		content = buffers;
	} else if (text) {
		type = 'TEXT';
		content = [text];
	} else if (image) {
		type = 'IMAGE';
		content = [image];
	}

	return { type, content };
};

const isClipboardEqual = (clipboard: Clipboard, histories: Clipboard[]) => {
	const latest = histories[histories.length - 1];
	if (!latest) return false;

	const isEqualType = clipboard.type === latest?.type;
	const isEqualContent = arrEqual(clipboard.content, latest?.content);

	return isEqualType && isEqualContent;
};

class ClipboardManager {
	private interval: number | undefined;

	private histories: ClipboardHistory[] = [];

	private updateHistories = async () => {
		const latest = readClipboard();
		// 检测新的剪切板内容时，保存新的剪切板内容
		if (latest.type !== 'NULL' && !isClipboardEqual(latest, this.histories)) {

			// 获取前台应用信息
			const active = await activeWindow()
			if(active) {
				const newHistory: ClipboardHistory = {
					...latest,
					owner: {
						platform: active.platform,
						path: active.owner.path,
						name: active.owner.name,
						bundleId: (active.owner as { bundleId: string }).bundleId
					},
					copyTime: dayjs(),
				}

				// 提交剪切板历史记录
				this.histories.push(newHistory);
			}
		}
	}

	subscribeClipboard = () => {
		(this.interval as unknown) = setInterval(() => {
			this.updateHistories();
		}, 500);
	};

	unSubscribeClipboard = () => {
		clearInterval(this.interval);
	};

	getClipboard = () => {
		return this.histories;
	};

	static getInstance() {
		return new ClipboardManager();
	}
}

export { ClipboardManager };

export type { Type, Content, ClipboardHistory };
