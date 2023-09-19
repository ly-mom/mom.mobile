import axios from 'axios'
import _ from 'lodash'
import i18n from '@/locales'
import { getQueryValue } from './util'

const errorCode = {
  401: '认证失败，无法访问系统资源',
  403: '当前操作没有权限',
  404: '访问资源不存在',
  default: '系统未知错误，请反馈给管理员',
}
// 标识重新登录的弹窗是否已经弹出，解决弹窗点击重新登录后再次弹出的问题
const showLoginAlert = false
// 存储正在请求中的api信息
let requesting = []
// 用于取消请求
const CancelToken = axios.CancelToken
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const envUrl = {
  local: 'http://100.0.4.37:8080',
  development: 'https://momtest.lingyiitech.com:8092/api/',
  stage: 'http://100.0.4.36:8092/api/',
  production: 'https://mom.lingyiitech.com:8092/api/',
}
// 创建axios实例
const service = axios.create({
  baseURL: process.env.UNI_PLATFORM == 'h5' && process.env.NODE_ENV != 'local' ? '/api/' : envUrl[process.env.NODE_ENV],
  // baseURL: 'https://momtest.lingyiitech.com:8092/api/',
  // 超时
  timeout: 30000,
})

// 适配器
service.defaults.adapter = function (config) {
  return new Promise((resolve, reject) => {
    // console.log(JSON.stringify(config))
    const settle = require('axios/lib/core/settle')
    const buildURL = require('axios/lib/helpers/buildURL')
    uni.request({
      method: config.method.toUpperCase(),
      url: config.baseURL + buildURL(config.url, config.params, config.paramsSerializer),
      header: config.headers,
      data: config.data,
      dataType: config.dataType,
      responseType: config.responseType,
      sslVerify: config.sslVerify,
      complete: function complete(response) {
        // console.log("执行完成：", JSON.stringify(response))
        response = {
          data: response.data,
          status: response.statusCode,
          errMsg: response.errMsg,
          header: response.header,
          config: config,
        }
        settle(resolve, reject, response)
      },
    })
  })
}

