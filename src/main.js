/* Vue */
import Vue from 'vue'
import VueResource from 'vue-resource'
import { VTooltip } from 'v-tooltip'
import VueClipboard from 'vue-clipboard2'
import App from './App'
import Api from './api'
import Auth from './auth'
import router from './router'
import store from './store'
import i18n from './i18n'
import * as plugins from './plugins'
import * as filters from './filters'
import * as components from './components/common'
import * as directives from './directives'

// Options
Vue.config.productionTip = false

/* Tooltips */
Vue.directive('tooltip', VTooltip)

/* Clipboard */
Vue.use(VueClipboard)

/* Http Client */
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

/* Plugins */
for (let name in plugins) {
  Vue.use(plugins[name])
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App },

  mounted() {
    if (this.$store.state.auth.isLoggedIn) {
      console.log('another init')
      this.$store.dispatch('INIT')
    }
  }
})

i18n.locale = store.state.settings.locale
