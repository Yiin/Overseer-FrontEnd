<template>
  <div class="modal-tabs">
    <div class="modal-tabs__list">
      <div
        v-for="(tab, index) in tabs"
        @mousedown="showTab(index)"
        class="modal__tab"
        :class="{ 'modal__tab--active': tab.isActive }"
      >
        <div class="tab-number">
          {{ index + 1 }}
        </div>
        <div class="tab-title">
          {{ tab.title }}
        </div>
      </div>
    </div>
    <div class="modal-tabs__content">
      <slot></slot>
      <div slot="nav-buttons" class="modal-buttons">
        <div class="modal-buttons-group modal-buttons-group--left">
          <div @click="showTab(activeTabIndex - 1)" class="modal-button modal-button__back" :class="{ 'modal-button--disabled': isFirstTabActive }"><</div>
          <div @click="$emit('cancel')" class="modal-button modal-button__cancel">Cancel</div>
        </div>
        <div class="modal-buttons-group modal-buttons-group--right">
          <div @click="$emit('save')" class="modal-button modal-button__save">Save</div>
          <div @click="showTab(activeTabIndex + 1)" class="modal-button modal-button__next" :class="{ 'modal-button--disabled': isLastTabActive }">Next ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal-tabs',

  computed: {
    tabs() {
      return this.$store.state.modal.tabs
    },

    activeTabIndex() {
      return this.$store.state.modal.activeTabIndex
    },

    isFirstTabActive() {
      return !this.activeTabIndex
    },

    isLastTabActive() {
      return this.activeTabIndex === this.tabs.length - 1
    }
  },

  mounted() {
    this.$store.dispatch('UPDATE_MODAL_TABS', this.$children)

    if (this.activeTabIndex >= this.tabs.length) {
      throw new Error(`ModalTabs should contain at least ${this.activeTabIndex} tab(s).`)
    }

    this.tabs[this.activeTabIndex].isActive = true
  },

  methods: {
    showTab(index) {
      if (index < 0 || index >= this.tabs.length) {
        return
      }

      this.$store.dispatch('UPDATE_MODAL_ACTIVE_TAB_INDEX', index)

      this.tabs.forEach((tab, index) => {
        tab.isActive = (index === this.activeTabIndex)
      })
    }
  }
}
</script>