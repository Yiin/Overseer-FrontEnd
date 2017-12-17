<template lang="pug">
  .tab__title(
    @click='selectTab()'
    :class="classes"
    :title='tab.title'
  )
    //-
      Text tab

    template(v-if='isSimple') {{ tab.title }}

    //-
      Dropdown with tabs

    template(v-else-if='isDropdown')
      form-dropdown-input.dropdown--blank(
        :items='dropdownItems'
        v-model='dropdownValue'
        :readonly='!isDropdownActive'
      )
</template>

<script>
export default {
  props: {
    tab: {
      required: true
    },

    activeTabKey: {
      type: String
    }
  },

  data() {
    return {
      dropdownValue: null
    }
  },

  computed: {
    classes() {
      return {
        'tab__title--active': this.isActive,
        'tab__title--dropdown': this.isDropdown
      }
    },

    isActive() {
      if (this.activeTabKey === this.tab.key) {
        console.log('isActive', this.activeTabKey, '===', this.tab.key)
        return true
      }

      if (this.dropdownItems.find((item) => item.value === this.activeTabKey)) {
        console.log('dropdownItem is active', this.activeTabKey)
        return true
      }

      return false
    },

    isSimple() {
      return !this.isDropdown
    },

    isDropdown() {
      return this.tab.isDropdown
    },

    isDropdownActive() {
      return this.tab.items.find((item) => item.key === this.activeTabKey)
    },

    dropdownItems() {
      if (!this.isDropdown) {
        return []
      }
      return this.tab.items.map((item) => ({
        text: item.title,
        value: item.key
      }))
    }
  },

  watch: {
    activeTabKey() {
      this.handleActiveTabKeyChange()
    },

    dropdownValue(key) {
      this.selectTab(key)
    }
  },

  mounted() {
    this.handleActiveTabKeyChange()
  },

  methods: {
    handleActiveTabKeyChange() {
      if (this.isDropdown) {
        if (this.isDropdownActive) {
          this.dropdownValue = this.activeTabKey
        }
      }
    },

    selectTab(key = null) {
      if (this.isDropdown) {
        if (!key || key === this.tab.key) {
          key = this.dropdownValue
        } else {
          console.log('key', this.tab.key, key, this.dropdownItems)
        }
      }
      console.log('selectTab trigger', key, this.tab.key, key || this.tab.key)
      this.$emit('select-tab', key || this.tab.key)
    }
  }
}
</script>

<style lang="scss">
.tab__title--dropdown {
  padding-right: 0 !important;
  padding-left: 0 !important;
}
</style>