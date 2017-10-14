export default {
  UPDATE_ACTIVITY_LOG(state, { log, all }) {
    if (!state.activityLog.length) {
      if (Array.isArray(log)) {
        state.activityLog = log
      } else {
        state.activityLog = [log].concat(state.activityLog)
      }
    } else {
      if (Array.isArray(log)) {
        state.activityLog = state.activityLog.concat(log)
      } else {
        state.activityLog = [log].concat(state.activityLog)
      }
    }
    state.allActivityLoaded = all
  }
}
