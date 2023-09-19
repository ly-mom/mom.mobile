// 计算字符数量
export function getBLen(str) {
  if (!str) return 0
  let len = 0
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len += 1.5
    } else {
      len += 2
    }
  }
  return len
}

/**
 * @msg: 根据参数名获取get请求url中对应的参数值
 * @param {*} url url
 * @param {*} queryName 参数名
 * @return {*} 参数值
 */
export function getQueryValue(url, queryName) {
  const query = url.split('?')[1]
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] == queryName) {
      return pair[1]
    }
  }
  return null
}

/**
 * @msg: 将url参数转换成object
 * @param {*} url
 * @return {*} JSON对象
 */
export function getQuery(url) {
  const obj = {}
  let keyvalue = []
  let key = '',
    value = ''
  const paraString = url.substring(url.indexOf('?') + 1, url.length).split('&')
  for (const i in paraString) {
    keyvalue = paraString[i].split('=')
    key = keyvalue[0]
    value = keyvalue[1]
    obj[key] = value
  }
  return obj
}
