import { STORAGE_KEY } from '@/store/state'

let state = {
  isOpen: false,
  title: '',
  component: ''
}

// Sync with local storage.
if (localStorage.getItem(STORAGE_KEY)) {
  state = Object.assign(state, JSON.parse(localStorage.getItem(STORAGE_KEY)).modal)
}

// Merge state and export it.
export default state
