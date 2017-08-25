<template>
  <div v-if="isOpen" class="background-dim">
    <div v-clickaway="hide" class="modal-background">
      <div class="modal__title">
        {{ title }}
      </div>
      <div class="modal__controls">
        <div class="modal-icon modal-icon__hide" @click="hide"></div>
        <div class="modal-icon modal-icon__full"></div>
        <div class="modal-icon modal-icon__close" @click="close"></div>
      </div>
      <div class="modal__body">
        <component :is="component"></component>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal',

  computed: {
    isOpen() {
      return this.$store.state.modal.isOpen
    },

    title() {
      return this.$store.state.modal.title
    },

    component() {
      return this.$store.state.modal.component
    }
  },

  methods: {
    hide() {
      this.$store.dispatch('hideModal')
    },

    close() {
      this.$store.dispatch('closeModal')
    }
  }
}
</script>

<style lang="scss" src="@/styles/modal.scss"></style>