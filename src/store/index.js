import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import state from './state'
import plugins from './plugins'
import modules from '@/modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  actions,
  mutations,
  state,

  plugins,
  modules
})

const INITIAL_STATE = JSON.stringify(store.state)

export function getInitialState({ exclude = [] } = {}) {
  const initialState = {}
  const parsedInitialState = JSON.parse(INITIAL_STATE)

  for (let key in parsedInitialState) {
    if (exclude.indexOf(key) === -1) {
      initialState[key] = parsedInitialState[key]
    }
  }

  return initialState
}

export function getStoreModule(path) {
  return store._modules.get(path).context
}

export default store
