/**
 * Base Repository
 *
 * Contains factory functions to make repository
 * state, getters, mutations and actions for
 * vuex store.
 *
 * Also provides a function to make helper methods.
 *
 * TODO:
 *   - Create additional functions that
 *     1) Checks if item exists in given array by key.
 *     2) Checks if key exists in given array of models.
 *
 *   - Refactor repositories to use better pattern? This
 *     structure is quite a mess.
 */

import moment from 'moment'
import Api from '@/api'
import { getStoreModule } from '@/store'
import Statuses from '../statuses'
import { SELECTED_COMPANY_ITEMS } from '../helpers/filters'

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
 * composed of item properties, in that case, we need to call a
 * function with passed item as a parameter, to get the actual
 * value of the item key.
 */
export function getItemKey(item, key) {
  // item is already presented as a key
  if (typeof item === 'string') {
    return item
  }
  if (typeof key === 'string') {
    return item[key]
  }
  if (typeof key === 'function') {
    return key(item)
  }
  return item
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
      const itemKey = getItemKey(item, state.key)

      // if item is not in the itemsToRemove array, keep it
      return itemsToRemove.findIndex((itemToRemove) => getItemKey(itemToRemove, state.key) === itemKey) === -1
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
   * Return company items
   */
  AVAILABLE_COMPANY_ITEMS(state, getters) {
    return getters.AVAILABLE_ITEMS.filter(SELECTED_COMPANY_ITEMS)
  },

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
   * Return list of active items
   *
   * Active items are neither deleted nor archived
   */
  ACTIVE_ITEMS(state, getters) {
    return getters.AVAILABLE_ITEMS.filter((item) => {
      return Statuses.generic.active.meetsCondition(item)
    })
  },

  ACTIVE_COMPANY_ITEMS(state, getters) {
    return getters.ACTIVE_ITEMS.filter(SELECTED_COMPANY_ITEMS)
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
      items = items
        // Filter out duplicates
        .reduce((items, item) => {
          const itemKey = getItemKey(item, state.key)

          if (items.findIndex((uniqItem) => getItemKey(uniqItem, state.key) === itemKey) < 0) {
            return items.concat(item)
          }
          return items
        }, [])
        // Filter out existing items
        .filter((item) => {
          const itemKey = getItemKey(item, state.key)

          return state.items.findIndex((existingItem) => {
            return getItemKey(existingItem, state.key) === itemKey
          }) === -1
        })
        // Create models
        .map(Model.create, Model)

      if (!items.length) {
        return
      }

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
    API_CREATE({ commit, dispatch, getters, rootState }, itemData) {
      const transformedData = Model.serializeData(itemData)

      transformedData.company_uuid = rootState.auth.user.company.uuid

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
      const transformedData = Model.serializeData(itemData)

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
    setModel(Model) {
      this.Model = Model
      return this
    },

    /**
     * Get all available items in the repository
     */
    getAvailableItems() {
      return getContext().getters.AVAILABLE_ITEMS
    },

    getAvailableCompanyItems() {
      return getContext().getters.AVAILABLE_COMPANY_ITEMS
    },

    getActiveItems() {
      return getContext().getters.ACTIVE_ITEMS
    },

    getActiveCompanyItems() {
      return getContext().getters.ACTIVE_COMPANY_ITEMS
    },

    /**
     * Add more items to the repository
     *
     * @return {Promise}
     */
    addItems(items) {
      return getContext().dispatch('ADD_ITEMS', items)
    },

    /**
     * Add single item to the repository
     *
     * @return {Model} item model instance
     */
    addItem(item) {
      getContext().dispatch('ADD_ITEM', item)
      return this.find(item)
    },

    first() {
      const items = getContext().getters.AVAILABLE_ITEMS
      return items.length ? items[0] : undefined
    },

    last() {
      const items = getContext().getters.AVAILABLE_ITEMS
      return items.length ? items[items.length - 1] : undefined
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
     * Create new item instance
     */
    createItem(itemData) {
      if (typeof itemData === 'undefined' || itemData === null) {
        return null
      }

      if (typeof this.Model === 'undefined') {
        throw new Error(`setModel is missing for ${module} repository.`)
      }

      return this.Model.create(itemData)
    },

    /**
     * Find item by its key, and create a new one
     * with given data if no item was found.
     *
     * Also adds created item to the repository.
     */
    findOrCreate(itemDataOrKeyValue, addToRepository = true) {
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
        if (addToRepository) {
          return this.addItem(itemDataOrKeyValue)
        } else {
          return this.createItem(itemDataOrKeyValue)
        }
      }
    }
  }, methods(getContext))
}
