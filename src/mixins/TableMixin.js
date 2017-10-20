import {
  editDocument,
  createDocument,
  patchDocument
} from '@/modules/documents/actions'

export default {
  computed: {
    state() {
      return this.$store.state.table[this.name]
    },

    list() {
      return {
        name: this.name,
        pageList: this.$store.getters[`table/${this.name}/pageItems`],
        selection: this.state.selection
      }
    }
  },

  mounted() {
    if (this.name) {
      this.$store.commit(`table/${this.name}/RESET_TABLE`)
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

    editDocument,
    createDocument,
    patchDocument
  }
}
