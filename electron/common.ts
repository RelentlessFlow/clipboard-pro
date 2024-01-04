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

export { arrEqual };
