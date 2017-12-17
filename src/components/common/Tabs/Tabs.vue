<template lang="pug">
  .tabs.tabs--with-overflow(
    :class='tabsClasses'
  )
    //-
      List of tabs.
      Some may be dropdown that contains more tabs.

    .tabs__list
      tab-title(
        v-for='tab in tabs'
        :key='tab.key'
        :tab='tab'
        :active-tab-key='activeTabKey'
        @select-tab='selectTab'
      )

    //-
      Content of tabs

    .tabs__content
      slot

</template>

<script>
export default {
  name: 'tabs',

  provide() {
    return {
      addTabDropdown: ({ key, items, selectOption }) => {
        this.registerTabDropdown(key, items, selectOption)
      },
      addTabItem: ({ title, key, setActive }) => {
        this.registerTabItem(title, key, setActive)
      },
      removeTabItem: (title) => {
        this.unregisterTabItem(title)
      }
    }
  },

  props: {
    labels: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      tabs: [],
      activeTabKey: null
    }
  },

  computed: {
    tabsClasses() {
      return {
        'tabs--labeled': this.labels
      }
    }
  },

  watch: {
    activeTabKey(key) {
      console.log('tabs.activeTabKey changed', key, this.tabs)
    }
  },

  mounted() {
    if (this.tabs.length < 1) {
      throw new Error(`Tabs should contain at least 1 tab.`)
    }
    this.selectTab(this.tabs[0].key)
  },

  methods: {
    reset() {
      this.selectTab(this.tabs[0].key)
    },

    /**
     * Register tab that is dropdown.
     *
     * That dropdown contains more tabs.
     */
    registerTabDropdown(key, items, selectOption) {
      this.tabs.push({ isDropdown: true, key, items, selectOption })
    },

    /**
     * Register simple tab
     */
    registerTabItem(title, key, setActive) {
      this.tabs.push({ title, key, setActive })
    },

    /**
     * Unregister tab.
     *
     * It will be then removed from tabs list.
     */
    unregisterTabItem(key) {
      this.tabs = this.tabs.filter((tab) => tab.key !== key)
    },

    /**
     * Select tab, so we could see its content
     */
    selectTab(tabKey) {
      if (!tabKey) {
        return
      }

      this.activeTabKey = tabKey

      this.tabs.forEach((tab) => {
        if (tab.isDropdown) {
          if (tab.key === tabKey) {
            const optionKey = tab.selectOption()

            if (optionKey) {
              this.activeTabKey = optionKey
            }
          } else {
            tab.selectOption(tabKey)
          }
        } else {
          tab.setActive(tab.key === tabKey)
        }
      })
    }
  }
}
</script>

<style lang="scss">

.tabs--with-overflow {
  overflow: visible !important;
}
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
    > .tab__title--dropdown.tab__title--active::after,
    > .tab__title--dropdown.tab__title:hover::after {
      margin-left: 0;
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