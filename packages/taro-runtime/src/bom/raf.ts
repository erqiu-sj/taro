import { isUndefined, isFunction } from '@tarojs/shared'

// https://github.com/myrne/performance-now
export let now

(function () {
  let loadTime
  if (performance && performance.now) {
    now = function () {
      return performance.now()
    }
  } else if (Date.now) {
    now = function () {
      return Date.now() - loadTime
    }
    loadTime = Date.now()
  } else {
    now = function () {
      return new Date().getTime() - loadTime
    }
    loadTime = new Date().getTime()
  }
})()

let lastTime = 0

// https://gist.github.com/paulirish/1579671
// https://gist.github.com/jalbam/5fe05443270fa6d8136238ec72accbc0
let raf = isFunction(requestAnimationFrame) ? requestAnimationFrame : function (callback) {
  const _now = now()
  const nextTime = Math.max(lastTime + 16, _now) // First time will execute it immediately but barely noticeable and performance is gained.
  return setTimeout(function () { callback(lastTime = nextTime) }, nextTime - _now)
}

let caf = isFunction(cancelAnimationFrame) ? cancelAnimationFrame : clearTimeout

if (!isUndefined(global)) {
  raf = raf.bind(global)
  caf = caf.bind(global)
}

export {
  raf,
  caf
}
