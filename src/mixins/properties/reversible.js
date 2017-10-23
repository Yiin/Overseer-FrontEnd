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

    _updateReversible() {
      if (!this.$refs.reversibleEl) {
        this.isReversed = false
        return
      }

      const rect = this.$refs.reversibleEl.getBoundingClientRect()

      console.log(rect, window.innerHeight)

      this.isReversed = rect.top + rect.height + 50 > window.innerHeight
    }
  }
}
