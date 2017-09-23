<template>
  <div>
    <breadcrumb :path="[ $t('common.projects') ]"></breadcrumb>

    <div class="table__heading">
      <a @click="create" class="button button--create">
        <span class="icon-new-project-btn-icon"></span>
        {{ $t('actions.new_project') }}
      </a>

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

  filters: {
    projectProgress(tasks) {
      const total = tasks.length
      const completed = tasks.filter((task) => task.is_completed).length

      return `${completed} / ${total}`
    },

    json(obj) {
      return JSON.stringify(obj, null, 4)
    }
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
          title: 'common.client_table'
        }),
        CreateDocument.extend({
          documentType: 'client',
          title: 'actions.new_client',
          icon: 'icon-new-client-btn-icon'
        }),
        SELECTED_DOCUMENT.extend({ documentType: 'client' }),
        Preview,
        EditDocument.extend({ title: 'actions.edit_client' }),
        __SEPARATOR__.isVisible(whenSpecificRowIsSelected),
        Archive,
        Delete
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