<template lang="pug">
  .rolesList(
    :class='listClasses'
  )
    role(
      v-for='role in roles'
      :key='role.uuid'
      :role='role'
    )
</template>

<script>
import Role from './Role.vue'

export default {
  components: {
    Role
  },

  props: {
    /**
     * List of roles
     */
    roles: {
      type: Array,
      default: () => []
    },

    /**
     * Is this the root list of roles?
     */
    main: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    listClasses() {
      return {
        'rolesList--main': this.main
      }
    }
  }
}
</script>