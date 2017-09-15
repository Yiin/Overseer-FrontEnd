export default {
  SET_STATIC_DATA(state, data) {
    for (let key in data) {
      state[key] = data[key]
    }
  }
}
