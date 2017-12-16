<template lang="pug">
  .modal-form
    modal-tabs(
      @save='save'
      @cancel='cancel'
      @fill='fill'
    )
      //-
        Details

      modal-tab(:title="$t('tabs.details')")
        form-container
          form-row

            //-
              First name

            form-field(
              :label="$t('fields.first_name')"
              :errors='validationErrors.first_name'
            )
              form-text-input(
                v-model='first_name'
                :readonly='preview'
              )

            //-
              Last name

            form-field(
              :label="$t('fields.last_name')"
              :errors='validationErrors.last_name'
            )
              form-text-input(
                v-model='last_name'
                :readonly='preview'
              )


          form-row

            //-
              Phone

            form-field(
              :label="$t('fields.phone')"
              :errors='validationErrors.phone'
            )
              form-text-input(
                v-model='phone'
                :readonly='preview'
              )

            //-
              Email

            form-field(
              :label="$t('fields.email')"
              :errors='validationErrors.email'
            )
              form-text-input(
                v-model='email'
                :readonly='preview'
              )

          form-row

            //-
              Job Title

            form-field(
              :label="$t('fields.job_title')"
              :errors='validationErrors.job_title'
            )
              form-text-input(
                v-model='job_title'
                :readonly='preview'
              )

            //-
              New Password

            form-field(
              v-if='account'
              :label="$t('fields.password-optional')"
              hint="Test hint"
            )
              form-text-input(
                v-model='password'
                type='password'
              )
            form-field(v-else)

          //-
            Switch to activate use account for employee

          form-row(v-if='canManageEmployee')
            form-field(
              label="User account"
            )
              v-switch(
                :label='userAccountLabelText'
                v-model='account'
                color='orange'
                hide-details
              )

      //-
        Account information, permissions and reponsibilities

      modal-tab(
        v-if='account && canManageEmployee'
        :title="$t('tabs.account')"
      )
        form-container
          form-row

            //-
              Countries dropdown

            form-field(label='Assign countries')
              form-dropdown-input(
                :items='availableCountries'
                :placeholder='assignedCountriesPlaceholder'
                v-model='assigned_countries'
                item-name='country'
                searchable
                multiple
                with-titles
              )
                template(slot='customOptions')

                  //-
                    Assign all countries

                  v-list-tile(
                    @click.stop='assignAllCountries'
                  )
                    v-list-tile-action
                      v-switch(
                        v-model='assignAllCountriesSwitch'
                        color='orange'
                        hide-details
                      )
                    v-list-tile-content
                      v-list-tile-title Select All

                  //-
                    Do not assign any country

                  v-list-tile(
                    @click.stop='assignNoCountries'
                  )
                    v-list-tile-action
                      v-switch(
                        v-model='assignNoCountriesSwitch'
                        color='orange'
                        hide-details
                      )
                    v-list-tile-content
                      v-list-tile-title Select None

                v-list-tile(
                  slot='option'
                  slot-scope='{ item, selected, parent }'
                  :value='selected'
                  @click='parent.select(item)'
                )
                  v-list-tile-avatar
                    span.flag-icon(:class="['flag-icon-' + item.iso_3166_2.toLowerCase() ]")
                  v-list-tile-content
                    v-list-tile-title {{ item.text }}
                    v-list-tile-sub-title {{ item.fullName }}

            //-
              Clients dropdown

            form-field(label='Assign clients')
              form-dropdown-input(
                :items='availableClients'
                :placeholder='assignedClientsPlaceholder'
                v-model='assigned_clients'
                item-name='client'
                searchable
                multiple
                with-titles
              )
                template(slot='customOptions')

                  //-
                    Assign all clients

                  v-list-tile(
                    @click.stop='assignAllClients'
                  )
                    v-list-tile-action
                      v-switch(
                        v-model='assignAllClientsSwitch'
                        color='orange'
                        hide-details
                      )
                    v-list-tile-content
                      v-list-tile-title Select All

                  //-
                    Do not assign any client

                  v-list-tile(
                    @click.stop='assignNoClients'
                  )
                    v-list-tile-action
                      v-switch(
                        v-model='assignNoClientsSwitch'
                        color='orange'
                        hide-details
                      )
                    v-list-tile-content
                      v-list-tile-title Select None

                v-list-tile(
                  slot='option'
                  slot-scope='{ item, selected, parent }'
                  :value='selected'
                  @click='parent.select(item)'
                  avatar
                )
                  v-list-tile-avatar
                    img(src='../../assets/images/placeholders/profile-placeholder.svg')
                  v-list-tile-content
                    v-list-tile-title {{ item.getTitle() }}
                    v-list-tile-sub-title {{ item.email }}

          form-row

            //-
              Clients dropdown

            form-field(label='Assign roles')
              form-dropdown-input(
                :items='availableRoles'
                v-model='assigned_roles'
                item-name='role'
                searchable
                multiple
                with-titles
              )
                v-list-tile(
                  slot='option'
                  slot-scope='{ item, selected, parent }'
                  :value='selected'
                  @click='parent.select(item)'
                )
                  v-list-tile-content
                    v-list-tile-title {{ item.getTitle() }}

            form-field

