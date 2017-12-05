<template lang="pug">
  div
    breadcrumb(:path="[ $t('common.personnel') ]")

    .table__heading
      button.button.button--create(@click="create")
        span.icon-new-credit-btn-icon
        | {{ $t('actions.new_employee') }}

      .table__dropdowns
        filter-by(
          ref='filterByComponent'
          :name='name'
          :options='filterBy'
        )
        search-by(
          :name='name'
          :options='searchBy'
        )

    documents-table(
      @apply-filters-to-show-hidden-results='applyFiltersToShowHiddenResults'
      :data='list'
      :context-menu-builder='contextMenuBuilder'
    )
      template(slot='head')
        column(width='18%') {{ $t('fields.first_name') }}
        column(width='18%') {{ $t('fields.last_name') }}
        column(width='18%') {{ $t('fields.phone') }}
        column(width='18%') {{ $t('fields.email') }}
        column(width='14%') {{ $t('fields.job_title') }}
        column(width='14%') {{ $t('fields.role') }}

      template(slot='columns' slot-scope='{ row }')
        column(width='18%')
          profile-menu(:employee='row')
          a(href='' @click.prevent='viewEmployee(row)') {{ row.firstName }}
        column(width='18%')
          a(href='' @click.prevent='viewEmployee(row)') {{ row.lastName }}
        column(width='18%') {{ row.phone }}
        column(width='18%') {{ row.email }}
        column(width='14%') {{ row.jobTitle }}
        column(width='14%') {{ row.getRoleName() }}

    table-footer(:table-name='name')

    v-dialog(
      v-model='showingProfile'
      fullscreen
      transition='dialog-bottom-transition'
      :overlay='false'
    )
      .dialogContentWrapper
        v-toolbar.toolbar--centerish(dark color='primary')
          v-btn(icon
            @click='editEmployee(employee)'
          )
            v-icon edit

          v-toolbar-title {{ employeesTitle }}'s Profile
          v-spacer

          v-btn(icon
            @click.native='showingProfile = false'
          )
            v-icon close

        .dialogContent

          //-
            Close icon

            .modal-icon.modal-icon__close(
              @click='showingProfile = false'
            )
              i.modal-icon-close

          //-
            Employee profile page

          profile-page(
            :employee='employee'
            :is-visible='showingProfile'
          )
</template>

<script>
import S from 'string'
import TableMixin from '@/mixins/TableMixin'
import ProfileMenu from './ProfileMenu.vue'
import ProfilePage from '../profile/Index.vue'

import {
  IsActiveFilter,
  IsArchivedFilter,
  IsDeletedFilter,

  // Search By
  SearchByText,
  SearchByDate
} from '@/modules/table/filters'

import TableCmItems from '@/modules/table/contextmenu/items'

export default {
  mixins: [
    TableMixin
  ],

  components: {
    ProfileMenu,
    ProfilePage
  },

  data() {
    return {
      showingProfile: false,
      employee: null
    }
  },

  computed: {
    name() {
      return 'employees'
    },

    viewLink() {
      return (employee) => {
        return {
          name: 'profile',
          params: {
            who: employee.uuid,
            slug: S(employee.getTitle()).slugify().s
          }
        }
      }
    },

    contextMenuBuilder() {
      return this.$contextMenu.init({
        tableStateName: this.name
      })
        .addItem(TableCmItems.SELECTED_ROWS)
        .addItem(TableCmItems.ARCHIVE_MANY)
        .addItem(TableCmItems.UNARCHIVE_MANY)
        .addItem(TableCmItems.DELETE_MANY)
        .addItem(TableCmItems.RECOVER_MANY)
        .addSeparator()
        .addItem(TableCmItems.TABLE_NAME)
        .addItem(TableCmItems.CREATE_DOCUMENT)
        .addItem(TableCmItems.SELECTED_DOCUMENT)
        .addItem(TableCmItems.PREVIEW)
        .addItem(TableCmItems.EDIT_DOCUMENT)
        .addItem(TableCmItems.CLONE_DOCUMENT.extend({
          title: this.$t('actions.clone_employee')
        }))
        .addItem(TableCmItems.HISTORY_LIST)
        .addSeparator()
        .addItem(TableCmItems.ARCHIVE)
        .addItem(TableCmItems.UNARCHIVE)
        .addItem(TableCmItems.DELETE)
        .addItem(TableCmItems.RECOVER)
    },

    searchBy() {
      return [
        SearchByText.extend({
          key: (document) => `${document.firstName} ${document.lastName}`,
          name: 'employee_name',
          placeholder: this.$t('search_by.employee_name')
        }),
        SearchByText.extend({ key: 'phone', name: 'contact_number', placeholder: this.$t('search_by.contact_number') }),
        SearchByText.extend({ key: 'email', name: 'email', placeholder: this.$t('search_by.client_email') }),
        { type: 'separator' },
        SearchByDate.extend({ key: 'createdAt', name: 'date_created', placeholder: this.$t('search_by.date_created') })
      ]
    },

    filterBy() {
      return [
        IsActiveFilter,
        IsArchivedFilter,
        IsDeletedFilter
      ]
    },

    employeesTitle() {
      if (this.employee) {
        return this.employee.getTitle()
      }
      return null
    }
  },

  watch: {
    showingProfile(showing) {
      if (showing) {
        this.$store.commit('OVERLAY', 'employeeProfile')
      } else {
        setTimeout(() => this.$store.commit('UNDERLAY', 'employeeProfile'), 300)
      }
    }
  },

  methods: {
    viewEmployee(employee) {
      this.employee = employee
      this.showingProfile = true
    },

    editEmployee(employee) {
      this.editDocument(employee, 'employee')
    }
  }
}
</script>

<style lang="scss">
.dialogContentWrapper {
  min-height: 100%;
  background: $color-wild-sand;
}

.dialogContent {
  position: relative;
  max-width: 1500px;
  padding: 50px 0 30px;
  margin: 0 auto;

  .modal-icon__close {
    position: absolute;
    top: 23px;
    right: 0;
  }
}

.toolbar--centerish {
  box-shadow: $box-shadow;

  .toolbar__content {
    padding: 0 192px 0 194px;
  }
}
</style>