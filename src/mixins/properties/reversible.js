export default {
  data() {
    return {
      isReversed: true
    }
  },

  methods: {
    updateReversible() {
      this.$nextTick(() => {
        this.$nextTick(() => {
          this._updateReversible()
        })
      })
    },

    _updateReversible(tryAgain = true) {
      if (!this.$refs.reversibleEl) {
        this.isReversed = false
        if (tryAgain) {
          setTimeout(() => this._updateReversible(false), 10)
        }
        return
      }

      const rect = this.$refs.reversibleEl.getBoundingClientRect()

      this.isReversed = rect.top + rect.height + 10 > window.innerHeight
    }
  }
}
