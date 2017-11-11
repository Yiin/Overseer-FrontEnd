import moment from 'moment'
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
 * Get key of the item.
 *
 * Most of the time, item key will be either
 * numeric id (e.g. 42), or uuid (e.g. 8724687b-0078-501d-8a68-302a5b45b5e7)
 * But there are cases (like vat info checks), when key may be
 * composed of item properties, in that case, we need to call
 * function with item, to get the actual key value of the item.
 */
export function getItemKey(item, key) {
  if (typeof key === 'string') {
    return item[key]
  }
  if (typeof key === 'function') {
    return key(item)
  }
}

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

  REFRESH_LIST(state) {
    state.items = state.items.slice()
  },

  /**
   * Remove items by their keys
   */
  REMOVE_ITEMS(state, itemsToRemove) {
    state.items = state.items.filter((item) => {
      // if item is not in the itemsToRemove array, keep it
      return itemsToRemove.findIndex((itemToRemove) => getItemKey(itemToRemove, state.key) === getItemKey(item, state.key)) === -1
    })
  },

  /**
   * Remove single item by its key
   */
  REMOVE_ITEM(state, itemToRemove) {
    state.items = state.items.filter((item) => getItemKey(item, state.key) !== getItemKey(itemToRemove, state.key))
  }
}, mutations)

/**
 * Base getters of the repository
 */
export const RepositoryGetters = (getters) => Object.assign({
  /**
   * Find item
   */
  FIND_ITEM(state) {
    return (itemData) => state.items.find((item) => {
      return getItemKey(item, state.key) === getItemKey(itemData, state.key)
    })
  },

  FIND_ITEM_BY_KEY(state) {
    return (itemKey) => state.items.find((item) => {
      return getItemKey(item, state.key) === itemKey
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
  ACTIVE_ITEMS(state, getters) {
    return getters.AVAILABLE_ITEMS.filter((item) => {
      return Statuses.generic.active.meetsCondition(item)
    })
  },

  /**
   * AA - Active and Archived
   */
  AA_ITEMS(state, getters) {
    return getters.AVAILABLE_ITEMS.filter((item) => {
      return Statuses.generic.active.meetsCondition(item) || Statuses.generic.archived.meetsCondition(item)
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
    return `${getters.API_NAME}-archive`
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
      items = items.map(Model.create, Model).filter((item) => item !== null)

      commit('SET_ITEMS', items)
    },

    /**
     * Add more items to the repository
     *
     * TODO: Maybe update existing items instead of
     * ignoring them completely?
     */
    ADD_ITEMS({ dispatch, commit, state }, items) {
      items = items.filter((item) => {
        // Filter out existing items
        return state.items.findIndex((existingItem) => {
          return getItemKey(existingItem, state.key) === getItemKey(item)
        }) === -1
      }).map(Model.create, Model)

      commit('ADD_ITEMS', items)
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
        if (moment(itemData.updated_at.date).unix() < item.updatedAt.unix()) {
          return item
        }
        item.update(itemData)
        commit('REFRESH_LIST')
      }
      return item
    },

    /**
     * Send API request to create a document
     */
    API_CREATE({ commit, dispatch, getters }, itemData) {
      const transformedData = Model.transformProps(itemData)

      return Api.post(getters.API_CREATE_URL, {
        [getters.API_RESOURCE_NAME]: transformedData
      }).then((createdItemData) => {
        dispatch('ADD_ITEM', createdItemData)
        return createdItemData
      })
    },

    /**
     * Send API request to save a document
     */
    API_UPDATE({ dispatch, getters }, itemData) {
      const transformedData = Model.transformProps(itemData)
      if ('restoredFromActivity' in itemData) {
        transformedData.restoredFromActivity = itemData.restoredFromActivity
      }

      return Api.put(getters.API_UPDATE_URL(itemData), {
        [getters.API_RESOURCE_NAME]: transformedData
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
          if (updatedItemData) {
            dispatch('UPDATE_ITEM', updatedItemData)
          } else {
            commit('REMOVE_ITEM', itemData)
          }
          return updatedItemData
        })
    },

    API_DELETE_MANY({ commit, dispatch, getters, state }, keys) {
      return Api.post(getters.API_DELETE_MANY_URL, {
        keys
      }).then((updatedItemsData) => {
        keys.forEach((key) => {
          const updatedItemData = updatedItemsData.find((updatedItemData) => getItemKey(updatedItemData, state.key) === key)
          if (updatedItemData) {
            dispatch('UPDATE_ITEM', updatedItemData)
          } else {
            commit('REMOVE_ITEM', {
              [state.key]: key
            })
          }
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
    /**
     * Get all available items in the repository
     */
    getAvailableItems() {
      return getContext().getters.AVAILABLE_ITEMS
    },

    /**
     * Add more items to the repository
     */
    addItems(items) {
      return getContext().dispatch('ADD_ITEMS', items)
    },

    /**
     * Add single item to the repository
     */
    addItem(item) {
      return getContext().dispatch('ADD_ITEM', item)
    },

    /**
     * Return array of matched items by specified props
     *
     * All given properties of item should match for it to be
     * considerend as valid match.
     */
    findMany(props) {
      return getContext().getters.AVAILABLE_ITEMS.filter((item) => {
        for (let prop in props) {
          if (item[prop] !== props[prop]) {
            return false
          }
        }
        return true
      })
    },

    /**
     * Find item by its key
     *
     * Returns undefined if item wasn't found.
     */
    findByKey(itemKey) {
      return getContext().getters.FIND_ITEM_BY_KEY(itemKey)
    },

    /**
     * Find item by its key, but takes
     * whole instance as a parameter
     */
    find(itemData) {
      const context = getContext()

      if (typeof itemData === 'undefined' || itemData === null) {
        return null
      }

      return context.getters.FIND_ITEM(itemData)
    },

    /**
     * Find item by its key, and create a new one
     * with given data if no item was found.
     *
     * Also adds created item to the repository.
     */
    findOrCreate(itemDataOrKeyValue) {
      if (typeof itemDataOrKeyValue === 'undefined' || itemDataOrKeyValue === null) {
        return null
      }
      let item = null
      if (typeof itemDataOrKeyValue !== 'object') {
        item = this.findByKey(itemDataOrKeyValue)
      } else {
        item = this.find(itemDataOrKeyValue)
      }

      if (item) {
        return item
      } else if (item !== null) {
        return getContext().dispatch('ADD_ITEM', itemDataOrKeyValue)
      }
    }
  }, methods(getContext))
}
