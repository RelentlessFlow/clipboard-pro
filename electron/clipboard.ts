import { betterClipboard } from 'better-clipboard';
import { clipboard } from 'electron';
import { clearInterval } from 'timers';
import activeWindow from 'active-win';
import { Dayjs } from 'dayjs';
import { getBase64Brief, saveBase64ToFile } from './assets/base64';
import { getFileName, getFileSuffix } from './assets/file';
import * as repository from './repository';
import { type ClipboardSummary, Constant } from './assets/constant';
import { getAppIconSavePath } from './assets/icon';

// 剪切板内容类型
type ContentType = 'RTF' | 'HTML' | 'BUFFERS' | 'BASE64' | string;
// 剪切板记录
interface Clipboard {
  // 摘要，用于检索数据
  summary: ClipboardSummary;
  // 剪切板内容
  contents: ClipboardContent[];
  type: ContentType[],
  [key: string]: unknown;
}
// 剪切板记录的具体内容
interface ClipboardContent {
  // 内容类型
  type: ContentType;
  // 具体内容
  text?: string | null;
  // 文件路径
  buffers?: Array<{
    path: string;
    suffix: string;
    [key: string]: unknown;
  }>;

  [key: string]: unknown;
}
// 剪切板历史记录
interface ClipboardHistory extends Clipboard {
  copyTime: Date | Dayjs | unknown;
  owner: {
    platform: 'macos' | 'linux' | 'windows' | string;
    path: string; // '/Applications/WebStorm.app',
    name: string; // 'WebStorm'
    bundleId?: string | null; // only support mac
    icon: string;
  };
}
// 剪切板内容解析对象
interface ClipboardReader {
  readText: string;
  readRtf: string;
  readHtml: string;
  readImage: string;
  readBuffers: string[];
}
// 剪切板内容解析策略
interface ClipboardStrategy {
  (args: ClipboardReader): Clipboard;
}

// 当剪切板内容对Buffers时，将文件路径进行拼接
const extractFileNames = (filePaths: string[]) => {
  const fileNames: string[] = filePaths.map(getFileName);
  return fileNames.join('; '); // 将文件名连接为一个字符串
};

// 将两个剪切板历史记录 中的内容进行比较
const compareClipboards: (clipboard1: Clipboard, clipboard2: Clipboard) => boolean = (clipboard1, clipboard2) => {
  // 首先比较 summary
  if (clipboard1.summary !== clipboard2.summary) return false;
  // 比较 content 数组
  if (clipboard1.contents.length !== clipboard2.contents.length) return false;

  for (let i = 0; i < clipboard1.contents.length; i++) {
    const content1 = clipboard1.contents[i];
    const content2 = clipboard2.contents[i];
    // 比较 type
    if (content1.type !== content2.type) return false;
    // 比较 text
    if (content1.text !== content2.text) return false;
    // 比较 buffers 数组
    if (content1.buffers?.length !== content2.buffers?.length) return false;
    if (content1.buffers && content2.buffers) {
      for (let j = 0; j < content1.buffers.length; j++) {
        const buffer1 = content1.buffers[j];
        const buffer2 = content2.buffers[j];
        // 比较 path 和 suffix
        if (buffer1.suffix !== buffer2.suffix || buffer1.path !== buffer2.path) return false;
      }
    }
  }

  return true;
};

