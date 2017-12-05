export default {
  methods: {
    $ready(fn) {
      if (process.env.NODE_ENV === 'production') {
        return this.$nextTick(fn)
      }

      setTimeout(() => {
        this.$nextTick(fn)
      })
    }
  }
}
