<template>
  <div>
    <div class="taskbar" ref="taskbar">
      <div
        v-for="(item, index) in items"
        ref="item"
        @click.self="activateItem(item)"
        :style="{ right: (50 + (180 * index)) + 'px' }"
        class="taskbar__item"
        :class="[ `taskbar__item--c-${item.colorIndex}` ]"
      >
        <div @click.self="activateItem(item)" class="taskbar-item__content">
          {{ $t(item.data.title) }}
          <span @click.prevent="closeItem(item.data)" class="taskbar-item__close"></span>
        </div>
      </div>
    </div>
    <modal ref="modal"></modal>
  </div>
</template>

<script>
export default {
  computed: {
    items() {
      return this.$store.getters['taskbar/idle_items']
    }
  },

  watch: {
    '$store.state.scale.ratio': function () {
      this.$refs.taskbar.style.transform = `scale(${this.$store.state.scale.ratio})`
      this.$refs.modal.$el.style.transform = `scale(${this.$store.state.scale.ratio})`
    }
  },

  methods: {
    activateItem(item) {
      this.$store.dispatch('taskbar/ACTIVATE_ITEM', item)
    },

    closeItem(item) {
      this.$store.dispatch('taskbar/REMOVE_ITEM', item)
    }
  }
}
</script>

<style lang="scss" src="./style.scss"></style>