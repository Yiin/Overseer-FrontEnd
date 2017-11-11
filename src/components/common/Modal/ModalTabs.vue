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
          <div class="tab-number">
            {{ index + 1 }}
          </div>
          <div class="tab-text">
            {{ tab.title }}
          </div>
        </div>
      </div>
    </div>
    <div class="modal-tabs__content">
      <slot></slot>
      <div slot="nav-buttons" class="modal-buttons">
        <div class="modal-buttons-group modal-buttons-group--left">
          <div v-if="type !== 'revision'" @click="$emit('fill')" class="button button__modal button__modal--test" :class="{
            'button__modal--test-hidden': !isGuest
          }">Test Data</div>
        </div>
        <div class="modal-buttons-group modal-buttons-group--right">
          <slot v-if="type !== 'revision'" name="right-buttons--left"></slot>
          <div @click="$emit('cancel')" class="button button__modal button__modal--cancel">
            {{ type === 'revision' ? 'Close' : 'Cancel' }}
          </div>

          <div v-if="type === 'revision'" @click="$emit('save')" class="button button__modal button__modal--save">Restore</div>
          <slot v-else name="right-buttons">
            <div @click="$emit('save')" class="button button__modal button__modal--save">Save</div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * It's actually more like form-tabs than modal ones,
 * but there is no time for naming change atm.
 *
 * TODO: either rewrite this whole form stuff or
 * rename components to correctly reflect their usage.
 */
export default {
  name: 'modal-tabs',

  computed: {
    isGuest() {
      return this.$store.state.auth.user.guest_key
    },

    tabs() {
      return this.$children
    },

    type() {
      return this.$store.state.modal.data.type
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

      this.$store.dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', index)

      this.tabs.forEach((tab, index) => {
        tab.isActive = (index === this.activeTabIndex)
      })
    }
  }
}
</script>