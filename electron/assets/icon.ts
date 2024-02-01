import path from 'path';
import fs from 'fs';
import icns from 'electron-icns-ex';
import { Constant } from './constant';

/**
 * 获取App图标保存的路径，仅支持MacOS
 * @param appPath App存放的路径
 */
function getAppIconSavePath(appPath: string): string {
	const appName = appPath.substring(appPath.lastIndexOf('/') + 1, appPath.lastIndexOf('.'));
	return path.join(Constant.SAVE_ICON_PATH, `${appName}.png`);
}

/**
 * 保存App图标，仅支持MacOS
 * @param appPath App存放的路径
 */
function saveAppIcon(appPath: string) {
	return new Promise<{
		origin: string;
		output: string;
	}>((resolve, reject) => {
		const iconFolder = path.join(appPath, 'Contents/Resources');
		try {
			fs.readdir(iconFolder, (err, files) => {
				if (err) reject(err);
				files.forEach(file => {
					const fileExt = path.extname(file);
					if (fileExt === '.icns') {
						const originFilePath = path.join(iconFolder, file);
						const outputFilePath = getAppIconSavePath(appPath);
						if (!fs.existsSync(Constant.SAVE_ICON_PATH)) fs.mkdirSync(Constant.SAVE_ICON_PATH, { recursive: true });
						icns.parseIcnsToPNG(originFilePath, outputFilePath);
						resolve({ origin: originFilePath, output: outputFilePath });
					}
				});
			});
		} catch (e) {
			reject(e);
		}
	});
}

export { getAppIconSavePath, saveAppIcon };
