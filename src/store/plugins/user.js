export default (store) => {
  store.subscribe((mutation, state) => {
    const { type, payload } = mutation

    if (type === 'auth/SET_USER') {
      //
    }
  })
}
