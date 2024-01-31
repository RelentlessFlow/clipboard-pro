import * as fs from 'fs';
import path from "path";
import {Constant} from "./constant";

const BASE64BLOCK = 'data:image/png;base64,';

const SAVE_PATH = Constant.DIR_STATIC;

// 将Base64数据解码成二进制数据
function decodeBase64(base64Data: string): Buffer {
	const base64Buffer = base64Data.replace(/^data:image\/\w+;base64,/, '')
	return Buffer.from(base64Buffer, 'base64');
}

function saveBase64ToFile(base64Data: string, fileName: string, fileFolder = '') {
	const decodedData = decodeBase64(base64Data);
	const dirPath = path.join(SAVE_PATH, '.file_save', fileFolder);
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, {recursive: true});
	}
	const pathOrFile = path.join(dirPath, fileName)
	fs.writeFileSync(pathOrFile, decodedData);
	return {
		file: pathOrFile,
		size: decodedData.length
	};
}

// 获取Base64文件摘要（前50个字符串）
function getBase64Brief(base64Data: string, long = 50) {
	return base64Data.substring(BASE64BLOCK.length, long)
}

export {
	SAVE_PATH,
	BASE64BLOCK,
	decodeBase64,
	saveBase64ToFile,
	getBase64Brief,
}