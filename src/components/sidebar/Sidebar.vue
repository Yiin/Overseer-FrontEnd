<template lang="pug">
  .sidebar(v-clickaway='clickaway')
    .sidebar__content
      sidebar-company(
        class='sidebar__companySelect'
        :company='$user.company'
        @click.native='toggleCompanyList'
      )
      sidebar-company-switcher(
        v-if='isCompanyListOpen'
        @select='isCompanyListOpen = false'
      )
      sidebar-navigation(v-else)
</template>

<script>
import SidebarCompany from './SidebarCompany.vue'
import SidebarNavigation from './SidebarNavigation.vue'
import SidebarCompanySwitcher from './SidebarCompanySwitcher.vue'

export default {
  components: {
    SidebarCompany,
    SidebarNavigation,
    SidebarCompanySwitcher
  },

  data() {
    return {
      isCompanyListOpen: false
    }
  },

  methods: {
    toggleCompanyList() {
      this.isCompanyListOpen = !this.isCompanyListOpen
    },

    clickaway() {
      this.isCompanyListOpen = false
    }
  }
}
</script>

<style lang="scss" src="./style.scss"></style>