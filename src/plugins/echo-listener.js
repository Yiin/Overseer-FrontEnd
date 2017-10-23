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
      case 'App\\Domain\\Events\\Document\\DocumentWasCreated':
        store.dispatch(`${repositoryPath}/ADD_ITEM`, documentModel)
        break
      case 'App\\Domain\\Events\\Document\\DocumentWasUpdated':
      case 'App\\Domain\\Events\\Document\\DocumentWasDeleted':
        store.dispatch(`${repositoryPath}/UPDATE_ITEM`, documentModel)
        break
      }
    })

    Echo.listen('.system.event', (payload) => {
      const { event } = payload

      switch (event) {
      case 'App\\Domain\\Events\\System\\RegisteredNewActivity':
        store.dispatch(`system/SET_ACTIVITY_LOG`, payload.activity)
        break
      }
    })
  }
}
