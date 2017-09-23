export default {
  SET_RESULTS(state, results) {
    state.results = results
  },

  ADD_RESULT(state, results) {
    state.results.unshift(results)
  }
}
