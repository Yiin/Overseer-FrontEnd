export default {
  SET_RESULTS(state, results) {
    state.results = results
  },

  ADD_RESULT(state, results) {
    state.results.unshift(results)
  },

  REMOVE_RESULTS(state, vat) {
    state.results = state.results.filter((result) => {
      return result.country_code !== vat.country_code && result.number !== vat.number
    })
  }
}
