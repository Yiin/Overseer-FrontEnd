<template>
  <div>
    <template v-if="!state.items || !state.items.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--projects"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Here you can start and manage projects,<br>
          create task-lists, and convert them to invoices.
        </div>
        <button @click="create" class="button button--create">
          <span class="icon-new-project-btn-icon"></span>
          {{ $t('actions.new_project') }}
        </button>
      </div>
    </template>
    <template v-else>
      <breadcrumb :path="[ $t('common.projects') ]"></breadcrumb>

      <div class="table__heading">
        <button @click="create" class="button button--create">
          <span class="icon-new-project-btn-icon"></span>
          {{ $t('actions.new_project') }}
        </button>

        <div class="table__dropdowns">
          <filter-by :watch="{ clients }" :name="name" :options="filterBy"></filter-by>
          <search-by :name="name" :options="searchBy"></search-by>
        </div>
      </div>

      <documents-table ref="table" :data="list" :context-menu-actions="contextMenuActions">
        <template slot="head">
          <column width="20%">Project Name</column>
          <column width="20%">Progress</column>
          <column width="60%">Description</column>
        </template>
        <template slot="columns" scope="props">
          <column width="20%">
            <a href="#" @click="open(props.row)">
              {{ props.row.name }}
            </a>
          </column>
          <column width="20%">
            {{ props.row.tasks | projectProgress }}
          </column>
          <column width="60%">
            {{ props.row.description }}
          </column>
        </template>
        <template slot="details" scope="props">
          <project-details :project="props.row"></project-details>
        </template>
      </documents-table>
    </template>
  </div>
</template>

<script>
import TableMixin from '@/mixins/TableMixin'
import {
  IsActiveFilter,
  IsArchivedFilter,
  IsDeletedFilter,
  ClientsFilter,

  // Search By
  SearchByText
} from '@/modules/table/filters'

import {
  whenMoreThanOneRowIsSelected,
  whenSpecificRowIsSelected,
  __SEPARATOR__,
  SELECTED_ROWS,
  SELECTED_DOCUMENT,
  TableName,
  CreateDocument,
  Archive,
  Delete,
  Restore,
  Preview,
  EditDocument
} from '@/modules/table/cm-actions'

import ProjectDetails from './ProjectDetails.vue'

export default {
  mixins: [
    TableMixin
  ],

  components: {
    ProjectDetails
  },

  computed: {
    name() {
      return 'projects'
    },

    filterBy() {
      return [
        IsActiveFilter,
        IsArchivedFilter,
        IsDeletedFilter,
        { type: 'separator' },
        ClientsFilter.make(this.clients)
      ]
    },

    searchBy() {
      return [
        SearchByText.extend({ key: 'name', name: 'name', placeholder: this.$t('search_by.project_name') }),
        SearchByText.extend({ key: 'description', name: 'description', placeholder: this.$t('search_by.description') }),
        { type: 'separator' },
        SearchByText.extend({ key: 'client.name', name: 'client_name', placeholder: this.$t('search_by.client_name') })
      ]
    },

    contextMenuActions() {
      return [
        SELECTED_ROWS,
        Archive.isVisible(whenMoreThanOneRowIsSelected),
        Delete.isVisible(whenMoreThanOneRowIsSelected),
        __SEPARATOR__.isVisible(whenMoreThanOneRowIsSelected),
        TableName.extend({
          title: 'common.project_table'
        }),
        CreateDocument.extend({
          documentType: 'project',
          title: 'actions.new_project',
          icon: 'icon-new-project-btn-icon'
        }),
        SELECTED_DOCUMENT.extend({ documentType: 'project' }),
        Preview,
        EditDocument.extend({ title: 'actions.edit_project' }),
        __SEPARATOR__.isVisible(whenSpecificRowIsSelected),
        Archive,
        Delete,
        Restore
      ]
    },

    clients() {
      const clients = this.$store.getters[`table/${this.name}/filteredItems`]
        .filter((project) => project.client)
        .map((project) => project.client)
      return this.filterAndOrder(clients, {
        filterBy: 'uuid',
        orderBy: 'name'
      })
    }
  },

  methods: {
    open(row) {
      this.$refs.table.$emit('toggle-details', row)
    },

    create() {
      this.$store.dispatch('form/project/OPEN_CREATE_FORM')
    },

    edit(data) {
      this.$store.dispatch('form/project/OPEN_EDIT_FORM', data)
    }
  }
}
</script>

<style lang="scss">
.table-row-details {
  padding: 20px;
}

.row {
  margin: 40px 0 20px;
}
</style>