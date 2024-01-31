// 文件说明： common.ts 工具函数库
import activeWindow from 'active-win';

const isMac = process.platform === 'darwin';

/**
 * 两数组比较，包含数组顺序的比较
 * @param arrays
 */
function arrEqual(...arrays: string[][]): boolean {
  // 检查是否提供了至少两个数组
  if (arrays.length < 2) {
    throw new Error('至少需要提供两个数组进行比较');
  }

  // 检查所有数组的长度是否相等
  const firstArrayLength = arrays[0].length;
  if (!arrays.every((array) => array.length === firstArrayLength)) {
    return false;
  }

  // 使用every函数比较数组元素
  return arrays.every((array) => array.every((value, i) => value === arrays[0][i]));
}

/**
 * 检测录屏以及辅助功能权限是否已打开
 */
async function getActivePermission() {
  try {
    await activeWindow()
    return {
      permission: true,
      accessibility: true,
      screenRecording: true
    }
  } catch (e) {
    const stdout = (e as unknown as { stdout: string }).stdout;
    const accessibilityError = stdout.indexOf('Accessibility') === -1;
    const screenError = stdout.indexOf('Screen Recording”') === -1;
    return {
      permission: false,
      accessibility: accessibilityError,
      screenRecording: screenError
    }
  }
}

export {
  isMac,
  arrEqual,
  getActivePermission,
};
