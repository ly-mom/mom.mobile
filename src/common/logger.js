const isLogShow = process.env.NODE_ENV === 'development' || true

// 不同平台对 console 方法的支持存在差异，建议只用以下几个最基本的方法
export const logger = {
  info: function (tag, log) {
    if (isLogShow) {
      console.info('%c [INFO] ' + getCurrentTime() + '%c[' + tag + '] %c- ' + log, 'color:blue', 'color:green', 'color:black')
    }
  },
  warn: function (tag, log) {
    if (isLogShow) {
      console.warn('%c [WARN]' + getCurrentTime() + ' %c[' + tag + '] %c- ' + log, 'color:orange', 'color:green', 'color:black')
    }
  },
  error: function (tag, log) {
    if (isLogShow) {
      console.error('%c [ERROR]' + getCurrentTime() + ' %c[' + tag + '] %c- ' + log, 'color:red', 'color:green', 'color:black')
    }
  },
}

function getCurrentTime() {
  return new Date().getTime()
}
