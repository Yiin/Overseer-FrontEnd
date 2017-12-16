<template lang="pug">
  transition(name='fade')
    .tab__holder(
      v-show='isActive'
      :class='tabClasses'
    )
      .tab
        slot
</template>

<script>
export default {
  name: 'tab',

  inject: ['addTabItem', 'removeTabItem'],

  props: {
    active: {
      default: false
    },

    title: {
      type: String
    },

    tabKey: {
      type: String,
      default() {
        console.log('tabKey default:', this.title)
        return this.title
      }
    },

    fade: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    isActive: function (isActive) {
      this.$emit('state-changed', isActive)
    }
  },

  data() {
    return {
      isActive: !!this.active
    }
  },

  computed: {
    tabClasses() {
      return {
        '--relative': this.fade,
        '--disable-transition': !this.fade
      }
    }
  },

  mounted() {
    this.addTabItem({
      title: this.title,
      key: this.tabKey,
      setActive: this.setActive
    })
  },

  beforeDestroy() {
    this.removeTabItem(this.tabKey)
  },

  methods: {
    setActive(isActive) {
      this.isActive = isActive
    }
  }
}
</script>

<style lang="scss">
.tab__holder {
  position: relative;
}
</style>