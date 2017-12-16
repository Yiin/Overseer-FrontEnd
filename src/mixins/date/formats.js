import DateService from '@/services/date'

export default {
  data() {
    return {
      ...DateService.formats
    }
  }
}
