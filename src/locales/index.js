import Vue from 'vue'
import VueI18n from 'vue-i18n'
// default lang
import request from '@/common/request'
import { message } from '@/common/message.js'
import _ from 'lodash'
Vue.use(VueI18n)

/**
 * 请求后台接口获取语言包
 * @returns {AxiosPromise}
 */
function getLang(lang) {
  return request({
    url: `/Base/Language/GetLangResource?lang=${lang}`,
    method: 'get',
    headers: {
      'Accept-Language': lang,
    },
  })
}

const i18n = new VueI18n({
  silentTranslationWarn: true,
  locale: 'zh-CN',
  messages: {},
})

async function loadLanguageAsync(lan = undefined) {
  const Info = await uni.getSystemInfo()
  const storge = uni.getStorageSync('language')
  const lang = lan ? lan : storge ? storge : _.get(Info, '[1].language', 'en-US')
  const res = await getLang(lang)
  let obj = {}
  if (res && res.Success) {
    obj = res.Data
  } else {
    message.toast(res.Msg)
  }
  uni.setStorageSync('language', lang)
  i18n.setLocaleMessage(lang, obj)
  i18n.locale = lang
}

Vue.prototype.$loadLanguageAsync = loadLanguageAsync
// 添加自定义多语言符号
Vue.prototype.$tl = (key, defaultValue, props) => {
  if (i18n.t(key) != key) {
    return i18n.t(key, props)
  } else if (defaultValue) {
    return defaultValue
  } else {
    return key
  }
}

export default i18n
