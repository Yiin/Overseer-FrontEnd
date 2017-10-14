<template>
  <div v-show="isActive" class="tab tab--dashboard">
    <template v-if="!projects || !projects.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--projects"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Create a new project by pressing the button below.
        </div>
        <button @click="create" class="button button--create">
          <span class="icon-new-quote-btn-icon"></span>
          {{ $t('actions.new_project') }}
        </button>
      </div>
    </template>
    <documents-table v-else simple
      ref="table"
      :documents="projects"
      :data="tableData"
      :context-menu-actions="contextMenuActions"
    >
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
import Tab from '@/components/common/Tabs/Tab.vue'
import TableMixin from '@/mixins/TableMixin'
import ProjectDetails from '@/components/crm/project/ProjectDetails.vue'

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

export default {
  extends: Tab,

  mixins: [TableMixin],

  components: {
    ProjectDetails
  },

  props: {
    title: {
      default: 'Projects'
    }
  },

  computed: {
    name() {
      return 'invoices'
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
        SELECTED_DOCUMENT.extend({ documentType: 'client' }),
        Preview,
        EditDocument.extend({ title: 'actions.edit_client' }),
        __SEPARATOR__.isVisible(whenSpecificRowIsSelected),
        Archive,
        Delete,
        Restore
      ]
    },

    projects() {
      return this.$store.state.table.projects.items
    },

    tableData() {
      return {
        name: this.name,
        pageList: this.projects,
        selection: this.state.selection
      }
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

<style lang="scss" scoped>
.table {
  margin-right: 20px;
}

.table-row-details {
  padding: 20px;
}

.row {
  margin: 40px 0 20px;
}
</style>