<template>
  <div class="modal-tabs">
    <div class="modal-tabs__list">
      <div
        v-for="(tab, index) in tabs"
        @click="showTab(index)"
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal-tabs',

  data() {
    return {
      tabs: [],
      activeTabIndex: 0
    }
  },

  mounted() {
    this.tabs = this.$children

    if (this.activeTabIndex >= this.tabs.length) {
      throw new Error(`ModalTabs should contain at least ${this.activeTabIndex} tab(s).`)
    }

    this.tabs[this.activeTabIndex].isActive = true
  },

  methods: {
    showTab(index) {
      this.activeTabIndex = index

      this.tabs.forEach((tab, index) => {
        tab.isActive = (index === this.activeTabIndex)
      })
    }
  }
}
</script>