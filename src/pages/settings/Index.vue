<template lang="pug">
  div
    tabs
      manage-roles(v-if='canViewRoles')
      account-settings
</template>

<script>
import AccountSettings from './tabs/AccountSettings.vue'
import ManageRoles from './tabs/ManageRoles.vue'
import AuthorizationHelpersMixin from '@/mixins/authorization/helpers'

export default {
  mixins: [
    AuthorizationHelpersMixin
  ],

  components: {
    AccountSettings,
    ManageRoles
  }
}
</script>