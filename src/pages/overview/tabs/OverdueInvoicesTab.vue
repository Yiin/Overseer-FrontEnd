<template>
  <div v-show="isActive" class="tab tab--dashboard">
    <template v-if="!overdueInvoices || !overdueInvoices.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--invoices"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          <template v-if="profile">This employee has no overdue invoices.</template>
          <template v-else>There are no overdue invoices.</template>
        </div>
      </div>
    </template>
    <documents-table v-else simple
      :documents="overdueInvoices"
      :data="tableData"
      :context-menu-builder="contextMenuBuilder"
    >
      <template slot="head">
        <column width="18%">{{ $t('fields.invoice_number') }}</column>
        <column width="22%">{{ $t('fields.client_name') }}</column>
        <column width="17%">{{ $t('fields.date') }}</column>
        <column width="17%">{{ $t('fields.due_date') }}</column>
        <column width="13%">{{ $t('fields.amount') }}</column>
        <column width="13%">{{ $t('fields.paid_in') }}</column>
      </template>
      <template slot="columns" slot-scope="{ row }">
        <column width="18%">
          <a :href="`#${row.uuid}`" @click="edit(row)">{{ row.invoiceNumber }}</a>
        </column>
        <column width="22%">
          <span>{{ row.client ? row.client.name : '-' }}</span>
        </column>
        <column width="17%">
          <span>{{ row.date | date }}</span>
        </column>
        <column width="17%">
          <span>{{ row.dueDate | date }}</span>
        </column>
        <column width="13%">
          <span class="currency">{{ row.currency | currencySymbol }}</span>
          <span class="currency currency--primary">{{ row.amount.get() | currency }}</span>
        </column>
        <column width="13%">
          <span class="currency">{{ row.currency | currencySymbol }}</span>
          <span class="currency currency--secondary"
                :class="{
                  'currency--primary': row.paidIn.get() === row.amount.get()
                }">
            {{ row.paidIn.get() | currency }}
          </span>
        </column>
      </template>
    </documents-table>
  </div>
</template>

<script>
import Tab from '@/components/common/Tabs/Tab.vue'
import TableMixin from '@/mixins/TableMixin'

import TableCmItems from '@/modules/table/contextmenu/items'

export default {
  extends: Tab,

  mixins: [TableMixin],

  props: {
    title: {
      default: 'Overdue Invoices'
    },
    profile: {
      default: null
    }
  },

  computed: {
    name() {
      return 'invoices'
    },

    contextMenuBuilder() {
      return this.$contextMenu.init({
        tableStateName: this.name
      }).addItem(TableCmItems.SELECTED_ROWS)
        .addItem(TableCmItems.ARCHIVE_MANY)
        .addItem(TableCmItems.UNARCHIVE_MANY)
        .addItem(TableCmItems.DELETE_MANY)
        .addItem(TableCmItems.RECOVER_MANY)
        .addSeparator()
        .addItem(TableCmItems.TABLE_NAME)
        .addItem(TableCmItems.CREATE_DOCUMENT.extend({
          title: this.$t('actions.new_invoice')
        }))
        .addItem(TableCmItems.SELECTED_DOCUMENT)
        .addItem(TableCmItems.PREVIEW)
        .addItem(TableCmItems.EDIT_DOCUMENT)
        .addItem(TableCmItems.HISTORY_LIST)
        .addSeparator()
        .addItem(TableCmItems.CLONE_DOCUMENT.extend({
          title: this.$t('actions.clone_invoice')
        }))
        .addItem(TableCmItems.PRINT_DOCUMENT.extend({
          title: this.$t('actions.print_invoice')
        }))
        .addSeparator()
        .addItem(TableCmItems.ENTER_PAYMENT)
        .addSeparator()
        .addItem(TableCmItems.ARCHIVE)
        .addItem(TableCmItems.UNARCHIVE)
        .addItem(TableCmItems.DELETE)
        .addItem(TableCmItems.RECOVER)
    },

    overdueInvoices() {
      return this.$store.getters['table/invoices/overdue'].filter((invoice) => {
        return invoice.userUuid === this.$user.uuid
      })
    },

    tableData() {
      return {
        name: this.name,
        pageList: this.overdueInvoices,
        selection: this.state.selection
      }
    }
  },

  methods: {
    edit(data) {
      this.editDocument(data, 'invoice')
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  margin-right: 20px;
}
</style>