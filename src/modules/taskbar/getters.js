import Taskbar from './model'

export default {
  activeItem: (state) => {
    return state.items.length >= state.activeIndex ? state.items[state.activeIndex] : null
  },

  idleItems: (state) => {
    return state.items.filter((item, index) => index !== state.activeIndex)
  },

  modals: (state) => {
    return state.items.filter((item) => item.type === Taskbar.TASKBAR_ITEM_MODAL)
  }
}
