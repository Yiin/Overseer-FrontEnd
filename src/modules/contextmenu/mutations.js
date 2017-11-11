export default {
  SET_IS_OPEN(state, isOpen) {
    state.isOpen = isOpen
  },

  SET_SCOPE(state, scope) {
    state.scope = scope
  },

  SET_POSITION(state, { top, left }) {
    state.position.top = top
    state.position.left = left
  },

  SET_ITEMS(state, items) {
    state.items = items
  }
}
