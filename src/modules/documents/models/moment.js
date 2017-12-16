import moment from 'moment'

class Moment {
  construct(value) {
    if (value instanceof moment) {
      this.momentInstance = moment(value)
    } else if (typeof value === 'object' && 'date' in value) {
      this.momentInstance = moment(value.date)
    } else if (typeof value === 'string') {
      this.momentInstance = moment(value)
    }
  }
}

export default Moment
