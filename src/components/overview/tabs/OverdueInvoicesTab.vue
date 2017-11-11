<template>
  <div v-show="isActive" class="tab tab--dashboard">
    <template v-if="!overdueInvoices || !overdueInvoices.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--invoices"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          There are no overdue invoices.
        </div>
      </div>
    </template>
    <documents-table v-else simple
      :documents="overdueInvoices"
      :data="tableData"
      :context-menu-actions="contextMenuActions"
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
          <span>{{ row.invoiceDate | date }}</span>
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
  EditDocument,
  CloneDocument,
  ViewHistory,
  MarkSent,
  MarkPaid,
  EnterPayment
} from '@/modules/table/cm-actions'

export default {
  extends: Tab,

  mixins: [TableMixin],

  props: {
    title: {
      default: 'Overdue Invoices'
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
          title: 'common.invoice_table'
        }),
        CreateDocument.extend({
          documentType: 'invoice',
          title: 'actions.new_invoice',
          icon: 'icon-new-invoice-btn-icon'
        }),
        SELECTED_DOCUMENT.extend({ documentType: 'invoice' }),
        EditDocument.extend({ title: 'actions.edit_invoice' }),
        CloneDocument.extend({ title: 'actions.clone_invoice' }),
        ViewHistory,
        __SEPARATOR__.isVisible(whenSpecificRowIsSelected),
        MarkSent,
        MarkPaid,
        EnterPayment,
        __SEPARATOR__.isVisible(whenSpecificRowIsSelected),
        Archive,
        Unarchive,
        Delete,
        Recover
      ]
    },

    overdueInvoices() {
      return this.$store.getters['table/invoices/overdue']
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