// request拦截器
service.interceptors.request.use(
  config => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    // 允许自定义请求头的contentType
    if (config.header) {
      if (config.header['contentType']) {
        config.headers['Content-Type'] = config.header['contentType']
      }
    }
    // 允许自定义responseType
    /* if (config.responseType) {
      config.responseType = config.responseType
    } */
    if (!isToken) {
      config.headers['Authorization'] = 'Bearer ' + uni.getStorageSync('token') // 让每个请求携带自定义token 请根据实际情况自行修改
      if (config.data && config.data.Service) {
        // 1.post请求根据Service参数，更换请求url的模块名称
        const urlList = config.url.split('/').filter(item => item)
        urlList[0] = config.data.Service
        config.url = '/' + urlList.join('/')
      }
      // 如果请求头采用formData的形式，则转换参数为formData格式
      if (config.headers['Content-Type'] == 'application/x-www-form-urlencoded;charset=UTF-8') {
        config.data = stringify(config.data)
      }
      // 追加请求头语言
      config.headers['Accept-Language'] = 'zh-CN'
      // 追加orgcode
      const orgCode = uni.getStorageSync('orgCode')
      if (orgCode) {
        config.headers['OrgCode'] = orgCode
      }
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      // get请求增加时间戳参数，避免后端防抖
      const getParams = Object.assign(config.params, {})
      let url = config.url + '?'
      for (const propName of Object.keys(getParams)) {
        const value = getParams[propName]
        const part = encodeURIComponent(propName) + '='
        if (value !== null && typeof value !== 'undefined') {
          if (typeof value === 'object') {
            for (const key of Object.keys(value)) {
              const params = propName + '[' + key + ']'
              const subPart = encodeURIComponent(params) + '='
              url += subPart + encodeURIComponent(value[key]) + '&'
            }
          } else {
            url += part + encodeURIComponent(value) + '&'
          }
        }
      }
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
      // 2.get请求根据Service参数，更换请求url的模块名称
      if (config.method === 'get' && getQueryValue(config.url, 'Service')) {
        const urlList = config.url.split('/').filter(item => item)
        urlList[0] = getQueryValue(config.url, 'Service')
        config.url = '/' + urlList.join('/')
      }
    }
    // 设置api信息体
    const temObj = {
      method: config.method,
      url: config.url,
      data: JSON.stringify(_.cloneDeep(config.data)),
    }
    let cancel
    // 如果相同api信息则取消请求
    if (_.some(requesting, temObj)) {
      config.cancelToken = new CancelToken(function executor(c) {
        cancel = c
      })
      cancel(Object.assign({ status: 'cancel' }, { data: temObj }))
    }
    // 如果标识不做防抖的api，则不把api信息加入请求中的list中
    if (!config.headers.unDebounce) {
      requesting.push(temObj)
    }
    return config
  },
  error => {
    Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  res => {
    // 成功请求的api，删除请求中list对应的信息
    const temObj = {
      method: res.config?.method,
      url: res.config?.url,
      data: JSON.stringify(_.cloneDeep(res.config.data)),
    }
    // 深拷贝一份，防止数据污染，否则会导致某些少参数请求，间隔长时间连续请求被拦截的问题
    requesting = JSON.parse(JSON.stringify(_.remove(requesting, temObj)))
    // 未设置状态码则默认成功状态
    const code = res.data.Code || 200
    // 获取错误信息
    const msg = errorCode[code] || res.data.Msg || errorCode['default']

    if (code === 401) {
      //
      return new Promise(reject => {
        reject({ Success: false })
      })
    } else if (code === 500) {
      return new Promise(reject => {
        res['data']['Success'] = false
        reject(res.data)
      })
    } else if (code == 2000) {
      // SAP回写失败专属状态码
      return new Promise(reject => {
        res['data']['Success'] = false
        reject(res.data)
      })
    } else if (code !== 200) {
      // return Promise.reject('error')
      return new Promise(reject => {
        res['data']['Success'] = false
        reject(res.data)
      })
    } else {
      if ((res.headers && res.headers['content-disposition']) || res.config.responseType == 'blob' || res.config.responseType == 'arraybuffer') {
        // 文件流形式导出文件时，需要返回响应头，以获取文件类型和文件名称
        return res
      } else {
        if (res.config.url.indexOf('GetDicDataByKey') > -1) {
          // 字典接口增加国际化翻译
          const tempData = res.data
          if (tempData.Data) {
            tempData.Data = tempData.Data.map(item => {
              item['DataText'] = i18n.t(`${item.DicKey}#${item.DataValue}`) != `${item.DicKey}#${item.DataValue}` ? i18n.t(`${item.DicKey}#${item.DataValue}`) : item.DataText
              return item
            })
          }
          return tempData
        } else {
          return res.data
        }
      }
    }
  },
  error => {
    // 请求报错的api，删除请求中list对应的信息
    let { message } = error
    if (message && message.status == 'cancel') {
      console.log('重复请求：' + message.data.url)
      const temObj = {
        method: message.data && message.data?.method,
        url: message.data && message.data?.url,
        data: message.data ? JSON.stringify(message.data.data) : '',
      }
      // 深拷贝一份，防止数据污染，否则会导致某些少参数请求，间隔长时间连续请求被拦截的问题
      requesting = JSON.parse(JSON.stringify(_.remove(requesting, temObj)))
      return new Promise(reject => {
        reject({
          Success: false, // 特意设置成false，让回调走报错提示
          Msg: '', // 特意设置成空字符串，让回调不弹出重复请求的提示
        })
      })
    } else {
      // 如遇接口报错，则清空当前请求中列表
      requesting = []
      if (message == 'Network Error') {
        message = '后端接口连接异常'
      } else if (message && message.includes('timeout')) {
        message = '系统接口请求超时'
      } else if (message && message.includes('Request failed with status code')) {
        message = '系统接口' + message.substr(message.length - 3) + '异常'
      }
      if (message)
        // tongzhi
        return new Promise(reject => {
          reject(error)
        })
    }
  },
)

// 将参数转换成功 formdata 接收格式
function stringify(data) {
  const formData = new FormData()
  for (const key in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(key)) {
      if (data[key]) {
        if (data[key].constructor === Array) {
          if (data[key][0]) {
            if (data[key][0].constructor === Object) {
              formData.append(key, JSON.stringify(data[key]))
            } else {
              data[key].forEach((item, index) => {
                formData.append(key + `[${index}]`, item)
              })
            }
          } else {
            formData.append(key + '[]', '')
          }
        } else if (data[key].constructor === Object) {
          formData.append(key, JSON.stringify(data[key]))
        } else {
          formData.append(key, data[key])
        }
      } else {
        if (data[key] === 0) {
          formData.append(key, 0)
        } else {
          formData.append(key, '')
        }
      }
    }
  }
  return formData
}

export default service
