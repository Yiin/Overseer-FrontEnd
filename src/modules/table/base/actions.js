/**
 * Table actions
 */
import Api from '@/api'
import { getTableName, getFormName } from '@/modules/documents/helpers'
import transformers from '@/modules/documents/transformers'

export default (actions = {}) => Object.assign({
  /**
   * Load table data
   */
  LOAD_TABLE({ commit, state }) {
    const name = state.name

    commit('SET_TABLE_STATE', 'loading')

    const prefix = (state.apiPrefix ? state.apiPrefix + '/' : '')

    return Api.get(prefix + name.replace(/_/g, '-')).then((response) => {
      commit('SET_TABLE_ITEMS', response)
      commit('NORMALIZE_TABLE')
      commit('SET_TABLE_STATE', 'idle')
      return response
    })
  },

  FILL({ state }) {
    const name = state.name

    const prefix = (state.apiPrefix ? state.apiPrefix + '/' : '')

    return Api.get(prefix + 'dummy-' + name.replace(/_/g, '-'))
  },

  UPDATE_RELATIONS({ dispatch, commit, state }) {
    const documents = state.items

    documents.forEach((document) => {
      dispatch('UPDATE_ITEM_RELATIONS', document)
    })
    commit('ITEMS_RELATIONS_ARE_UPDATED')
  },

  UPDATE_ITEM_RELATIONS({ commit, rootState, dispatch, state }, document) {
    // if document has relationships
    if (document.relationships) {
      // go through each of them
      for (let relatedDocumentType in document.relationships) {
        const relatedDocumentTableName = getTableName(relatedDocumentType)
        dispatch('table/ADD_RELATIONSHIP', { firstTable: state.name, secondTable: relatedDocumentTableName }, { root: true })

        // if relation is array of relationships
        if (Array.isArray(document.relationships[relatedDocumentType])) {
          // link relation to actual documents
          document[relatedDocumentType] = document.relationships[relatedDocumentType].map((relatedDocumentUuid) => {
            return rootState.table[relatedDocumentTableName].items.find((item) => {
              return item.uuid === relatedDocumentUuid
            })
          }).filter((item) => item)
        } else { // relation is not an array, so we just try to link a single document
          document[relatedDocumentType] = rootState.table[relatedDocumentTableName].items.find((item) => {
            return item.uuid === document.relationships[relatedDocumentType]
          })
        }
      }
    }
    commit('UPDATE_ROW', document)
  },

  SET_ROWS_PER_PAGE({ commit }, rows) {
    commit('SET_ROWS_PER_PAGE', rows)
    commit('NORMALIZE_TABLE')
  },

  SET_PAGE({ commit }, page) {
    commit('SET_PAGE', page)
  },

  /**
   * Send API request to create a document
   */
  CREATE_DOCUMENT({ commit, dispatch, state }, { data }) {
    const name = state.name
    const prefix = (state.apiPrefix ? state.apiPrefix + '/' : '')
    const transformedData = transformers[getFormName(name)](data)

    return Api.post(prefix + name.replace(/_/g, '-'), transformedData)
      .then((response) => {
        dispatch('INSERT_ROW', response)
        dispatch('modal/CLOSE', null, { root: true })
        return response
      })
  },

  /**
   * Send API request to save a document
   */
  SAVE_DOCUMENT({ dispatch, state }, { uuid, data }) {
    const name = state.name
    const prefix = (state.apiPrefix ? state.apiPrefix + '/' : '')
    const transformedData = transformers[getFormName(name)](data)

    return Api.put(prefix + name.replace(/_/g, '-') + `/${uuid}`, transformedData)
      .then((response) => {
        dispatch('UPDATE_ROW', response)
        dispatch('modal/CLOSE', null, { root: true })
        return response
      })
  },

  /**
   * Send API request to patch document
   */
  PATCH_DOCUMENT({ dispatch, state }, { uuid, data }) {
    const name = state.name
    const prefix = (state.apiPrefix ? state.apiPrefix + '/' : '')

    return Api.patch(prefix + name.replace(/_/g, '-') + `/${uuid}`, data)
      .then((response) => {
        dispatch('UPDATE_ROW', response)
        return response
      })
  },

  ARCHIVE_DOCUMENT({ commit, dispatch, state }, { uuid }) {
    const name = state.name
    const prefix = (state.apiPrefix ? state.apiPrefix + '/' : '')

    return Api.post(prefix + name.replace(/_/g, '-') + `/${uuid}/archive`)
      .then((response) => {
        dispatch('UPDATE_ROW', response)
        return response
      })
  },

  ARCHIVE_DOCUMENTS({ commit, dispatch, state }, uuids) {
    const name = state.name
    const prefix = (state.apiPrefix ? state.apiPrefix + '/' : '')

    return Api.post(prefix + name.replace(/_/g, '-') + '-archive', { uuids })
      .then((response) => {
        dispatch('UPDATE_ROW', response)
        return response
      })
  },

  DELETE_DOCUMENT({ commit, dispatch, state }, { uuid }) {
    const name = state.name
    const prefix = (state.apiPrefix ? state.apiPrefix + '/' : '')

    return Api.delete(prefix + name.replace(/_/g, '-') + `/${uuid}`)
      .then((response) => {
        dispatch('REMOVE_ROW', response)
        return response
      })
  },

  DELETE_DOCUMENTS({ commit, dispatch, state }, uuids) {
    const name = state.name
    const prefix = (state.apiPrefix ? state.apiPrefix + '/' : '')

    return Api.post(prefix + name.replace(/_/g, '-') + '-delete', { uuids })
      .then((response) => {
        response.forEach((row) => {
          dispatch('REMOVE_ROW', row)
        })
        return response
      })
  },

  UNARCHIVE_DOCUMENTS({ commit, dispatch, state }, uuids) {
    const name = state.name
    const prefix = (state.apiPrefix ? state.apiPrefix + '/' : '')

    return Api.post(prefix + name.replace(/_/g, '-') + '-unarchive', { uuids })
      .then((response) => {
        dispatch('UPDATE_ROW', response)
        return response
      })
  },

  RESTORE_DOCUMENT({ commit, dispatch, state }, { uuid }) {
    const name = state.name
    const prefix = (state.apiPrefix ? state.apiPrefix + '/' : '')

    return Api.post(prefix + name.replace(/_/g, '-') + `/${uuid}/restore`)
      .then((response) => {
        const row = state.items.find((item) => item.uuid === response.uuid)

        if (row) {
          dispatch('UPDATE_ROW', response)
        } else {
          dispatch('INSERT_ROW', response)
        }
        return response
      })
  },

  RESTORE_DOCUMENTS({ commit, dispatch, state }, uuids) {
    const name = state.name
    const prefix = (state.apiPrefix ? state.apiPrefix + '/' : '')

    return Api.post(prefix + name.replace(/_/g, '-') + '-restore', { uuids })
      .then((response) => {
        response.forEach((row) => {
          dispatch('UPDATE_ROW', row)
        })
        return response
      })
  },

  INSERT_ROW({ commit, dispatch }, data) {
    commit('INSERT_ROW', data)
    dispatch('UPDATE_ITEM_RELATIONS', data)
    commit('ITEMS_RELATIONS_ARE_UPDATED')
  },

  UPDATE_ROW({ commit, dispatch }, data) {
    dispatch('UPDATE_ITEM_RELATIONS', data)
    commit('ITEMS_RELATIONS_ARE_UPDATED')
  },

  REMOVE_ROW({ commit }, data) {
    commit('REMOVE_ROW', data)
  },

  /**
   * Toggle table row
   */
  TOGGLE_ROW_ON({ commit }, data) {
    commit('TOGGLE_ROW_ON', data)
  },

  TOGGLE_ROW_OFF({ commit }, data) {
    commit('TOGGLE_ROW_OFF', data)
  },

  TOGGLE_ROW({ commit }, data) {
    commit('TOGGLE_ROW', data)
  }
}, actions)
