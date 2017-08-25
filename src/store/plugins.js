import { STORAGE_KEY } from './state'

const localStoragePlugin = (store) => {
  store.subscribe((mutation, state) => {
    // sync whole state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))

    if (mutation.type === 'CLEAR_ALL_DATA') {
      localStorage.removeItem(STORAGE_KEY)
    }
  })
}

// TODO: setup env
// export default process.env.NODE_ENV !== 'production' ? [localStoragePlugin] : [localStoragePlugin]
export default [localStoragePlugin]
