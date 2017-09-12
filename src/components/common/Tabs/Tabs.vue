<template>
  <div class="tabs">
    <div class="tabs__list">
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

  data() {
    return {
      tabs: []
    }
  },

  methods: {
    selectTab(tab) {
      this.activeTab = tab

      this.tabs.forEach((_tab) => {
        _tab.isActive = (_tab === tab)
      })
    }
  },

  mounted() {
    this.tabs = this.$children
    this.selectTab(this.tabs[0])
  }
}
</script>

<style lang="scss">
.tabs__list {
    display: flex;
    margin-bottom: 20px;
    border-bottom: 4px solid #eee;
}

.tab__title {
    line-height: 52px;
    height: 52px;
    font-size: 16px;
    padding: 0 20px;
    position: relative;
    cursor: pointer;
}

.tab__title::before {
    font-weight: 600;
    display: block;
    visibility: hidden;
    overflow: hidden;
    height: 0;
    content: attr(title);
    color: transparent;
}

.tab__title--active::after,
.tab__title:hover::after {
    content: "";
    position: absolute;
    width: 100%;
    display: block;
    height: 4px;
    margin-left: -20px;
}

.tab__title--active::after {
    background: $color-main;
}

.tab__title:hover::after {
    // background: $color-dusty-gray;
}
</style>