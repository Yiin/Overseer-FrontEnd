<template>
  <div class="modal-tabs">
    <div class="modal-tabs__list">
      <div
        v-for="(tab, index) in tabs"
        v-if="tab.$vnode && tab.$vnode.tag && tab.$vnode.tag.indexOf('modal-tab') > -1"
        @mousedown="showTab(index)"
        class="modal__tab"
        :class="{ 'modal__tab--active': tab.isActive }"
      >
        <div class="tab-title">
          {{ tab.title }}
        </div>
      </div>
    </div>
    <div class="modal-tabs__content">
      <slot></slot>
      <div v-if="!hideButtons" slot="nav-buttons" class="modal-buttons">
        <div class="modal-buttons-group modal-buttons-group--left">
          <div @click="$emit('fill')" class="button button__modal button__modal--test">Test Data</div>
        </div>
        <div class="modal-buttons-group modal-buttons-group--right">
          <slot name="right-buttons">
            <div @click="$emit('save')" class="button button__modal button__modal--save">Save</div>
          </slot>
          <div @click="$emit('cancel')" class="button button__modal button__modal--cancel">Cancel</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal-tabs',

  props: {
    hideButtons: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    tabs() {
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

  watch: {
    activeTabIndex(index) {
      this.showTab(index)
    }
  },

  mounted() {
    if (this.activeTabIndex >= this.tabs.length) {
      throw new Error(`ModalTabs should contain at least ${this.activeTabIndex + 1} tab(s).`)
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