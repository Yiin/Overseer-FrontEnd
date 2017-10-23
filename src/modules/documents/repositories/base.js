import Api from '@/api'
import { getStoreModule } from '@/store'
import Statuses from '../statuses'

/**
 * Base state of the repository
 */
export const RepositoryState = (state) => Object.assign({
  key: 'uuid',
  items: []
}, state)

/**
 * Base mutations of the repository
 */
export const RepositoryMutations = (mutations) => Object.assign({
  SET_ITEMS(state, items) {
    state.items = items
  },

  CLEAR_ITEMS(state) {
    state.items = []
  },

  ADD_ITEMS(state, items) {
    state.items = state.items.concat(items)
  },

  ADD_ITEM(state, item) {
    state.items.push(item)
  },

  /**
   * Remove items by their keys
   */
  REMOVE_ITEMS(state, items) {
    state.items = state.items.filter((item) => {
      return items.findIndex((itemToRemove) => itemToRemove[state.key] === item[state.key]) === -1
    })
  },

  /**
   * Remove single item by its key
   */
  REMOVE_ITEM(state, itemToRemove) {
    state.items = state.items.filter((item) => item[state.key] !== itemToRemove[state.key])
  }
}, mutations)

/**
 * Base getters of the repository
 */
export const RepositoryGetters = (getters) => Object.assign({
  /**
   * Find item by its key
   */
  FIND_ITEM(state) {
    return (itemData) => state.items.find((item) => {
      return item[state.key] === itemData[state.key]
    })
  },

  /**
   * Return list of available items
   *
   * Item is not available, if it's parent is not
   * available (e.g. it was soft deleted).
   */
  AVAILABLE_ITEMS(state) {
    return state.items.filter((item) => {
      return !item.isDisabled
    })
  },

  /**
   * Return list of active items
   *
   * Active items are neither deleted nor archived
   */
  ACTIVE_ITEMS(state) {
    return state.items.filter((item) => {
      return Statuses.generic.active.meetsCondition(item)
    })
  },

  API_NAME: () => {
    return 'UNDEFINED_API_NAME'
  },
  API_RESOURCE_NAME: () => {
    return 'UNDEFINED_API_RESOURCE_NAME'
  },
  API_CREATE_URL: (state, getters) => {
    return `${getters.API_NAME}`
  },
  API_UPDATE_URL: (state, getters) => {
    return (item) => `${getters.API_NAME}/${item.uuid}`
  },
  API_PATCH_URL: (state, getters) => {
    return (item) => `${getters.API_NAME}/${item.uuid}`
  },
  API_ARCHIVE_URL: (state, getters) => {
    return (item) => `${getters.API_NAME}/${item.uuid}/archive`
  },
  API_ARCHIVE_MANY_URL: (state, getters) => {
    return `${getters.API_NAME}-archive'`
  },
  API_DELETE_URL: (state, getters) => {
    return (item) => `${getters.API_NAME}/${item.uuid}`
  },
  API_DELETE_MANY_URL: (state, getters) => {
    return `${getters.API_NAME}-delete`
  },
  API_UNARCHIVE_URL: (state, getters) => {
    return (item) => `${getters.API_NAME}/${item.uuid}/unarchive`
  },
  API_UNARCHIVE_MANY_URL: (state, getters) => {
    return `${getters.API_NAME}-unarchive`
  },
  API_RESTORE_URL: (state, getters) => {
    return (item) => `${getters.API_NAME}/${item.uuid}/restore`
  },
  RESTORE_MANY_URL: (state, getters) => {
    return `${getters.API_NAME}-restore`
  }
}, getters)

/**
 * Base actions of the repository
 */
