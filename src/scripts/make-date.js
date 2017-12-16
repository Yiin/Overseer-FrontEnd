import moment from 'moment'

export default function (input) {
  if (!input) {
    return ''
  }
  if (input instanceof moment) {
    return input
  }
  if (typeof input === 'string') {
    return moment(input)
  }
  return moment(input.date)
}
