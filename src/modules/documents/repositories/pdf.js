import { RepositoryState, RepositoryMutations, RepositoryActions, RepositoryGetters, RepositoryMethods } from './base'
import { getRepositoryName } from '../helpers'
import Pdf from '../models/pdf'

/**
 * Repository state
 */
const state = RepositoryState({
  key: 'id'
})
const mutations = RepositoryMutations()
const actions = RepositoryActions(Pdf, {
  ASSIGN_PDF({ dispatch, rootGetters }, pdfData) {
    const pdf = Pdf.create(pdfData)
    const repositoryName = getRepositoryName(pdf.pdfableType)

    const pdfable = rootGetters[`documents/repositories/${repositoryName}/FIND_ITEM`]({
      uuid: pdf.pdfableId
    })

    if (pdfable) {
      pdfable.assignPdf(pdf)
    }
  }
})
const getters = RepositoryGetters()

/**
 * Exports
 */
export default {
  namespaced: true,

  state,
  mutations,
  actions,
  getters
}
export const methods = RepositoryMethods('pdf')
