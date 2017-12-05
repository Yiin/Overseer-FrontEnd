<template lang="pug">
  .modal-tabs
    .modal-tabs__list
      .modal__tab(
        v-for='(tab, index) in tabs'
        @mousedown='showTab(index)'
        :class="{ 'modal__tab--active': index === activeTabIndex }"
      )
        .tab-title
          .tab-number {{ index + 1 }}
          .tab-text {{ tab.title }}

    .modal-tabs__content

      slot

      .modal-buttons(slot="nav-buttons")

        //-
          Buttons on the left

        .modal-buttons-group.modal-buttons-group--left

          .button.button__modal.button__modal--test(
            v-if="type !== 'revision'"
            @click="$emit('fill')"
            :class="{ 'button__modal--test-hidden': !isGuest }"
          ) Test Data

        //-
          Buttons on the right

        .modal-buttons-group.modal-buttons-group--right
          slot(
            v-if="type !== 'revision'"
            name="right-buttons--left"
          )

          //-
            Cancel

          .button.button__modal.button__modal--cancel(
            @click="$emit('cancel')"
          ) {{ type === 'revision' ? 'Close' : 'Cancel' }}

          //-
            Restore

            Only visible if we're displaying previous state
            of the document.

          .button.button__modal.button__modal--save(
            v-if="type === 'revision'"
            @click="$emit('save')"
          ) Restore

          //-
            Save button(s)

          slot(
            v-else
            name="right-buttons"
          )
            .button.button__modal.button__modal--save(
              @click="$emit('save')"
            ) Save
</template>

<script>
/**
 * It's actually more like form-tabs than modal ones,
 * but there is no time for naming change atm.
 *
 * TODO: either rewrite this whole form stuff or
 * rename components to correctly reflect their usage.
 *
 * edit: on the second thought, modals are used basically
 * exclusively for forms only, so it probably doesn't really matter..
 */
export default {
  name: 'modal-tabs',

  provide() {
    return {
      addTabItem: (title, setActive) => {
        this.registerTabItem(title, setActive)
      },
      removeTabItem: (title) => {
        this.unregisterTabItem(title)
      }
    }
  },

  data() {
    return {
      tabs: []
    }
  },

  computed: {
    isGuest() {
      return this.$store.state.auth.user.guest_key
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

    this.showTab(this.activeTabIndex)
  },

  methods: {
    registerTabItem(title, setActive) {
      this.tabs.push({ title, setActive })
    },

    unregisterTabItem(title) {
      this.tabs = this.tabs.filter((tab) => tab.title !== title)
    },

    showTab(index) {
      if (index < 0 || index >= this.tabs.length) {
        return
      }

      this.$store.dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', index)

      this.tabs.forEach((tab, tabIndex) => {
        tab.setActive(tabIndex === this.activeTabIndex)
      })
    }
  }
}
</script>