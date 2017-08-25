import * as types from './mutation-types'

export default {
  [types.UPDATE_AUTH](state, auth) {
    state.auth = auth
  },

  [types.UPDATE_USER](state, user) {
    state.user = user
  },

  [types.PRELOAD_TABLE](state, { name }) {
    const list = state.lists[name]

    list.loading = true

    state.lists[name] = list
  },

  [types.UPDATE_TABLE](state, { name, data }) {
    const list = state.lists[name]

    list.loading = false
    list.page = Math.min(Math.max(list.page, 0), data.pages)
    list.pages = data.pages
    list.list = data.rows
    list.total = data.total

    state.lists[name] = list
  },

  [types.TOGGLE_ROW](state, { name, row }) {
    const list = state.lists[name]

    const found = list.selection.find((item) => item === row)

    if (found) {
      list.selection = list.selection.filter((item) => item !== row)
    } else {
      list.selection.push(row)
    }

    state.lists[name] = list
  },

  // [types.OPEN_FORM](state, { name }) {
  //   const taskbar = state.taskbar

  //   taskbar.list.push({
  //     name: name
  //   })

  //   taskbar.activeIndex = taskbar.length - 1

  //   state.taskbar = taskbar
  // },

  /**
   * Clear each property, one by one, so reactivity still works.
   *
   * (ie. clear out state.auth.isLoggedIn so Navbar component automatically reacts to logged out state,
   * and the Navbar menu adjusts accordingly)
   *
   * TODO: use a common import of default state to reset these values with.
   */
  [types.CLEAR_ALL_DATA](state) {
    // Auth
    state.auth.isLoggedIn = false
    state.auth.accessToken = null

    // User
    state.user.first_name = ''
    state.user.last_name = ''
  }
}
