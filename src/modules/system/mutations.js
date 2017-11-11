export default {
  UPDATE_ACTIVITY_LOG(state, { log, all }) {
    if (!state.activityLog.length) {
      if (Array.isArray(log)) {
        log.forEach((x) => {
          state.activityLog.push(x)
        })
      } else {
        state.activityLog.unshift(log)
      }
    } else {
      if (Array.isArray(log)) {
        log.forEach((x) => {
          state.activityLog.push(x)
        })
      } else {
        state.activityLog.unshift(log)
      }
    }
    state.allActivityLoaded = all
  }
}
