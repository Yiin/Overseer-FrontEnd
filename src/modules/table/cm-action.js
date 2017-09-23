export default (action = {}) => Object.assign({
  'title': '',
  'icon': '',

  visible() {
    return true
  },

  extend: function (customProperties) {
    return Object.assign({}, this, customProperties)
  },

  isVisible: function (visible) {
    return Object.assign({}, this, { visible })
  }
}, action)
