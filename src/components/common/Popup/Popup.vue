<template>
  <div v-if="isOpen" class="popup-wrapper">
    <div class="background-dim" @click="closePopup"></div>
    <div class="popup">
      <component :is="template" :data="templateData"></component>
    </div>
  </div>
</template>

<script>
export default {
  name: 'popup',

  computed: {
    state() {
      return this.$store.state.popup
    },

    isOpen() {
      return this.state.isOpen
    },

    template() {
      return this.state.template
    },

    templateData() {
      return this.state.templateData
    }
  },

  methods: {
    closePopup() {
      this.$store.dispatch('popup/CLOSE_POPUP')
    }
  }
}
</script>

<style lang="scss">
.popup {
    position: absolute;
    width: 800px;
    background: white;
    z-index: 1;
    left: calc(50% - 400px);
    top: 230px;
    border-radius: 4px;
}

.popup__header {
    padding: 20px;
    font-size: 18px;
    border-bottom: 1px solid #e3e3e3;
}

.popup__body {
    padding: 0 20px 20px 20px;
    font-size: 16px;
    line-height: 1.5;
}
</style>