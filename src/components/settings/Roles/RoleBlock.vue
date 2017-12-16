<template lang="pug">
  .block.block--default.block--permissions

    //-
      Name of the role & Create new role button

    .block__header
      input.input--h5(
        v-model='roleName'
        placeholder='Enter name of the role'
        data-lpignore='true'
      )

      button.button.button--create.button--save-role(
        @click='saveRole'
      ) {{ saveBtnText }}

      v-progress-circular(
        v-if="state === 'saving'"
        indeterminate
        color='primary'
      )

    //-
      Permissions table

    .table.table--simple
      .table__head
        .column(
          v-for='(header, index) in headers'
          :style='header.style'
          @click='toggleColumn(index)'
          :class="{ 'column--center': index > 0 }"
        )
          span {{ header.text }}

      .table__body
        .table__row(v-for='item in permissionTypes')
          .column(
            style='text-transform: capitalize; width: 25%'
            @click='toggleRow(item)'
          )
            span {{ pluralize(item) }}

          .column.column--center(
            v-for='(value, action) in permissions[item]'
            style='width: 15%'
            @click.self='permissions[item][action] ^= 1'
          )
            span
              v-switch(
                v-model='permissions[item][action]'
                hide-details
                :color='actionColors[action]'
              )
</template>

<script>
import pluralize from 'pluralize'
import Role from '@models/role'

export default {
  props: {
    new: {
      type: Boolean,
      default: false
    },

    role: {
      type: Role,
      default: () => Role.create({ })
    }
  },

  data() {
    const actions = [
      'view',
      'create',
      'edit',
      'delete',
      'manage'
    ]

    const permissionTypes = [
      'product',
      'client',
      'invoice',
      'payment',
      'credit',
      'quote',
      'expense',
      'vendor',
      'employee',
      'project',
      'role',
      'company'
    ]

    const permissions = {}

    permissionTypes.forEach((type) => {
      permissions[type] = {}

      actions.forEach((action) => {
        permissions[type][action] = false
      })
    })

    return {
      actions,
      permissionTypes,
      permissions,

      state: 'idle',

      headers: [
        {
          text: 'Entity',
          align: 'left',
          sortable: false,
          style: {
            width: '25%'
          }
        },
        {
          text: 'View',
          align: 'center',
          sortable: false,
          style: {
            width: '15%'
          }
        },
        {
          text: 'Create',
          align: 'center',
          sortable: false,
          style: {
            width: '15%'
          }
        },
        {
          text: 'Edit',
          align: 'center',
          sortable: false,
          style: {
            width: '15%'
          }
        },
        {
          text: 'Delete',
          align: 'center',
          sortable: false,
          style: {
            width: '15%'
          }
        },
        {
          text: 'Assign',
          align: 'center',
          sortable: false,
          style: {
            width: '15%'
          }
        }
      ]
    }
  },

  computed: {
    roleName: {
      get() {
        return this.role.name
      },
      set(value) {
        this.role.name = value
      }
    },

    actionColors() {
      const colors = [
        'blue',
        'green',
        'orange',
        'red',
        'indigo'
      ]

      const map = {}

      this.actions.forEach((action) => {
        map[action] = colors.shift()
      })

      return map
    },

    saveBtnText() {
      if (this.new) {
        return 'Save new role'
      } else {
        return 'Save role'
      }
    }
  },

  watch: {
    /**
     * Sync role permissions
     */
    permissions: {
      handler() {
        this.syncRole()
      },
      deep: true
    },

    role: {
      handler() {
        this.updatePermissions()
      },
      deep: true
    }
  },

  mounted() {
    this.updatePermissions()
  },

  methods: {
    /**
     * Create a new role
     */
    saveRole() {
      this.state = 'saving'

      const role = this.role

      const data = {
        role: role.serialize()
      }

      let promise

      if (this.new) {
        promise = this.$api.post('authorization/roles', data)
      } else {
        promise = this.$api.put(`authorization/roles/${role.uuid}`, data)
      }

      promise.then((roleData) => {
        role.update(roleData)

        this.$emit('created', role)
      }).finally(() => {
        this.state = 'idle'
      })
    },

    toggleColumn(actionIndexButNotReally) {
      const actionIndex = actionIndexButNotReally - 1
      const action = this.actions[actionIndex]

      let toggleOn = false

      for (let permission in this.permissions) {
        if (!this.permissions[permission][action]) {
          toggleOn = true
          break
        }
      }

      for (let permission in this.permissions) {
        this.permissions[permission][action] = toggleOn
      }
    },

    toggleRow(permission) {
      let toggleOn = false

      for (let action in this.permissions[permission]) {
        if (!this.permissions[permission][action]) {
          toggleOn = true
          break
        }
      }

      for (let action in this.permissions[permission]) {
        this.permissions[permission][action] = toggleOn
      }
    },

    updatePermissions() {
      this.permissionTypes.forEach((type) => {
        this.actions.forEach((action) => {
          const state = this.role && this.role.permissions.find((permission) => {
            return permission.scope === 'company' &&
              permission.scopeId === this.$user.company.uuid &&
              permission.permissibleType === type &&
              permission.action === action
          })
          this.permissions[type][action] = Boolean(state)
        })
      })
    },

    syncRole() {
      const role = this.role

      /**
       * Conver permisisons map to list
       */
      for (let type in this.permissions) {
        for (let action in this.permissions[type]) {
          role.setPermission(action, type, 'company', this.$user.company.uuid, this.permissions[type][action])
        }
      }
    },

    pluralize(...args) {
      return pluralize(...args)
    }
  }
}
</script>

<style lang="scss">
.button--save-role {
  line-height: 34px;
  height: 34px;
  font-size: 16px;
  font-weight: 600;
  min-width: auto;
  padding: 0 20px;
  margin: 0 30px;
}
</style>