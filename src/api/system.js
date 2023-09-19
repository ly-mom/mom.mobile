import request from '../common/request.js'

// 登录
export const SubmitLogin = data =>
  request({
    url: '/Base/home/SubmitLogin',
    method: 'post',
    data,
  })

// 获取用户信息
export const GetInfo = data =>
  request({
    url: '/Base/home/GetInfo',
    method: 'get',
    data,
  })

// 登出
export const Logout = data =>
  request({
    url: '/Base/home/Logout',
    method: 'post',
    data,
  })

// 获取多语言
export const GetLangResource = data =>
  request({
    url: '/Base/Language/GetLangResource?lang=zh-CN',
    method: 'get',
    data,
  })

// 获取多个字典数据
export function getMutilDicts(list) {
  return request({
    url: '/Base/Dictionary/GetDicData',
    method: 'post',
    data: { DicKeys: list, time: new Date().getTime() },
    headers: {
      unDebounce: true,
    },
  })
}
