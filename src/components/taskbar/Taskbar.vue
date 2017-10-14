<template>
  <div>
    <modal></modal>
    <div class="taskbar">
      <div @click="activateItem(item)" v-for="(item, index) in items" class="taskbar__item">
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