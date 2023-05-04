/**
 * 生成防抖函数
 * @param {function} fn 原函数
 * @param {number} delay 时间间隔
 * @param {boolean} immediate 是否立即执行
 * @param {function} callBack 回调函数
 */
export default function debounce(fn, delay, immediate = true, callBack) {
  let timer = null;
  let isInvoke = immediate;
  const _debounce = function(...args) {
      return new Promise((resolve, reject) => {
          if (timer) clearTimeout(timer);
          if (isInvoke) {
              const result = fn.apply(this, args);
              if (callBack) callBack(result);
              resolve(result);
              isInvoke = false;
          } else {
              timer = setTimeout(() => {
                  const result = fn.apply(this, args);
                  if (callBack) callBack(result);
                  resolve(result);
                  isInvoke = true;
              }, delay);
          }
      });
  }

  _debounce.cancel = function() {
      if (timer) clearTimeout(timer);
      isInvoke = true;
  }

  return _debounce;
}