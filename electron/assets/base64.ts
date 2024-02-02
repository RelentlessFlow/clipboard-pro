import * as fs from 'fs';
import path from 'path';
import { Constant } from './constant';

// 将Base64数据解码成二进制数据
function decodeBase64(base64Data: string): Buffer {
  const base64Buffer = base64Data.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64Buffer, 'base64');
}

function saveBase64ToFile(base64Data: string, fileName: string, fileFolder = '') {
  const decodedData = decodeBase64(base64Data);
  const dirPath = path.join(Constant.SAVE_CL_BASE64_PATH, fileFolder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const pathOrFile = path.join(dirPath, fileName);
  fs.writeFileSync(pathOrFile, decodedData);
  return {
    file: pathOrFile,
    size: decodedData.length,
  };
}

/**
 * 获取Base64文件摘要（前200个字符串）
 * @param base64Data Base64原数据
 * @param getPath 获取可用于文件名的摘要
 * @param long 摘要长度
 */
function getBase64Brief(base64Data: string, { getPath = false, long = 200 } = {}) {
  const base64Short = base64Data.substring(Constant.BASE64_BLOCK.length, long);
  return getPath ? base64Short.replace(/\//g, ':') : base64Short;
}

export { decodeBase64, saveBase64ToFile, getBase64Brief };
