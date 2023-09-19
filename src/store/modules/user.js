import request from 'common/request'
import { SubmitLogin, GetInfo, Logout } from '@/api/system'

const user = {
  state: {
    token: '',
    userInfo: {}, // 用户信息
    dictMap: {},
    orgCodeList: [],
    permissions: [],
    roles: [],
    orgCode: '',
    orgName: '',
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      // 设置token
      state.token = token
      uni.removeStorageSync('token')
      uni.setStorageSync('token', token)
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
      uni.removeStorageSync('roles')
      uni.setStorageSync('roles', JSON.stringify(roles))
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
      uni.removeStorageSync('permissions')
      uni.setStorageSync('permissions', JSON.stringify(permissions))
    },
    SET_ORGCODE: (state, orgCode) => {
      state.orgCode = orgCode
      uni.removeStorageSync('orgCode')
      uni.setStorageSync('orgCode', orgCode)
    },
    SET_ORGNAME: (state, orgName) => {
      state.orgName = orgName
      uni.removeStorageSync('orgName')
      uni.setStorageSync('orgName', orgName)
    },
    SET_USER_INFO: (state, userInfo) => {
      // 设置用户信息
      state.userInfo = userInfo
      uni.removeStorageSync('userInfo')
      uni.setStorageSync('userInfo', userInfo)
    },
    SET_ORGCODELIST: (state, OrgCodeList) => {
      state.orgCodeList = OrgCodeList
      uni.removeStorageSync('orgCodeList')
      uni.setStorageSync('orgCodeList', JSON.stringify(OrgCodeList))
    },
    // 保存字典项
    SAVE_DICT_ITEM: (state, data) => {
      const obj = {}
      obj[data.dictKey] = data
      // 需要拷贝一份，要不然数据变动监听不到
      state.dictMap = Object.assign({}, state.dictMap, obj)
    },
  },
  actions: {
    // 用户登录
    $Login({ commit }, param) {
      return new Promise((resolve, reject) => {
        SubmitLogin(param.loginForm)
          .then(res => {
            if (res.Success) {
              if (param.checkbodxArr == 'ty') {
                uni.setStorageSync('loginForm', param.loginForm)
              } else {
                uni.removeStorageSync('loginForm')
              }
              commit('SET_TOKEN', res.Data.Token)
            }
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取用户信息
    $GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        GetInfo()
          .then(res => {
            commit('SET_ORGCODELIST', res.Data.Organizations)
            commit('SET_USER_INFO', res.Data.UserInfo)
            commit('SET_ORGCODE', res.Data.UserInfo.DefaultOrgCode)
            commit('SET_ORGNAME', res.Data.UserInfo.DefaultOrgName)
            commit('SET_PERMISSIONS', res.Data.Permissions)
            // 验证返回的roles是否是一个非空数组
            if (res.Data.Roles && res.Data.Roles.length > 0) {
              commit('SET_ROLES', res.Data.Roles)
            } else {
              commit('SET_ROLES', ['ROLE_DEFAULT'])
            }
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 退出系统
    $LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        Logout({ UserId: uni.getStorageSync('userInfo').Id })
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ORGCODE', '')
            commit('SET_USER_INFO', {})
            commit('SET_ORGCODELIST', [])
            commit('SET_ORGNAME', '')
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    resetToken({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ORGCODE', '')
        commit('SET_USER_INFO', {})
        commit('SET_ORGCODELIST', [])
        commit('SET_ORGNAME', '')
        resolve()
      })
    },
    getByDictKey({ commit, state }, data) {
      if (!data.dictKey) return
      return new Promise((resolve, reject) => {
        if (state.dictMap[data.dictKey]) {
          resolve()
        } else {
          // 防止同一个key多次请求
          commit('SAVE_DICT_ITEM', {
            dictKey: data.dictKey,
            items: [],
          })

          request.get(`/Base/Dictionary/GetDicDataByKey?dicKey=${data.dictKey}&isAll=false`).then(res => {
            commit('SAVE_DICT_ITEM', {
              dictKey: data.dictKey,
              items: res ? res.Data : [],
            })
            resolve()
          })
        }
      })
    },
  },
}

export default user
