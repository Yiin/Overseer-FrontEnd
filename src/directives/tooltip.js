export default {
  componentUpdated: function (el, binding) {
    if (el.classList.contains('--has-tooltip')) {
      return
    }
    if (typeof binding.value === 'undefined' || !binding.value) {
      return
    }
    el.classList.add('--has-tooltip')

    if (typeof binding.value === 'object') {
      for (let prop in binding.value) {
        el.dataset[prop] = binding.value[prop]
      }
    } else {
      el.dataset.content = binding.value
    }
  }
}