</template>

<script>
import FormMixin from '@/mixins/FormMixin'

export default {
  mixins: [
    FormMixin('employee', [
      'first_name',
      'last_name',
      'job_title',
      'email',
      'phone',
      'account',
      'password',
      'assign_all_countries',
      'assigned_countries',
      'assign_all_clients',
      'assigned_clients',
      'assigned_roles'
    ])
  ],

  computed: {
    canManageEmployee() {
      if (!this.form.fields.uuid) {
        return this.$user.can('manage', 'employee', this.$user.company)
      }

      return this.$user.can('manage', this.currentDocument) && !this.currentDocument.isMe()
    },

    userAccountLabelText() {
      if (this.account) {
        if (this.form.fields.uuid) {
          return 'If employee does not have an account, one will be created.'
        } else {
          return 'Account will be created for this employee.'
        }
      } else {
        if (this.form.fields.uuid) {
          return 'If employee had an account, it will be disabled.'
        } else {
          return 'Account won\'t be created for this employee.'
        }
      }
    },

    assignedCountriesPlaceholder() {
      if (this.assigned_countries.length) {
        return undefined
      }
      if (this.assign_all_countries) {
        return 'All countries assigned'
      } else {
        return 'No countries assigned'
      }
    },

    availableCountries() {
      return this.dropdownOptions.countries
    },

    assignedClientsPlaceholder() {
      if (this.assigned_clients.length) {
        return undefined
      }
      if (this.assign_all_clients) {
        return 'All clients assigned'
      } else {
        return 'No clients assigned'
      }
    },

    availableClients() {
      return this.dropdownOptions.clients
    },

    availableRoles() {
      return this.$user.company.roles.map((role) => {
        return Object.assign(Object.create(role), {
          text: role.getTitle(),
          value: role.uuid
        })
      })
    },

    assignAllCountriesSwitch: {
      get() { return this.assign_all_countries && !this.assigned_countries.length },
      set() {}
    },

    assignNoCountriesSwitch: {
      get() { return !this.assigned_countries.length && !this.assign_all_countries },
      set() {}
    },

    assignAllClientsSwitch: {
      get() { return this.assign_all_clients && !this.assigned_clients.length },
      set() {}
    },

    assignNoClientsSwitch: {
      get() { return !this.assigned_clients.length && !this.assign_all_clients },
      set() {}
    }
  },

  watch: {
    assigned_clients(assignedClients) {
      assignedClients.forEach((clientUuid) => {
        const client = this.clients.find((client) => client.uuid === clientUuid)

        if (!client || !client.address || !client.address.country) {
          return
        }

        if (this.assigned_countries.indexOf(client.address.country.id) < 0) {
          this.assigned_countries.push(client.address.country.id)
        }
      })
    }
  },

  mounted() {
    if (this.assigned_countries.length === 0 && !this.assign_all_countries) {
      this.assignNoCountries()
    } else if (this.assign_all_countries) {
      this.assignAllCountries()
    }
    if (this.assigned_clients.length === 0 && !this.assign_all_clients) {
      this.assignNoClients()
    } else if (this.assign_all_clients) {
      this.assignAllClients()
    }
  },

  methods: {
    assignAllCountries() {
      this.assigned_countries = []
      this.assign_all_countries = true
    },

    assignNoCountries() {
      this.assigned_countries = []
      this.assign_all_countries = false
    },

    assignAllClients() {
      this.assigned_clients = []
      this.assign_all_clients = true
    },

    assignNoClients() {
      this.assigned_clients = []
      this.assign_all_clients = false
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-form {
  .modal-tabs {
    width: 790px;
    height: 540px;
  }
}
</style>

<style lang="scss">
.permissions-row {
    display: flex;
}

.permission {
    font-size: 13px;
    padding: 8px;
    margin-bottom: 5px;
    margin-right: 5px;
    border-radius: 4px;
    color: #ffffff;
    cursor: pointer;
}

.permission--unset {
    opacity: 0.2;
    transition: opacity 0.3s;

    background-color: $color-wild-sand;
    color: #373737;

    &:hover {
      opacity: 1;
    }
}

.permission--view {
    background-color: #42A5F5;
}

.permission--create {
    background-color: #ffa727;
}

.permission--edit {
    background-color: #5ac26d;
}

.permission--delete {
    background-color: #df8283;
}

.permission--manage {
    background-color: #5c6ac0;
}
</style>