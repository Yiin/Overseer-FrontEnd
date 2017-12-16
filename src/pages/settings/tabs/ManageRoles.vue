<template lang="pug">
  .tab(v-show='isActive')

    //-
      Role selection area

    .roleSelection

      button.button.button--create(
        @click='composeNewRole'
      ) Create Role

      //-
        Role selection dropdown

      form-dropdown-input(
        placeholder='Select role'
        :items='roles'
        v-model='selectedRoleUuid'
      )

      v-dialog(
        v-if='selectedRole'
        v-model="roleDeletionWarning"
        persistent
        max-width="290"
      )
        .deleteRoleLink(
          slot='activator'
        ) Delete selected role

        v-card
          v-card-title.headline Do you really want to delete this role?
          v-card-text
            | After this role is deleted, it will be
            | unassigned from users that currently
            | has this role.

          v-card-actions
            v-spacer
            v-btn(flat @click.native="roleDeletionWarning = false") Cancel
            v-btn(color="red darken-1" flat @click.native="deleteSelectedRole") Delete

    role-block(
      v-if='composingNewRole'
      @created='selectRole'
      new
    )
    role-block(
      v-else-if='selectedRole'
      :role='selectedRole'
    )
</template>

<script>
import Tab from '@/components/common/Tabs/Tab.vue'
import RoleBlock from '@/components/settings/Roles/RoleBlock.vue'
import Role from '@models/role'

export default {
  extends: Tab,

  components: {
    RoleBlock
  },

  props: {
    title: {
      default: 'Manage Roles'
    }
  },

  data() {
    return {
      /**
       * We're composing new role,
       * not editing existing one
       *
       * @type {Boolean}
       */
      composingNewRole: false,

      /**
       * UUID of selected role
       *
       * @type {String}
       */
      selectedRoleUuid: null,

      /**
       * Object of selected role
       *
       * @type {Role}
       */
      selectedRole: null,

      /**
       * Show dialog that warns about what happens
       * if role is deleted
       *
       * @type {Boolean}
       */
      roleDeletionWarning: false
    }
  },

  computed: {
    roles() {
      return this.$user.company.roles.map((role) => {
        return {
          text: role.getTitle(),
          value: role.uuid
        }
      })
    },

    creatingRole() {
      return this.selectedRole && !this.selectedRoleUuid
    }
  },

  watch: {
    /**
     * Change selected role
     */
    selectedRoleUuid(uuid) {
      if (
        // no role is selected
        !this.selectedRole ||

        // or selected role is not the same as the one we just selected
        (this.selectedRole && this.selectedRole.uuid !== uuid)
      ) {
        this.selectRole(uuid)
      }
    }
  },

  mounted() {
    if (this.roles.length) {
      this.selectRole(this.roles[0].value)
    }
  },

  methods: {
    composeNewRole() {
      this.composingNewRole = true
    },

    selectRole(role) {
      if (!role) {
        this.selectedRole = null
        return
      }

      this.composingNewRole = false

      if (!(role instanceof Role)) {
        role = this.$user.company.roles.find((companyRole) => companyRole.uuid === role)
      }

      if (this.selectedRoleUuid !== role.uuid) {
        this.selectedRoleUuid = role.uuid
      }
      this.$set(this, 'selectedRole', role)
    },

    deleteSelectedRole() {
      if (this.selectedRoleUuid) {
        this.$api.delete(`authorization/roles/${this.selectedRoleUuid}`)

        this.selectedRoleUuid = null
      }
      this.roleDeletionWarning = false
    }
  }
}
</script>

<style lang="scss">
.roleSelection {
    display: flex;
    align-items: center;

    .dropdown {
      box-shadow: $box-shadow;
      width: 300px;
    }
}

.roleSelection .button--create {
  margin-right: 45px;
}

.roleSelection .deleteRoleLink {
    font-weight: 600;
    color: #373737 !important;
    margin-left: 20px;
    padding: 15px 0;
    cursor: pointer;

    &:hover {
      color: $color-red !important;
    }
}

.block--permissions {
  padding-top: 20px;
}

.input--h5 {
  font-size: 24px;
  font-weight: 400;
  line-height: 32px;
  letter-spacing: normal;
  border: 1px solid transparent;

  &:hover, &:focus, &:active, &:placeholder-shown {
    border-color: #e1e1e1;
  }
  &:focus, &:active {
    outline: none;
  }
}
</style>