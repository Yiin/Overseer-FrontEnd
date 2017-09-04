import store from '@/store'
import Echo from '@/echo'
import S from 'string'
import pluralize from 'pluralize'

export default {
  install() {
    Echo.listen('.entity.event', (payload) => {
      const { event, entityName, entityModel } = payload

      switch (event) {
      case 'updated':
        store.dispatch('UPDATE_ROW', {
          table: pluralize(S(entityName).underscore().s.toLowerCase()),
          row: entityModel
        })
        break
      case 'created':
        store.dispatch('INSERT_ROW', {
          table: pluralize(S(entityName).underscore().s.toLowerCase()),
          row: entityModel
        })
      }
    })
  }
}
