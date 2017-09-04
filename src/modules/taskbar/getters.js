import TaskbarItem from './item-types'

export default {
  items: (state) => {
    return state.items
  },

  active_items: (state) => {
    return state.activeIndex < state.items.length ? state.items[state.activeIndex] : null
  },

  idle_items: (state) => {
    return state.items.filter((item, index) => index !== state.activeIndex)
  },

  modals: (state) => {
    return state.items.filter((item) => item.type === TaskbarItem.MODAL)
  }
}
