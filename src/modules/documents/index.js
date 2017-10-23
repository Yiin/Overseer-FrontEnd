import * as repositories from './repositories'

export default {
  namespaced: true,

  modules: {
    repositories: {
      namespaced: true,
      modules: repositories
    }
  }
}
