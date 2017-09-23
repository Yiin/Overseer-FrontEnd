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
          <div @click="showTab(activeTabIndex - 1)" class="button button__modal button__modal--back" :class="{ 'button__modal--disabled': isFirstTabActive }">
            <i class="icon-prev"></i>
          </div>
          <div @click="$emit('cancel')" class="button button__modal button__modal--cancel">Cancel</div>
        </div>
        <div class="modal-buttons-group modal-buttons-group--right">
          <div @click="$emit('save')" class="button button__modal button__modal--save">Save</div>
          <div @click="showTab(activeTabIndex + 1)" class="button button__modal button__modal--next" :class="{ 'button__modal--disabled': isLastTabActive }">
            Next <i class="icon-next"></i>
          </div>
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
      // return this.$store.state.modal.tabs
      return this.$children
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
    // console.log(, this.$slots.default.filter((el) => el && el.componentInstance).map((el) => el.componentInstance))
    // this.$store.dispatch('UPDATE_MODAL_TABS', this.$children)
    if (this.activeTabIndex >= this.tabs.length) {
      throw new Error(`ModalTabs should contain at least ${this.activeTabIndex} tab(s).`)
    }

    this.tabs[this.activeTabIndex].isActive = true
    this.$forceUpdate()
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