/* Vue */
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import Api from './api'
import Auth from './auth'
import router from './router'
import store from './store'
import * as filters from './filters'
import * as components from './components/common'
import * as directives from './directives'

Vue.config.productionTip = false

Vue.use(VueResource)

/* API plugin */
Vue.use(Api)

/* Auth plugin */
Vue.use(Auth)

/* Global components */
for (let key in components) {
  const name = components[key].name || key
  Vue.component(name, components[key])
}

/* Filters */
for (let name in filters) {
  Vue.filter(name, filters[name])
}

/* Directives */
for (let name in directives) {
  Vue.directive(name, directives[name])
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