export const RepositoryActions = (Model, actions) => {
  return Object.assign({
    /**
     * Set repository items
     */
    SET_ITEMS({ dispatch, commit }, items) {
      items = items.map(Model.create)

      commit('SET_ITEMS', items)
    },

    /**
     * Add new or update existing item in the repository.
     */
    ADD_ITEM({ getters, dispatch, commit }, itemData) {
      const item = getters.FIND_ITEM(itemData)

      if (item) {
        dispatch('UPDATE_ITEM', itemData)
      } else {
        const createdItem = Model.create(itemData)

        if (createdItem) {
          commit('ADD_ITEM', createdItem)
        }
        return createdItem
      }
      return item
    },

    /**
     * Update existing item
     */
    UPDATE_ITEM({ getters, commit, state }, itemData) {
      const item = getters.FIND_ITEM(itemData)

      if (item) {
        item.update(itemData)
        commit('REMOVE_ITEM', item)
        commit('ADD_ITEM', item)
      }
      return item
    },

    /**
     * Send API request to create a document
     */
    API_CREATE({ commit, dispatch, getters }, itemData) {
      return Api.post(getters.API_CREATE_URL, {
        [getters.API_RESOURCE_NAME]: itemData
      }).then((createdItemData) => {
        dispatch('ADD_ITEM', createdItemData)
        return createdItemData
      })
    },

    /**
     * Send API request to save a document
     */
    API_UPDATE({ dispatch, getters }, itemData) {
      return Api.put(getters.API_UPDATE_URL(itemData), {
        [getters.API_RESOURCE_NAME]: itemData
      }).then((updatedItemData) => {
        dispatch('UPDATE_ITEM', updatedItemData)
        return updatedItemData
      })
    },

    /**
     * Send API request to patch document
     */
    API_PATCH({ dispatch, getters }, itemData) {
      return Api.patch(getters.API_PATCH_URL(itemData), {
        [getters.API_RESOURCE_NAME]: itemData
      }).then((updatedItemData) => {
        dispatch('UPDATE_ITEM', updatedItemData)
        return updatedItemData
      })
    },

    /**
     * Send API request to archive document
     */
    API_ARCHIVE({ commit, dispatch, getters }, itemData) {
      return Api.post(getters.API_ARCHIVE_URL(itemData))
        .then((updatedItemData) => {
          dispatch('UPDATE_ITEM', updatedItemData)
          return updatedItemData
        })
    },

    API_ARCHIVE_MANY({ commit, dispatch, getters }, keys) {
      return Api.post(getters.API_ARCHIVE_MANY_URL, {
        keys
      }).then((updatedItemsData) => {
        updatedItemsData.forEach((updatedItemData) => {
          dispatch('UPDATE_ITEM', updatedItemData)
        })
        return updatedItemsData
      })
    },

    API_DELETE({ commit, dispatch, getters }, itemData) {
      return Api.delete(getters.API_DELETE_URL(itemData))
        .then((updatedItemData) => {
          dispatch('UPDATE_ITEM', updatedItemData)
          return updatedItemData
        })
    },

    API_DELETE_MANY({ commit, dispatch, getters }, keys) {
      return Api.post(getters.API_DELETE_MANY_URL, {
        keys
      }).then((updatedItemsData) => {
        updatedItemsData.forEach((updatedItemData) => {
          dispatch('UPDATE_ITEM', updatedItemData)
        })
        return updatedItemsData
      })
    },

    API_UNARCHIVE({ commit, dispatch, getters }, itemData) {
      return Api.post(getters.API_UNARCHIVE_URL(itemData))
        .then((updatedItemData) => {
          dispatch('UPDATE_ITEM', updatedItemData)
          return updatedItemData
        })
    },

    API_UNARCHIVE_MANY({ commit, dispatch, getters }, keys) {
      return Api.post(getters.API_UNARCHIVE_MANY_URL, {
        keys
      }).then((updatedItemsData) => {
        updatedItemsData.forEach((updatedItemData) => {
          dispatch('UPDATE_ITEM', updatedItemData)
        })
        return updatedItemsData
      })
    },

    API_RESTORE({ commit, dispatch, getters }, itemData) {
      return Api.post(getters.API_RESTORE_URL(itemData))
        .then((updatedItemData) => {
          dispatch('UPDATE_ITEM', updatedItemData)
          return updatedItemData
        })
    },

    API_RESTORE_MANY({ commit, dispatch, getters }, keys) {
      return Api.post(getters.RESTORE_MANY_URL, {
        keys
      }).then((response) => {
        response.forEach((row) => {
          dispatch('UPDATE_ITEM', row)
        })
        return response
      })
    }
  }, actions)
}

/**
 * Repository helper methods
 */
export const RepositoryMethods = (module, methods = () => {}) => {
  const getContext = () => getStoreModule(['documents', 'repositories', module])

  return Object.assign({
    getAvailableItems() {
      return getContext().getters.AVAILABLE_ITEMS
    },

    findOrCreate(itemDataOrKeyValue) {
      const context = getContext()
      const key = context.state.key

      console.log('key', key, itemDataOrKeyValue)

      if (
        typeof itemDataOrKeyValue === 'undefined' ||
        itemDataOrKeyValue === null ||
        typeof itemDataOrKeyValue[key] === 'undefined' ||
        itemDataOrKeyValue[key] === null
      ) {
        return undefined
      }

      let itemData = {}

      if (typeof itemDataOrKeyValue !== 'object') {
        itemData[key] = itemDataOrKeyValue
      } else {
        itemData = itemDataOrKeyValue
      }

      const item = context.getters.FIND_ITEM(itemDataOrKeyValue)
      console.log('findOrCreate by', key, '->', item, itemDataOrKeyValue)

      if (item) {
        return item
      } else {
        return getContext().dispatch('ADD_ITEM', itemDataOrKeyValue)
      }
    }
  }, methods(getContext))
}
