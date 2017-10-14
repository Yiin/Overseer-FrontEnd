import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import state from './state'
import plugins from './plugins'
import modules from '@/modules'

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  mutations,
  state,

  plugins,
  modules
})
