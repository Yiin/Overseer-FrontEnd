<template>
  <transition name="fade">
    <div v-show="isActive" class="tab__holder" :class="{ '--relative': fade, '--disable-transition': !fade }">
      <div class="tab">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'tab',

  props: {
    active: {
      default: false
    },
    title: {
      required: true
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
  }
}
</script>

<style lang="scss">
.tab__holder {
  position: relative;
}
</style>