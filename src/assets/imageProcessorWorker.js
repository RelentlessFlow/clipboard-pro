// imageProcessor.js

// 辅助函数：RGB 转十六进制颜色
function rgbToHex(rgb) {
  return '#' + rgb.map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// 将十六进制颜色表示形式转换为 RGB 数组
function hexToRgb(hex) {
  // 去除 # 符号（如果有）
  hex = hex.replace(/^#/, '');
  // 将颜色值拆分成 R、G、B 分量
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // 返回 RGB 数组
  return [r, g, b];
}

// 将 RGB 数组转换为 HSL 数组
function rgbToHsl(rgb) {
  // 将 RGB 分量值归一化到 [0, 1] 范围
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  // 计算色相（H）
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  if (max !== min) {
    if (max === r) {
      h = (g - b) / (max - min);
    } else if (max === g) {
      h = 2 + (b - r) / (max - min);
    } else {
      h = 4 + (r - g) / (max - min);
    }
    h *= 60; // 转换为度数
    if (h < 0) {
      h += 360; // 将负值转换为正值
    }
  }
  // 计算亮度（L）
  const l = (max + min) / 2;
  // 计算饱和度（S）
  let s = 0;
  if (max !== min) {
    s = (l <= 0.5) ? (max - min) / (max + min) : (max - min) / (2 - max - min);
  }
  // 返回 HSL 数组
  return [h, s, l];
}

function getMainColor(data) {
  const colorMap = {};

  // 计算颜色频率
  for (let i = 0; i < data.length; i += 4) {
    const rgb = [data[i], data[i + 1], data[i + 2]];
    const hex = rgbToHex(rgb);
    colorMap[hex] = (colorMap[hex] || 0) + 1;
  }

  // 排除过于黑暗或过于明亮的颜色
  const filteredColors = Object.keys(colorMap).filter(hex => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb);
    const luminanceThreshold = 0.2; // 可根据实际需求调整阈值
    return hsl[2] > luminanceThreshold && hsl[2] < 1 - luminanceThreshold;
  });

  // 根据颜色频率排序
  const sortedColors = filteredColors.sort((a, b) => colorMap[b] - colorMap[a]);
  // 返回主题色
  return sortedColors[0];
}

function getContrastTextColor(hexColor) {
  // Convert hex color to RGB
  let r = parseInt(hexColor.substring(1, 3), 16);
  let g = parseInt(hexColor.substring(3, 5), 16);
  let b = parseInt(hexColor.substring(5, 7), 16);
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  // Choose white or black depending on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

function getContrastColor(hexColor) {
  // Convert hex color to RGB
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  // Calculate the inverse of the RGB values
  const inverseR = 255 - r;
  const inverseG = 255 - g;
  const inverseB = 255 - b;
  // Choose the maximum inverse value to emphasize color contrast
  const maxInverse = Math.max(inverseR, inverseG, inverseB);
  // Calculate the scaling factor to preserve the relative proportions of RGB values
  const scale = 255 / maxInverse;
  // Scale the inverse RGB values
  const contrastR = Math.round(inverseR * scale);
  const contrastG = Math.round(inverseG * scale);
  const contrastB = Math.round(inverseB * scale);
  // Convert RGB values to hex color
  return '#' +
    ('00' + contrastR.toString(16)).slice(-2) +
    ('00' + contrastG.toString(16)).slice(-2) +
    ('00' + contrastB.toString(16)).slice(-2);
}
// 当接收到主线程发送的消息时执行的函数
onmessage = async function(event) {
  try {
    const { canvas, image } = event.data;
    const ctx = canvas.getContext('2d');
    const imageBlob = await fetch(image).then(r => r.blob());
    const imageBitmap = await createImageBitmap(imageBlob);
    ctx.drawImage(imageBitmap, 0,0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const mainColor = getMainColor(imageData.data)
    const textColor = getContrastTextColor(mainColor);
    const contrastColor = getContrastColor(mainColor)
    // return image color
    postMessage({
      image,
      mainColor,
      textColor,
      contrastColor,
    });
  } catch (error) {
    postMessage(error);
  }
};
