export default {
  computed: {
    $user() {
      return this.$store.state.auth.user
    }
  },

  methods: {
    $can(action, document, scope = null) {
      if (typeof document === 'string' && !scope) {
        scope = this.$user.company
      }
      return this.$user.can(action, document, scope)
    }
  }
}
