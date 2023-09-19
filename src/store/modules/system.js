import { getMutilDicts } from '@/api/system'

const system = {
  state: {
    // 调试
    debugger: process.env.NODE_ENV === 'development' || false,
    // 主题相关
    theme: {
      themeName: 'theme-default',
      primaryColor: '#0067FF',
      infoColor: '#a8b6bb',
      errorColor: '#F03D3D',
      successColor: '#00AF8D',
      warnColor: '#FFCF33',
    },
    // 字典
    dictMap: {},
  },
  mutations: {
    SET_DEBUGGER: (state, status) => {
      state.debugger = status
    },
    SET_THEME: (state, name) => {
      state.theme.themeName = name
    },
    SET_THEMECOLOR: (state, value) => {
      state.theme = { ...state.theme, ...value }
    },
    // 保存多个字典项
    SAVE_DICT_ITEM_FROM_LIST: (state, data) => {
      const dictKeys = data.dictKeys || []
      const dataList = data.list
      for (let i = 0; i < dictKeys.length; i++) {
        const element = dictKeys[i]
        const obj = {}
        obj[element] = element
        obj[element] = {
          dictKey: element,
          items: dataList.filter(item => item.DicKey == element),
        }
        state.dictMap = Object.assign({}, state.dictMap, obj)
      }
    },
  },
  actions: {
    // 开启调试模式
    $Debugger({ commit }, param) {
      commit('SET_DEBUGGER', param)
    },
    $SetTheme({ commit }, param) {
      console.log('param')
      console.log(param)
      commit('SET_THEME', param)
    },
    $SetThemeColor({ commit }, param) {
      commit('SET_THEMECOLOR', param)
    },
    // 获取单个或多个字典
    $GetDictByKey({ commit, state }, data) {
      if (data && data.length) {
        const requsetKeys = Array.from(new Set(data.filter(item => !Object.keys(state.dictMap).includes(item))))
        return new Promise((resolve, reject) => {
          if (requsetKeys.length == 0) {
            resolve()
          } else {
            getMutilDicts(requsetKeys).then(res => {
              commit('SAVE_DICT_ITEM_FROM_LIST', {
                dictKeys: requsetKeys,
                list: res ? res.Data : [],
              })
              resolve()
            })
          }
        })
      }
    },
  },
}

export default system
