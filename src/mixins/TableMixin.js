import {
  editDocument,
  createDocument,
  patchDocument
} from '@/modules/documents/actions'
import Statuses from '@/modules/documents/statuses'

export default {
  computed: {
    tableName() {
      return this.name || this.data.name
    },

    state() {
      return this.$store.state.table[this.tableName]
    },

    availableItems() {
      return this.$store.getters[`table/${this.tableName}/items`]
    },

    filteredItems() {
      return this.$store.getters[`table/${this.tableName}/filteredItems`]
    },

    pageItems() {
      return this.$store.getters[`table/${this.tableName}/pageItems`]
    },

    list() {
      return {
        name: this.tableName,
        pageList: this.pageItems,
        selection: this.state.selection
      }
    }
  },

  mounted() {
    if (this.tableName) {
      this.$store.commit(`table/${this.tableName}/RESET_TABLE`)
    }
  },

  methods: {
    filterAndOrder(list, { filterBy = 'id', orderBy = 'name' }) {
      return list
        // sort by id and filter out duplicates
        .sort((a, b) => a[filterBy] < b[filterBy] ? (-1) : a[filterBy] > b[filterBy] ? (1) : 0)
        .filter((item, pos, arr) => !pos || item[filterBy] !== arr[pos - 1][filterBy])
        // now sort the way we wanted
        .sort((a, b) => {
          const [valA, valB] = [a[orderBy].toUpperCase(), b[orderBy].toUpperCase()]
          return valA < valB ? (-1) : valA > valB ? (1) : 0
        })
    },

    applyFiltersToShowHiddenResults() {
      if (!this.$refs.filterByComponent) {
        return
      }
      this.$refs.filterByComponent.$children[0].$children[0].open()

      const shouldBeChecked = [
        this.availableItems.filter(Statuses.generic.active.meetsCondition).length > 0,
        this.availableItems.filter(Statuses.generic.archived.meetsCondition).length > 0,
        this.availableItems.filter(Statuses.generic.deleted.meetsCondition).length > 0
      ]

      setTimeout(() => {
        const check = (i) => {
          if (i >= 3) {
            this.$store.dispatch(`table/${this.tableName}/RESET_ALL_FILTERS_BUT`, [
              'status.active',
              'status.archived',
              'status.deleted'
            ])
            return
          }
          const option = this.$refs.filterByComponent.$refs.checkboxOption[i]

          if (option) {
            if (shouldBeChecked[i]) {
              if (option.isChecked) {
                // all good, move on
                check(i + 1)
                return
              } else {
                // check
                this.$nextTick(() => option.check())
              }
            } else {
              if (!option.isChecked) {
                // all good, move on
                check(i + 1)
                return
              } else {
                // uncheck
                this.$nextTick(() => option.uncheck())
              }
            }
            setTimeout(() => check(i + 1), 370)
          }
        }
        setTimeout(() => check(0), 200)
      }, 100)
    },

    editDocument,
    createDocument,
    patchDocument
  }
}
