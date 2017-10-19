<template>
  <div>
    <div class="taskbar">
      <div
        v-for="(item, index) in items"
        ref="item"
        @click.self="activateItem(item)"
        :style="{ right: (50 + (180 * index)) + 'px' }"
        class="taskbar__item"
      >
        <div @click.self="activateItem(item)" class="taskbar-item__content">
          {{ $t(item.data.title) }}
          <span @click.prevent="closeItem(item.data)" class="taskbar-item__close"></span>
        </div>
      </div>
    </div>
    <modal></modal>
  </div>
</template>

<script>
export default {
  computed: {
    items() {
      return this.$store.getters['taskbar/idle_items']
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