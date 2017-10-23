/* Vue */
import Vue from 'vue'
import VueResource from 'vue-resource'
import {
 Vuetify,
 VApp,
 VAvatar,
 VCard,
 VList,
 VGrid,
 VSelect,
 VTextField
} from 'vuetify'
import VueMaterial from 'vue-material'
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
import { preload } from './scripts'
require('objectmodel/src/devtool-formatter')

// Options
Vue.config.productionTip = false

/* Tooltips */
Vue.directive('tooltip', VTooltip)

/* Clipboard */
Vue.use(VueClipboard)

/* UI Lib */
Vue.use(VueMaterial) /* Temporary, for input fields scaling bug fix */
Vue.material.registerTheme('default', {
  warn: {
    color: 'red',
    hue: 'A700'
  }
})

Vue.use(Vuetify, {
  components: {
    VApp,
    VAvatar,
    VCard,
    VGrid,
    VList,
    VSelect,
    VTextField
  }
})

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

preload()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})

i18n.locale = store.state.settings.locale
