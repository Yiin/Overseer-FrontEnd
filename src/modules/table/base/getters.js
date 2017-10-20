import * as filters from '@/modules/table/filters'

export default (getters) => Object.assign({
  isTableIdle(state) {
    return state.state === 'idle'
  },

  isTableLoading(state) {
    return state.state === 'loading'
  },

  items(state) {
    if (!state.itemsRelationsAreUpdated) {
      return []
    }

    return state.items
  },

  activeItems(state, getters) {
    return getters.items.filter(filters.IsActiveFilter.filter)
  },

  filteredItems(state, getters) {
    let items = getters.items

    /**
     * Filter items by specified filters
     */
    let scopedFilters = {}

    if (state.filterBy.length === 0) {
      // if no filters are selected, show only active items
      state.filterBy.push(filters.IsActiveFilter.name)
      state.filterBy.push(filters.IsArchivedFilter.name)
    }

    /**
     * First we need to group filters by their scope,
     * so matching algorithm becomes
     * (a1 OR a2) AND (b1) AND (c1 OR c2)
     * instead of
     * a1 AND a2 AND b1 AND c1 AND c2
     */
    state.filterBy.forEach((filterName) => {
      /**
       * We split name to [name, value], because some filters may be
       * formatted in format {filterName}:{filterValue}
       * e.g. 'countries:{countryId}'
       */
      const parts = filterName.split(':')
      const [name, value] = [parts.shift(), parts.join(':')]

      /**
       * Search for filter definition by its name
       */
      for (let key in filters) {
        if (filters[key].name === name) {
          const scope = filters[key].scope

          if (typeof scopedFilters[scope] === 'undefined') {
            scopedFilters[scope] = []
          }

          /**
           * Add it to grouped by scope filters list
           */
          scopedFilters[scope].push({
            filter: filters[key],
            value
          })
          break
        }
      }
    })

    /**
     * Once we have all filters grouped by scope,
     * we can then filter accordingly by their groups.
     */
    for (let scope in scopedFilters) {
      const filters = scopedFilters[scope]
      let matchingItems = []

      filters
        .filter((filter) => typeof filter.filter !== 'undefined')
        .forEach(({ filter, value }) => {
          const x = items.filter((item) => filter.filter(item, value))
          matchingItems = matchingItems.concat(x)
        })

      items = items.filter((item) => matchingItems.indexOf(item) > -1)
    }

    for (let field in state.searchBy) {
      const { key, id, value } = state.searchBy[field]

      for (let filterName in filters) {
        const filter = filters[filterName]

        if (typeof filter.searchBy !== 'undefined') {
          if (filter.id === id) {
            items = items.filter((item) => filter.searchBy(item, key, value))
            break
          }
        }
      }
    }

    const orderDir = state.orderDirection === 'desc' ? -1 : 1

    items.sort((a, b) => {
      if (a[state.orderBy] < b[state.orderBy]) {
        return -1 * orderDir
      } else if (a[state.orderBy] === b[state.orderBy]) {
        return 0
      } else {
        return 1 * orderDir
      }
    })
    return items
  },

  pageItems(state, getters) {
    const items = getters.filteredItems

    const start = state.page * state.rows_per_page
    const end = start + state.rows_per_page

    return items.slice(start, end)
  },

  pagesCount(state) {
    return Math.ceil(state.items.length / state.rows_per_page)
  }
}, getters)
