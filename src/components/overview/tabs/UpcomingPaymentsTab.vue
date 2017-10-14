<template>
  <div v-show="isActive" class="tab tab--dashboard">
    <template v-if="!upcomingInvoices || !upcomingInvoices.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--invoices"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Add a new invoice by pressing the button below.
        </div>
        <button @click="create" class="button button--create">
          <span class="icon-new-invoice-btn-icon"></span>
          {{ $t('actions.new_invoice') }}
        </button>
      </div>
    </template>
    <documents-table v-else simple
      :documents="upcomingInvoices"
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
      <template slot="columns" scope="props">
        <column width="18%">
          <a :href="`#${props.row.uuid}`" @click="edit(props.row)">{{ props.row.invoice_number }}</a>
        </column>
        <column width="22%">
          <span>{{ props.row.client ? props.row.client.name : '-' }}</span>
        </column>
        <column width="17%">
          <span>{{ props.row.invoice_date | date }}</span>
        </column>
        <column width="17%">
          <span>{{ props.row.due_date | date }}</span>
        </column>
        <column width="13%">
          <span class="currency">{{ props.row.currency | currencySymbol }}</span>
          <span class="currency currency--primary">{{ props.row.amount | currency }}</span>
        </column>
        <column width="13%">
          <span class="currency">{{ props.row.currency | currencySymbol }}</span>
          <span class="currency currency--secondary"
                :class="{
                  'currency--primary': props.row.paid_in === props.row.amount
                }">
            {{ props.row.paid_in | currency }}
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
  Restore,
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
      default: 'Upcoming Payments'
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
        Delete,
        Restore
      ]
    },

    upcomingInvoices() {
      return this.$store.getters['table/invoices/waitingForPayments']
    },

    tableData() {
      return {
        name: this.name,
        pageList: this.upcomingInvoices,
        selection: this.state.selection
      }
    }
  },

  methods: {
    create() {
      this.$store.dispatch('form/invoice/OPEN_CREATE_FORM')
    },

    edit(data) {
      this.$store.dispatch('form/invoice/OPEN_EDIT_FORM', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  margin-right: 20px;
}
</style>