// 读取当前剪切板内容，如果内容与最后一次存储的内容不同，更新剪切板历史记录
const readClipboard: (histories: ClipboardHistory[]) => Clipboard = histories => {
  const latestClipboard = histories[histories.length - 1];
  const readText = clipboard.readText();
  const readHtml = clipboard.readHTML();
  const readRtf = clipboard.readRTF();
  const readImage = clipboard.readImage('clipboard').toDataURL();
  const readBuffers = betterClipboard.readFilePathList();

  // 根据剪切板内容类型的不同执行不同的策略
  const htmlStrategy: ClipboardStrategy = ({ readText, readHtml }) => ({
    summary: readText,
	  type: ['HTML'],
    contents: [{ type: 'HTML', text: readHtml }],
  });

  const rtfStrategy: ClipboardStrategy = ({ readText, readRtf }) => ({
    summary: readText,
	  type: ["RTF"],
    contents: [{ type: 'RTF', text: readRtf }],
  });

  const base64Strategy: ClipboardStrategy = ({ readImage }) => {
    const fileName = getBase64Brief(readImage, { getPath: true }) + '.png';
    const { file: fileSavePath } = saveBase64ToFile(readImage, fileName);
    return {
      summary: Constant.CLIPBOARD_SUMMARY_BASE64,
	    type: ['BASE64'],
      contents: [
        {
          type: 'BASE64',
          buffers: [
            {
              path: fileSavePath,
              suffix: getFileSuffix(fileSavePath),
            },
          ],
        },
      ],
    };
  };

  const buffersStrategy: ClipboardStrategy = ({ readBuffers }) => ({
    summary: extractFileNames(readBuffers),
	  type: ['BUFFERS'],
    contents: [
      {
        type: 'BUFFERS',
        buffers: readBuffers.map(path => ({
          path,
          suffix: getFileSuffix(path),
        })),
      },
    ],
  });

	// 每一种策略的共同参数
	type ClipboardStrategySelectorConstructorArgs = ClipboardReader;

	// 策略选择器
	class ClipboardStrategySelector {

	  // 已知策略
	  private preStrategyMap = {
	    rtfStrategy,
	    htmlStrategy,
	    base64Strategy,
	    buffersStrategy,
	  };

	  // 需要执行的策略
	  private executeStrategies: ClipboardStrategy[] = [];

	  // 构造函数，主要是根据剪切板历史记录的不同，筛选出合适策略，放到executeStrategies里，最后用execute函数去执行策略
	  constructor(private readonly reader: ClipboardReader) {
			type preStrategies = Array<keyof typeof this.preStrategyMap>;
			const { readText, readHtml, readRtf, readImage, readBuffers } = reader;

		  const htmlSelector = readText
			  && readHtml
			  && readImage === Constant.BASE64_BLOCK
			  && readBuffers.length === 0
			  && (!latestClipboard || (
				  readText !== latestClipboard.summary
			  ))

			const rtfSelector = readText
				&& readRtf
				&& readImage === Constant.BASE64_BLOCK
				&& readBuffers.length === 0
				&& (!latestClipboard || (
				  latestClipboard.summary !== readText
				))
		  
			const base64Selector = !readText
				&& readBuffers.length === 0
				&& readImage !== Constant.BASE64_BLOCK
				&& (!latestClipboard ||
					!(
					  latestClipboard.summary === Constant.CLIPBOARD_SUMMARY_BASE64 &&
						latestClipboard.contents.length === 1 &&
						latestClipboard.contents[0].buffers &&
						latestClipboard.contents[0].buffers.length === 1 &&
						getFileName(latestClipboard.contents[0].buffers[0].path) === getBase64Brief(readImage, { getPath: true })
					));

			const buffersSelector = readBuffers.length > 0
				&& (!latestClipboard ||
					extractFileNames(readBuffers) !== latestClipboard.summary
				);

			const strategiesPassed: preStrategies = [
			  htmlSelector ? 'htmlStrategy' : undefined,
			  rtfSelector ? 'rtfStrategy' : undefined,
			  base64Selector ? 'base64Strategy' : undefined,
			  buffersSelector ? 'buffersStrategy' : undefined,
			].filter(item => !!item) as preStrategies;

			this.executeStrategies.push(...strategiesPassed.map(strategy => this.preStrategyMap[strategy]));
	  }

	  // 执行策略，返回每种策略的执行结果
	  // 举个例子：如果同时存在rtf和html，则将剪切板中的RTF和HTML内容都返回，summary是HTML里的内容
	  execute() {
	    const clipboards = this.executeStrategies.map(strategy => strategy(this.reader));
	    return clipboards.reduce(
	      (previousValue, currentValue) => ({
	        summary: currentValue.summary !== '' ? currentValue.summary : previousValue.summary,
		      type: [...previousValue.type, ...currentValue.type],
	        contents: [...previousValue.contents, ...currentValue.contents],
	      }),
	      { summary: '', contents: [], type: [] },
	    );
	  }

	  // 这个策略选择器，实际上就是个函数，这里用class去写，增强一些封装性
	  static getInstance(args: ClipboardStrategySelectorConstructorArgs) {
	    return new ClipboardStrategySelector(args);
	  }
	}

	return ClipboardStrategySelector.getInstance({
	  readText,
	  readRtf,
	  readHtml,
	  readImage,
	  readBuffers,
	}).execute();
};

