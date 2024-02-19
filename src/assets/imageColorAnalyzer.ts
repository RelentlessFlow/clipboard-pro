
// 辅助函数：RGB 转十六进制颜色
function rgbToHex(rgb: number[]): string {
  return '#' + rgb.map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// 提取图片主要颜色
function analyzeImage(imageUrl: string) {

  return new Promise<string>(resolve => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // 设置图片跨域
    img.src = imageUrl;
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get canvas context');
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const colorMap: { [hex: string]: number } = {};

      for (let i = 0; i < data.length; i += 4) {
        const rgb = [data[i], data[i + 1], data[i + 2]];
        const hex = rgbToHex(rgb);
        colorMap[hex] = (colorMap[hex] || 0) + 1;
      }

      const mainColor = Object.keys(colorMap).reduce((a, b) => colorMap[a]! > colorMap[b]! ? a : b);
      resolve(mainColor);
    };
  })
}


export {
  rgbToHex,
  analyzeImage
}