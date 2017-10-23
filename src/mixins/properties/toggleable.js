export default {
  data() {
    return {
      isOpen: false
    }
  },

  methods: {
    show() {
      this.isOpen = true
    },
    hide() {
      this.isOpen = false
    },
    toggle() {
      this.isOpen = !this.isOpen
    }
  }
}
