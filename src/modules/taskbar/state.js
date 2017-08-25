import { STORAGE_KEY } from '@/store/state'

let state = {
  items: [/* { type: 'modal', data } */],
  activeIndex: null
}

// Sync with local storage.
if (localStorage.getItem(STORAGE_KEY)) {
  state = Object.assign(state, JSON.parse(localStorage.getItem(STORAGE_KEY)).taskbar)
}

export default state
