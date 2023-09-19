import { RouterMount, createRouter } from 'uni-simple-router'
import store from '../store'

const router = createRouter({
  platform: process.env.VUE_APP_PLATFORM,
  routes: [
    // eslint-disable-next-line no-undef
    ...ROUTES,
    {
      path: '*',
      redirect: to => ({ name: '404' }), // 匹配非定义的路由地址
    },
  ],
})
//全局路由前置守卫
router.beforeEach((to, from, next) => {
  const token = uni.getStorageSync('token')
  if (token) {
    next()
  } else {
    if (to.path.includes('/login')) {
      next()
    } else {
      next({ name: 'login' })
    }
  }
})
// 全局路由后置守卫
router.afterEach((to, from) => {
  console.log('跳转结束')
})

export { router, RouterMount }
