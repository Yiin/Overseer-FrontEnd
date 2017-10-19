import Echo from '@/echo'
import { getTableName } from '@/modules/documents/helpers'
import DocumentsList from '@/modules/documents/list'

export default {
  PRELOAD_DATA({ commit }, preloadedData) {
    const preloadedJsonEl = document.getElementById('preloaded_json')

    if (!preloadedData && preloadedJsonEl) {
      preloadedData = JSON.parse(preloadedJsonEl.innerHTML)
      preloadedJsonEl.parentNode.removeChild(preloadedJsonEl)
    }

    commit('SET_PRELOADED_DATA', preloadedData)
  },

  INIT({ dispatch, commit, state }, preloadedData = null) {
    const promises = []

    if (state.preloadedData && state.preloadedData.user && state.preloadedData.user.taskbar) {
      commit('taskbar/SET_STATE', JSON.parse(state.preloadedData.user.taskbar), { root: true })
    }

    // Use preloaded data if possible, load everything if not
    if (preloadedData) {
      const data = preloadedData

      dispatch('SET_STATIC_DATA', data.passive)
      dispatch('settings/SET_SETTINGS', state.auth.user.settings)

      /* Documents */
      for (let key in data.documents) {
        const tableName = getTableName(key)
        commit(`table/${tableName}/SET_TABLE_ITEMS`, data.documents[key])
        commit(`table/${tableName}/NORMALIZE_TABLE`)
      }

      DocumentsList.forEach((key) => {
        const tableName = getTableName(key)
        dispatch(`table/${tableName}/UPDATE_RELATIONS`)
      })

      dispatch('system/SET_ACTIVITY_LOG', data.system.activityLog)
    } else {
      /* Static Data */
      dispatch('LOAD_STATIC_DATA').then(() => {
        dispatch('settings/SET_SETTINGS', state.auth.user.settings)
      })

      dispatch('system/UPDATE_ACTIVITY_LOG')

      /* Documents */
      DocumentsList.forEach((key) => {
        const tableName = getTableName(key)
        promises.push(dispatch(`table/${tableName}/LOAD_TABLE`))
      })

      /* Features */
      dispatch(`features/vat_checker/LOAD_RESULTS`)

      // once all documents are loaded, link relationships
      Promise.all(promises).then(() => {
        DocumentsList.forEach((key) => {
          const tableName = getTableName(key)
          dispatch(`table/${tableName}/UPDATE_RELATIONS`)
        })
      })
    }

    /* Real time updates */
    Echo.connect()
  }
}
