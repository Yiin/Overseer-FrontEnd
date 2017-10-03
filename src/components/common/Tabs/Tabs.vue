<template>
  <div class="tabs" :class="{ 'tabs--labeled': labels, 'tabs--no-tabs': noTabs }">
    <div v-if="!noTabs" class="tabs__list">
      <div v-for="tab in tabs"
          @mousedown="selectTab(tab)"
           class="tab__title"
          :class="{ 'tab__title--active': tab.isActive }"
          :title="tab.title"
      >
        {{ tab.title }}
      </div>
    </div>
    <div class="tabs__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tabs',

  props: {
    labels: {
      type: Boolean,
      default: false
    },

    noTabs: {
      type: Boolean,
      default: false
    },

    visualsOnly: {
      type: Boolean,
      default: false
    },

    tab: {
      default: undefined
    }
  },

  data() {
    return {
      tabs: []
    }
  },

  watch: {
    tab(currentTab) {
      this.selectTab(currentTab)
    }
  },

  methods: {
    selectTab(tab, initial = false) {
      if (this.visualsOnly && !initial) {
        this.$emit('change', typeof tab === 'string' ? tab : tab.title)
        return
      }

      if (typeof tab === 'string') {
        tab = this.tabs.find((_tab) => _tab.title === tab)
        if (!tab) {
          return
        }
      }
      this.activeTab = tab

      this.tabs.forEach((_tab) => {
        _tab.isActive = (_tab === tab)
      })

      if (!initial) {
        this.$emit('change', tab.title)
      }
    },

    reset() {
      if (this.visualsOnly) {
        return
      }
      this.selectTab(this.tabs[0])
    }
  },

  mounted() {
    this.tabs = this.$children

    const defaultTab = this.tabs.find((tab) => tab.title === this.tab)

    if (defaultTab) {
      this.selectTab(defaultTab, true)
    } else {
      this.selectTab(this.tabs[0], true)
    }
  }
}
</script>

<style lang="scss">

.tabs:not(.tabs--labeled) {
  > .tabs__list {
    display: flex;
    margin-bottom: 20px;
    border-bottom: 4px solid #eee;

    > .tab__title {
        line-height: 52px;
        height: 52px;
        font-size: 16px;
        padding: 0 20px;
        position: relative;
        cursor: pointer;
    }

    > .tab__title::before {
        font-weight: 600;
        display: block;
        visibility: hidden;
        overflow: hidden;
        height: 0;
        content: attr(title);
        color: transparent;
    }

    > .tab__title--active::after,
    > .tab__title:hover::after {
        content: "";
        position: absolute;
        width: 100%;
        display: block;
        height: 4px;
        margin-left: -20px;
    }

    > .tab__title--active::after {
        background: $color-main;
    }

    > .tab__title:hover::after {
        // background: $color-dusty-gray;
    }
  }
}

.tabs--labeled {
  transition: opacity .2s ease-in-out;
  position: relative;
  padding: 0;
  margin: 0 0 7px;
  width: 100%;

  .tab {
      display: inline;
  }

  .tab:first-child .tab__title {
      padding-left: 9px;
  }

  .tab__title {
      position: relative;
      font-weight: 400;
      color: #424770;
      font-size: 15px;
      line-height: 26px;
      padding: 0 13px;
      display: inline-block;
      text-decoration: none;
      cursor: pointer;
  }

  .tab__separator {
      margin-left: 23px;
  }

  .tab .db-is-disabled {
      pointer-events: none;
      color: #8898aa
  }

  .tab .db-separator:before {
      content: "";
      height: 11px;
      width: 1px;
      background: #cfd7df;
      display: inline-block;
      position: absolute;
      top: 8px;
      left: -11px
  }

  .tab__title:not(.tab__title--active):hover {
      color: #32325d;
      text-decoration: none
  }

  .tab__title--active {
      font-weight: 700;
      color: #6772e5
  }
  .tabs__content {
      margin-top: 6px;
  }
}
</style>