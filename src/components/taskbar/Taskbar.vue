<template>
  <div>
    <modal></modal>
    <div class="taskbar">
      <div
        v-for="(item, index) in items"
        ref="item"
        @click="activateItem(item)"
        :style="{ right: (50 + (180 * index)) + 'px' }"
        class="taskbar__item"
      >
        {{ $t(item.data.title) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    items() {
      return this.$store.getters.idle_items
    }
  },

  methods: {
    activateItem(item) {
      this.$store.dispatch('ACTIVATE_TASKBAR_ITEM', item)
    }
  }
}
</script>

<style lang="scss" src="./style.scss"></style>