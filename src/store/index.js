import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import system from './modules/system'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    system,
  },
  getters,
})

export default store
