import store from '@/store'
import Echo from '@/echo'
import { getRepositoryName } from '@/modules/documents/helpers'

export default {
  install() {
    Echo.listen('.document.event', (payload) => {
      const { event, documentName, documentModel } = payload

      const repositoryName = getRepositoryName(documentName)
      const repositoryPath = `documents/repositories/${repositoryName}`

      switch (event) {
      /**
       * Base documents like products, clients, invoices, expenses, vendors etc
       */
      case 'App\\Domain\\Events\\Document\\DocumentWasCreated':
      case 'App\\Domain\\Events\\Document\\UserCreatedDocument':
        store.dispatch(`${repositoryPath}/ADD_ITEM`, documentModel)
        break
      case 'App\\Domain\\Events\\Document\\DocumentWasUpdated':
      case 'App\\Domain\\Events\\Document\\UserUpdatedDocument':
      case 'App\\Domain\\Events\\Document\\DocumentWasDeleted':
        console.log('echo-listener.EVENT: called')
        store.dispatch(`${repositoryPath}/UPDATE_ITEM`, documentModel)
        console.log('echo-listener.EVENT: finished')
        break

      /**
       * Generated new pdf, save it and assign it to correct document
       */
      case 'App\\Domain\\Events\\Document\\PdfWasCreated':
        store.dispatch(`${repositoryPath}/ASSIGN_PDF`, documentModel)
        break
      }
    })

    Echo.listen('.system.event', (payload) => {
      const { event } = payload

      switch (event) {
      case 'App\\Domain\\Events\\System\\RegisteredNewActivity':
        store.dispatch('documents/repositories/activity/ADD_ITEM', payload.activity)
        break
      }
    })
  }
}
