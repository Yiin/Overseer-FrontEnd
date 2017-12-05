import AuthorizationService from '@/services/authorization'

export default Object.assign({
  install(Vue) {
    Vue.prototype.$authorization = Vue.authorization = this
  }
}, AuthorizationService)
