export default {
  SHOW_POPUP(state, { template, data = {} }) {
    state.isOpen = true
    state.template = template
    state.templateData = data
  },

  CLOSE_POPUP(state) {
    state.isOpen = false
    state.template = null
    state.templateData = {}
  }
}
