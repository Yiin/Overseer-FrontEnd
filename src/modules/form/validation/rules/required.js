export default {
  validate(value) {
    if (typeof value === 'undefined') {
      return false
    }
    if (Number.isNaN(value)) {
      return false
    }
    if (value === null) {
      return false
    }
    if (value === '') {
      return false
    }
    return true
  }
}
