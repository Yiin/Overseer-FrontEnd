export default {
  data() {
    return {
      isReversed: false
    }
  },

  methods: {
    updateReversible(height) {
      this.$ready(this._updateReversible(height))
    },

    _updateReversible(height) {
      const rect = this.$refs.reversibleEl.getBoundingClientRect()

      this.isReversed = rect.top + height > window.innerHeight
    }
  }
}
