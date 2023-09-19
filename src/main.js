import Vue from 'vue'
import App from './App'
import i18n from '@/locales'
import store from './store'
import { logger } from './common/logger.js'
import { message } from './common/message.js'
import { globalMixin } from './common/commonMixins'
import momLayout from '@/components/common/momLayout'
import { router, RouterMount } from './router/router.js'
import _ from 'lodash'
import uView from 'uview-ui'
Vue.use(uView)
Vue.use(router)
import messageModal from '@/components/common/messageModal'

Vue.component('MomLayout', momLayout)
Vue.component('MessageModal', messageModal)
Vue.config.productionTip = false

// #ifdef H5
const vconsole = require('vconsole')
Vue.prototype.$vconsole = store.state.debugger ? new vconsole() : undefined // 使用vconsole
// #endif

App.mpType = 'app'
Vue.prototype.$store = store
Vue.prototype.$logger = logger
Vue.prototype.$msg = message
Vue.config.errorHandler = function (err, vm, info) {
  logger.error(info, err.stack)
}

Vue.mixin(globalMixin)
const app = new Vue({
  i18n,
  ...App,
})
// #ifdef H5
RouterMount(app, router, '#app')
// #endif
// #ifndef H5
app.$mount() //为了兼容小程序及app端必须这样写才有效果
// #endif
