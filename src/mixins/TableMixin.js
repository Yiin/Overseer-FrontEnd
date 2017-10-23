import {
  editDocument,
  createDocument,
  patchDocument
} from '@/modules/documents/actions'

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

    list() {
      return {
        name: this.tableName,
        pageList: this.$store.getters[`table/${this.tableName}/pageItems`],
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
        .sort((a, b) => a[filterBy] < b[filterBy] ? (-1) : a[filterBy] > b[filterBy] ? (1) : 0)
        .filter((item, pos, arr) => !pos || item[filterBy] !== arr[pos - 1][filterBy])
        .sort((a, b) => {
          const [valA, valB] = [a[orderBy].toUpperCase(), b[orderBy].toUpperCase()]
          return valA < valB ? (-1) : valA > valB ? (1) : 0
        })
    },

    applyFiltersToShowHiddenResults() {
      console.log('applyFiltersToShowHiddenResults', this.$refs.filterByComponent)
      if (!this.$refs.filterByComponent) {
        return
      }
      this.$refs.filterByComponent.$children[0].$children[0].open()

      setTimeout(() => {
        const check = (i) => {
          if (i >= 3) {
            return
          }
          const option = this.$refs.filterByComponent.$refs.checkboxOption[i]

          if (option) {
            if (option.isChecked) {
              check(i + 1)
            } else {
              this.$nextTick(() => option.check())
              setTimeout(() => check(i + 1), 370)
            }
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
