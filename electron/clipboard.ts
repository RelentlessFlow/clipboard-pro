import { betterClipboard } from 'better-clipboard';
import { clipboard } from 'electron';
import { clearInterval } from 'timers';
import dayjs, { Dayjs } from "dayjs";
import activeWindow from 'active-win'
import {BASE64BLOCK, getBase64Brief, saveBase64ToFile} from "./assets/base64";
import {getFileName, getFileSuffix} from './assets/file';

type Type = 'TEXT' | 'RTF' | 'HTML' | 'BUFFERS';

interface Clipboard {
	// 摘要，用于检索数据
	summary: '&base64' | string;
	// 剪切板内容
	contents: ClipboardContent[]
}

interface ClipboardContent {
	// 内容类型
	type: Type;
	// 具体内容
	text?: string
	// 文件路径
	buffers?: Array<{
		path: string;
		suffix: string;
	}>
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

const extractFileNames = (filePaths: string[]) => {
	const fileNames: string[] = filePaths.map(getFileName);
	return fileNames.join('; '); // 将文件名连接为一个字符串
}

const compareClipboards: (clipboard1: Clipboard, clipboard2: Clipboard) => boolean = (clipboard1, clipboard2) => {
	// 首先比较 summary
	if (clipboard1.summary !== clipboard2.summary) {
		return false;
	}

	// 比较 content 数组
	if (clipboard1.contents.length !== clipboard2.contents.length) {
		return false;
	}

	for (let i = 0; i < clipboard1.contents.length; i++) {
		const content1 = clipboard1.contents[i];
		const content2 = clipboard2.contents[i];

		// 比较 type
		if (content1.type !== content2.type) {
			return false;
		}

		// 比较 text
		if (content1.text !== content2.text) {
			return false;
		}

		// 比较 buffers 数组
		if (content1.buffers?.length !== content2.buffers?.length) {
			return false;
		}

		if (content1.buffers && content2.buffers) {
			for (let j = 0; j < content1.buffers.length; j++) {
				const buffer1 = content1.buffers[j];
				const buffer2 = content2.buffers[j];

				// 比较 path 和 suffix
				if (buffer1.suffix !== buffer2.suffix || buffer1.path !== buffer2.path) {
					return false;
				}
			}
		}
	}

	return true;
}

const readClipboard: (histories: ClipboardHistory[]) => Clipboard = (histories) => {

	interface ClipboardReader {
		readText: string;
		readRtf: string;
		readHtml: string;
		readImage: string;
		readBuffers: string[];
	}

	type ClipboardStrategy = (args: ClipboardReader) => Clipboard;

	const latestClipboard = histories[histories.length - 1];

	const readText = clipboard.readText();
	const readRtf = clipboard.readRTF();
	const readHtml = clipboard.readHTML();
	const readImage = clipboard.readImage('clipboard').toDataURL();
	const readBuffers = betterClipboard.readFilePathList();

	const textStrategy: ClipboardStrategy = ({ readText }) => ({
		summary: readText,
		contents: [{ type: 'TEXT', text: readText }]
	})

	const rtfStrategy: ClipboardStrategy = ({ readText, readRtf }) => ({
		summary: readText,
		contents: [{ type: 'RTF', text: readRtf }]
	})

	const htmlStrategy: ClipboardStrategy = ({ readText, readHtml }) => ({
		summary: readText,
		contents: [{ type: 'HTML', text: readHtml }]
	})

	const base64Strategy: ClipboardStrategy = ({ readImage }) => {
		const fileName= getBase64Brief(readImage) + '.png';
		const { file: fileSavePath} = saveBase64ToFile(readImage, fileName);
		return {
			summary: '&base64',
			contents: [{
				type: 'BUFFERS',
				buffers: [{
					path: fileSavePath,
					suffix: getFileSuffix(fileSavePath),
				}]
			}]
		}
	}

	const buffersStrategy: ClipboardStrategy = ({ readBuffers }) => ({
		summary: extractFileNames(readBuffers),
			contents: [{
			type: 'BUFFERS',
			buffers: readBuffers.map(path => ({
				path,
				suffix: getFileSuffix(path),
			}))
		}]
	})

	type ClipboardStrategySelectorConstructorArgs = ClipboardReader

	class ClipboardStrategySelector {

		private strategyMaps = {
			textStrategy,
			rtfStrategy,
			htmlStrategy,
			base64Strategy,
			buffersStrategy
		}

		private executeStrategy: ClipboardStrategy[] = []

		constructor(private readonly reader: ClipboardReader) {
			type strategyArray = Array<keyof typeof this.strategyMaps>
			const {readText, readRtf, readHtml, readImage, readBuffers } = reader
			const isBaseText = !!readText
				&& readBuffers.length === 0
				&& (!latestClipboard || latestClipboard.summary !== readText);
			const isBase64 =
				!readText
				&& readBuffers.length === 0
				&& readImage !== BASE64BLOCK
				&& (!latestClipboard || !(
					latestClipboard.summary === '&base64'
					&& latestClipboard.contents.length === 1
					&& latestClipboard.contents[0].buffers
					&& latestClipboard.contents[0].buffers.length === 1
					&& getFileName(latestClipboard.contents[0].buffers[0].path) === getBase64Brief(readImage)
				))
			const isBuffers = !!readText
				&& readBuffers.length > 0
				&& readImage === BASE64BLOCK
				&& (!latestClipboard || (extractFileNames(readBuffers) !== latestClipboard.summary))
			const strategyPassed: strategyArray = [
				(isBaseText && !readRtf && !readHtml) ? 'textStrategy' : undefined,
				(isBaseText && !!readRtf) ? 'rtfStrategy' : undefined,
				(isBaseText && !!readHtml) ? 'htmlStrategy' : undefined,
				isBase64 ? 'base64Strategy' : undefined,
				isBuffers ? 'buffersStrategy': undefined
			].filter(item => !!item) as strategyArray;
			this.executeStrategy.push(...strategyPassed.map(strategy => this.strategyMaps[strategy]));
		}

		execute() {
			const clipboards = this.executeStrategy.map(strategy => strategy(this.reader));
			return clipboards.reduce((previousValue, currentValue) => ({
				summary: currentValue.summary !== '' ? currentValue.summary : previousValue.summary,
				contents: [...previousValue.contents, ...currentValue.contents]
			}), { summary: '', contents: [] });
		}

		static getInstance(args: ClipboardStrategySelectorConstructorArgs) {
			return new ClipboardStrategySelector(args)
		}
	}

	return ClipboardStrategySelector.getInstance({
		readText, readRtf, readHtml, readImage, readBuffers
	}).execute()
};

const isClipboardEqual = (clipboard: Clipboard, histories: Clipboard[]) => {
	const latest = histories[histories.length - 1];
	if (!latest) return false;

	return compareClipboards(clipboard, latest);
};

class ClipboardManager {
	private interval: number | undefined;

	private histories: ClipboardHistory[] = [];

	private updateHistories = async () => {
		const latest = readClipboard(this.histories);
		// 检测新的剪切板内容时，保存新的剪切板内容
		if (latest.contents.length > 0 && !isClipboardEqual(latest, this.histories)) {

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
		(this.interval as unknown) = setInterval(async () => {
			await this.updateHistories();
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

export type { ClipboardHistory };
