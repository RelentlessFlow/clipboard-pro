import * as fs from 'fs';
import path from 'path';

function getFileSuffix(filePath: string): string {
  return path.extname(filePath).slice(1);
}

function getFileSize(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) reject(err);
      else {
        // 获取文件大小，单位为字节
        resolve(stats.size);
      }
    });
  });
}

function getFileName(filePath: string): string {
  const parts = filePath.split('/');
  return parts[parts.length - 1]; // 获取文件名部分
}

function getFileSizeSync(filePath: string): number {
  try {
    // 使用 fs.statSync() 同步方法获取文件信息
    const stats = fs.statSync(filePath);
    // 获取文件大小，单位为字节
    return stats.size;
  } catch (err) {
    // 处理错误
    console.error('Error:', err);
    return -1; // 或者抛出异常
  }
}

export { getFileSuffix, getFileSize, getFileName, getFileSizeSync };
