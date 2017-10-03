import Api from '@/api'

const activityLogInitialLength = 8

export default {
  UPDATE_ACTIVITY_LOG({ commit }) {
    Api.post('system/activity-log', {
      count: activityLogInitialLength
    })
      .then((log) => {
        commit('UPDATE_ACTIVITY_LOG', {
          log,
          all: log.length < activityLogInitialLength
        })
      })
  },

  SET_ACTIVITY_LOG({ commit }, data) {
    commit('UPDATE_ACTIVITY_LOG', {
      log: data,
      all: false
    })
  },

  LOAD_MORE_ACTIVITIES({ commit, state }) {
    let data = {
      count: activityLogInitialLength
    }

    if (state.activityLog.length) {
      data.last = state.activityLog[state.activityLog.length - 1].id
    }

    Api.post(`system/activity-log`, data)
      .then((log) => {
        commit('UPDATE_ACTIVITY_LOG', {
          log,
          all: log.length < activityLogInitialLength
        })
      })
  }
}
