import * as filters from '@/modules/table/filters'
import moment from 'moment'

export default (repository = {}, getters = null) => {
  return Object.assign({
    /**
     * Get available items from repository
     * @return {[type]} [description]
     */
    items(state, getters, rootState, rootGetters) {
      return rootGetters[repository.join('/') + '/AVAILABLE_COMPANY_ITEMS']
    },

    /**
     * Filter only active items.
     *
     * Active item is neither archived nor deleted
     */
    activeItems(state, getters) {
      return getters.items.filter(filters.IsActiveFilter.filter)
    },

    /**
     * Filter all available items
     */
    filteredItems(state, getters) {
      let items = getters.items.slice()

      let filterBy = state.filterBy.slice()

      /**
       * Filter items by specified filters
       */
      let scopedFilters = {}

      if (filterBy.length === 0) {
        // if no filters are selected, show only active items
        filterBy.push(filters.IsActiveFilter.scope + '.' + filters.IsActiveFilter.name)
        // filterBy.push(filters.IsArchivedFilter.scope + '.' + filters.IsArchivedFilter.name)
      }

      /**
       * First we need to group filters by their scope,
       * so matching algorithm becomes
       * (a1 OR a2) AND (b1) AND (c1 OR c2)
       * instead of
       * a1 AND a2 AND b1 AND c1 AND c2
       */
      filterBy.forEach((filterName) => {
        /**
         * We split name to [name, value], because some filters may be
         * formatted in format {filterName}:{filterValue}
         * e.g. 'countries:{countryId}'
         */
        const parts = filterName.split(':')
        const [[scope, name], value] = [parts.shift().split('.'), parts.join(':')]

        /**
         * Search for filter definition by its scope and name
         */
        for (let key in filters) {
          if (filters[key].scope === scope && filters[key].name === name) {
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
        /**
         * Order by date
         */
        if (a[state.orderBy] instanceof moment) {
          if (a[state.orderBy].isBefore(b[state.orderBy])) {
            return -1 * orderDir
          }
          if (a[state.orderBy].isAfter(b[state.orderBy])) {
            return 1 * orderDir
          }
          return 0
        }
        /**
         * Order by primitive property
         */
        if (a[state.orderBy] < b[state.orderBy]) {
          return -1 * orderDir
        }
        if (a[state.orderBy] > b[state.orderBy]) {
          return 1 * orderDir
        }
        return 0
      })

      return items
    },

    pageItems(state, getters) {
      const items = getters.filteredItems

      const start = state.page * state.rows_per_page
      const end = start + state.rows_per_page

      return items.slice(start, end)
    },

    pagesCount(state, getters) {
      return Math.ceil(getters.filteredItems.length / state.rows_per_page)
    }
  }, getters)
}
