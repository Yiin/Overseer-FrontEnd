<template lang="pug">
  transition(name='fade')
    .tab__holder(
      :class='tabClasses'
    )
      .tab
        slot
</template>

<script>
export default {
  inject: ['addTabDropdown', 'removeTabItem'],

  provide() {
    return {
      addTabItem: ({ title, key, setActive }) => {
        this.registerTabItem(title, key, setActive)
      },
      removeTabItem: (title) => {
        this.unregisterTabItem(title)
      }
    }
  },

  data() {
    return {
      tabKey: Math.random().toString(36).substr(2, 5),
      tabs: []
    }
  },

  computed: {
    tabClasses() {
      return {
        'tabs--labeled': this.labels
      }
    },

    items() {
      return this.tabs.map((tab) => ({
        title: tab.title,
        key: tab.key,
        setActive: tab.setActive
      }))
    }
  },

  methods: {
    registerTabItem(title, key, setActive) {
      this.tabs.push({ title, key, setActive })
    },

    unregisterTabItem(key) {
      this.tabs = this.tabs.filter((tab) => tab.key !== key)
    },

    selectOption(tabKey = null) {
      let retKey = null

      if (!tabKey) {
        retKey = tabKey = this.tabs[0].key
      }

      this.tabs.forEach((tab) => {
        if (tab.key === tabKey) {
          tab.setActive(true)
          retKey = tab.key
        } else {
          tab.setActive(false)
        }
      })

      return retKey
    }
  },

  mounted() {
    if (this.tabs.length < 1) {
      throw new Error(`Tabs should contain at least 1 tab.`)
    }
    // this.selectTab(this.tabs[0].key)

    console.log('TabDropdown.addTabDropdown', this.items.map((item) => item.key))
    this.addTabDropdown({
      key: this.tabKey,
      selectOption: this.selectOption.bind(this),
      items: this.items
    })
  },

  beforeDestroy() {
    this.removeTabItem(this.tabKey)
  }
}
</script>