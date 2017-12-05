<template lang="pug">
  .modal-form
    modal-tabs(
      @save='save'
      @cancel='cancel'
      @fill='fill'
    )
      modal-tab(:title="$t('tabs.details')")
        form-container
          form-row
            //- First name
            form-field(
              :label="$t('fields.first_name')"
              :errors='validationErrors.first_name'
            )
              form-text-input(
                v-model='first_name'
                :readonly='preview'
              )

            //- Last name
            form-field(
              :label="$t('fields.last_name')"
              :errors='validationErrors.last_name'
            )
              form-text-input(
                v-model='last_name'
                :readonly='preview'
              )


          form-row
            //- Phone
            form-field(
              :label="$t('fields.phone')"
              :errors='validationErrors.phone'
            )
              form-text-input(
                v-model='phone'
                :readonly='preview'
              )

            //- Email
            form-field(
              :label="$t('fields.email')"
              :errors='validationErrors.email'
            )
              form-text-input(
                v-model='email'
                :readonly='preview'
              )

          form-row
            //- Job Title
            form-field(
              :label="$t('fields.job_title')"
              :errors='validationErrors.job_title'
            )
              form-text-input(
                v-model='job_title'
                :readonly='preview'
              )
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
                v-model='selectedCountries'
                item-name='country'
                searchable
                multiple
                with-select-all-option
                with-titles
              )

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
                v-model='assignedClients'
                item-name='client'
                searchable
                multiple
                with-select-all-option
                with-titles
              )
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
      'selectedCountries',
      'assignedClients',
      'selectedRoles'
    ])
  ],

  data() {
    const permissions = {}

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
      'project'
    ]

    permissionTypes.forEach((type) => {
      permissions[type] = {
        view: false,
        create: false,
        edit: false,
        delete: false,
        manage: false
      }
    })

    return {
      permissionTypes,
      permissions
    }
  },

  computed: {
    actions() {
      return [
        'view',
        'create',
        'edit',
        'delete',
        'manage'
      ]
    },

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

    availableCountries() {
      const availableCountries = this.clients
        .filter((client) => client.address.country)
        .map((client) => client.address.country.id)

      return this.dropdownOptions.countries.filter((country) => {
        return availableCountries.indexOf(country.id) > -1
      })
    },

    availableClients() {
      return this.selectedCountries.length
        ? this.dropdownOptions.clients.filter((client) => {
          return client.address.country && this.selectedCountries.indexOf(client.address.country.id) > -1
        })
        : this.dropdownOptions.clients
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