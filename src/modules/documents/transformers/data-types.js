import moment from 'moment'

export const date = (val, defaultVal = null) => {
  const _date = moment(val)
  return val && _date.isValid() ? _date.format('YYYY-MM-DD') : defaultVal
}

export const boolean = (val, defaultVal = false) => {
  return typeof val !== 'undefined' ? !!val : defaultVal
}

export const float = (val, defaultVal = 0) => {
  return (typeof val !== 'undefined' && val !== null && !Number.isNaN(parseFloat(val))) ? parseFloat(val) : defaultVal
}

export const integer = (val, defaultVal = 0) => {
  return (typeof val !== 'undefined' && val !== null && !Number.isNaN(parseInt(val))) ? parseInt(val) : defaultVal
}

export const uuid = (val) => {
  return (typeof val !== 'undefined') ? val : null
}

export const id = uuid

export const text = (val, defaultVal = '') => {
  return (typeof val !== 'undefined' && val !== null && !!val) ? val.toString() : defaultVal
}

export const currency = (val, defaultVal = '0.00') => {
  return text(val, defaultVal)
}
