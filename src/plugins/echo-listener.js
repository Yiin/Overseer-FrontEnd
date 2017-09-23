import store from '@/store'
import Echo from '@/echo'
import S from 'string'
import pluralize from 'pluralize'

export default {
  install() {
    Echo.listen('.document.event', (payload) => {
      const { event, documentName, documentModel } = payload

      const tableName = pluralize(S(documentName).underscore().s.toLowerCase())

      switch (event) {
      case 'App\\Domain\\Events\\Document\\DocumentWasCreated':
        store.dispatch(`table/${tableName}/INSERT_ROW`, documentModel)
        break
      case 'App\\Domain\\Events\\Document\\DocumentWasUpdated':
      case 'App\\Domain\\Events\\Document\\DocumentWasDeleted':
        store.dispatch(`table/${tableName}/UPDATE_ROW`, documentModel)
        break
      }
    })
  }
}
