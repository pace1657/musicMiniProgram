/**
 * 生成节流函数
 * @param {function} fn 原函数
 * @param {number} interval 时间间隔
 * @param {object} options 其他参数(是否首次执行, 是否最终执行, 回调函数)
 */
export default function throttle(fn, interval, options = { leading: true, trailing: false, resultCallback: null }) {
  let { leading, trailing, resultCallback } = options;
  let invokeTime = 0;
  let timer = null;

  const _throttle = function(...args) {
      return new Promise((resolve, reject) => {
          let nowTime = new Date().getTime();
          if (!invokeTime && !leading) invokeTime = nowTime;
          let remainTime = interval - (nowTime - invokeTime);
          if (remainTime <= 0) {
              if (timer) {
                  clearTimeout(timer);
                  timer = null;
              }
              const result = fn.apply(this, args);
              if (resultCallback) resultCallback(result);
              resolve(result);
              invokeTime = nowTime;
              return;
          }
          if (trailing && !timer) {
              timer = setTimeout(() => {
                  const result = fn.apply(this, args);
                  if (resultCallback) resultCallback(result);
                  resolve(result);
                  invokeTime = !leading? 0: new Date().getTime();
                  timer = null;
              }, remainTime);
          }
      });
  }

  _throttle.cancel = function() {
      if (timer) clearTimeout(timer);
      timer = null;
      invokeTime = 0;
  }

  return _throttle;
}