<template>
  <div v-show="isActive" class="tab tab--dashboard">
    <template v-if="!projects.length">
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
      <template slot="columns" slot-scope="{ row }">
          <column width="20%">
            <a href="#" @click="open(row)">
              {{ row.name }}
            </a>
          </column>
          <column width="20%">
            {{ row.tasks | projectProgress }}
          </column>
          <column width="60%">
            {{ row.description }}
          </column>
      </template>
      <template slot="details" slot-scope="props">
        <project-details :project="row"></project-details>
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
  Unarchive,
  Recover,
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
        Archive.extend({ moreThanOne: true }),
        Unarchive.extend({ moreThanOne: true }),
        Recover.extend({ moreThanOne: true }),
        Delete.extend({ moreThanOne: true }),
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
        Unarchive,
        Delete,
        Recover
      ]
    },

    projects() {
      return this.$store.getters['table/projects/activeItems']
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
      this.createDocument('project')
    },

    edit(data) {
      this.editDocument(data, 'project')
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