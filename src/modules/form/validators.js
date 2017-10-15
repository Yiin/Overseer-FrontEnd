import product from './product/validator'

export default {
  product
}

export function required(value, message) {
  if (typeof value === 'undefined') {
    return [message]
  }
  if (value === null) {
    return [message]
  }
  if (value === '') {
    return [message]
  }
  return []
}
