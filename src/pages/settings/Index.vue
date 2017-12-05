<template lang="pug">
  div
    h3 Settings
    tabs
      manage-roles
      account-settings

</template>

<script>
import AccountSettings from './tabs/AccountSettings.vue'
import ManageRoles from './tabs/ManageRoles.vue'

export default {
  components: {
    AccountSettings,
    ManageRoles
  }
}
</script>