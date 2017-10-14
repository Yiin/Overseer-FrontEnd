import actions from './actions'
import mutations from './mutations'
import state from './state'
import registration from './registration'
import login from './login'

export default {
  namespaced: true,

  actions,
  mutations,
  state,
  modules: {
    registration,
    login
  }
}
