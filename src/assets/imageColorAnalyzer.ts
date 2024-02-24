
// 辅助函数：RGB 转十六进制颜色
function rgbToHex(rgb: number[]): string {
  return '#' + rgb.map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// 提取图片主要颜色
function analyzeImage(image: string): Promise<{ image: string, mainColor: string, textColor: string, contrastColor: string }> {
  const workerUrl = './assets/imageProcessorWorker.js';
  return new Promise((resolve, reject) => {
    try {
      const canvas = new OffscreenCanvas(100, 100);
      const worker = new Worker(workerUrl);
      worker.postMessage({ canvas, image }, [canvas]);
      worker.onmessage = (event) => {
        resolve(event.data);
      };
    } catch (error) {
      reject(error);
    }

  });


}


export {
  rgbToHex,
  analyzeImage
}