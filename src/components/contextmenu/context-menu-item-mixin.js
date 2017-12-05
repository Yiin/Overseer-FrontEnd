import ContextMenuItemIcon from './ContextMenuItemIcon.vue'

export default {
  components: {
    ContextMenuItemIcon
  },

  props: {
    item: {
      required: true
    }
  },

  computed: {
    scope() {
      return this.$store.state.contextmenu.scope
    },

    isVisible() {
      return typeof this.item.isVisible === 'function'
          ? this.item.isVisible()
          : true
    },

    itemClasses() {
      return [
        {
          separator: this.item.isSeparator,
          static: this.item.props.isStatic,
          heading: this.item.props.isHeading
        }, this.item.class
      ]
    }
  },

  methods: {
    select() {
      if ('handle' in this.item) {
        this.item.handle()
      }
      if (!('closeOnSelect' in this.item.props) || this.item.props.closeOnSelect) {
        this.$store.dispatch('contextmenu/CLOSE')
      }
    }
  }
}