// 将任意数据写入系统剪切板
const writeClipboard = ({type, ct} : {
  type: ContentType,
  ct: string | string[]
}) => {
  if (type !== 'BUFFERS' && typeof ct !== 'string') return;
  if (type === 'BUFFERS' && !Array.isArray(ct)) return;
  switch (type) {
    case 'HTML':
      clipboard.writeHTML(ct as string);
      break;

    case 'RTF':
      clipboard.writeRTF(ct as string);
      break;

    case 'BASE64':
      clipboard.writeImage(Electron.NativeImage.createFromPath(ct as string));
      break;

    case 'BUFFERS':
      betterClipboard.writeFileList(ct as string[])
	    break;
  }
}

// 将最新的剪切板记录与历史记录进行比较（辅助函数）
const isClipboardEqual = (clipboard: Clipboard, histories: Clipboard[]) => {
  const latest = histories[histories.length - 1];
  if (!latest) return false;
  return compareClipboards(clipboard, latest);
};

// 剪切板管理器
class CHistoryManager {
  private status: 'init' | 'ready' | 'active' | 'inactive' = 'init';
  private interval: number | undefined;
  private histories: ClipboardHistory[] = [];
  // 更新新的历史记录
  private updateHistories = async () => {
    const latest = readClipboard(this.histories);
    // 检测新的剪切板内容时，保存新的剪切板内容
    if (latest.contents.length > 0 && !isClipboardEqual(latest, this.histories)) {
      // 获取前台应用信息
      const active = await activeWindow();
      if (active) {
        const newHistory: ClipboardHistory = {
          ...latest,
          owner: {
            platform: active.platform,
            path: active.owner.path,
            name: active.owner.name,
            bundleId: (active.owner as { bundleId: string }).bundleId,
            icon: getAppIconSavePath(active.owner.path),
          },
          copyTime: new Date(),
        };

        void repository.createClipboard(newHistory);
        // 提交剪切板历史记录
        this.histories.push(newHistory);
      }
    }
  };
  // 激活剪切板监听
  activate = () => {
    if (!(this.status === 'ready' || this.status === 'inactive')) return;
    (this.interval as unknown) = setInterval(async () => {
      await this.updateHistories();
    }, 500);
    this.status = 'active';
  };
  // 关闭剪切板监听
  deactivate = () => {
    clearInterval(this.interval);
    this.status = 'inactive';
  };
	
  // 获取全部历史记录
  getHistories = () => {
    return this.histories;
  };

  // 加载更多历史记录
  loadMoreHistories = async () => {

    const cursorId = this.histories.length === 0
      ? undefined
      : this.histories[this.histories.length - 1].id as number

    const clipboards = await repository.getClipboards({
      pageSize: 100,
      cursorId
    });

    this.histories.concat(clipboards);
  }

  // 复制到剪切板
  historiesToClipBoards = (history: ClipboardHistory) => {
    const clipBoards = history.type.map(type => {
      const writeClipboardArg: Parameters<typeof writeClipboard>[0] = {
        ct: '', type: '',
      };

      if(type === 'BUFFERS') {
        const content = history.contents.find(item => item.type === 'BUFFERS')!;
        writeClipboardArg.ct = (content.buffers ?? []).map(item => item.path);
      }
      if(type !== 'BUFFERS') {
        const content = history.contents.find(item => item.type === type)!;
	      writeClipboardArg.ct = content.text!;
      }
	    return writeClipboardArg
    });

	  clipBoards.map(clipBoard => {
		  writeClipboard(clipBoard)
	  });
  }

  // 管理器初始化
  init = async () => {
    this.histories = [];
    this.status = 'ready';
  };

  // 获取管理器实例
  static getInstance() {
    return new CHistoryManager();
  }
}

export { CHistoryManager };
export type {
  ClipboardHistory,
  ContentType
};
