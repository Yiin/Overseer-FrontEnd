<template lang="pug">
  .tab(v-show='isActive')
    h2 Manage Roles

    button.button.button--create(
      @click='createRole'
    ) Create Role

    roles-list(
      :roles='roles'
      main
    )
</template>

<script>
import Tab from '@/components/common/Tabs/Tab.vue'
import RolesList from '@/components/settings/Roles/List.vue'

export default {
  extends: Tab,

  components: {
    RolesList
  },

  props: {
    title: {
      default: 'Manage Roles'
    }
  },

  computed: {
    roles() {
      return this.$user.company.roles
    }
  },

  methods: {
    createRole() {
      //
    }
  }
}
</script>