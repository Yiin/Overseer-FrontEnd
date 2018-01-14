<template>
  <div v-show="isActive" class="tab tab--dashboard">
    <template v-if="!upcomingInvoices || !upcomingInvoices.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--invoices"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          <template v-if="profile">This employee has no upcoming payments.</template>
          <template v-else>Add a new invoice by pressing the button below.</template>
        </div>
        <button v-if="!profile" @click="create" class="button button--create">
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
      <template slot="columns" slot-scope="{ row }">
        <column width="18%">
          <a href="#" @click="edit(row)">
            {{ row.invoiceNumber }}
          </a>
        </column>
        <column width="22%">
          <a href="#" @click.prevent="editDocument(row.client, 'client')">
            {{ row.client.name }}
          </a>
        </column>
        <column width="17%">
          <span>{{ row.date | date }}</span>
        </column>
        <column width="17%">
          <span>{{ row.dueDate | date }}</span>
        </column>
        <column width="13%">
          <span class="currency">{{ row.amount.currency | currencySymbol }}</span>
          <span class="currency currency--primary">{{ row.amount.amount | currency }}</span>
        </column>
        <column width="13%">
          <span class="currency">{{ row.paidIn.currency | currencySymbol }}</span>
          <span class="currency"
                :class="{
                  'currency--secondary': row.paidIn.amount < row.amount.amount,
                  'currency--primary': row.paidIn.amount >= row.amount.amount
                }"
          >
            {{ row.paidIn.amount | currency }}
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
      default: 'Upcoming Payments'
    },
    profile: {
      default: null
    }
  },

  computed: {
    name() {
      return 'invoices'
    },

    contextMenuActions() {
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
          title: this.$t('actions.clone_payment')
        }))
        .addItem(TableCmItems.REFUND_PAYMENT)
        .addItem(TableCmItems.HISTORY_LIST)
        .addSeparator()
        .addItem(TableCmItems.ARCHIVE)
        .addItem(TableCmItems.UNARCHIVE)
        .addItem(TableCmItems.DELETE)
        .addItem(TableCmItems.RECOVER)
    },

    upcomingInvoices() {
      return this.$store.getters['table/invoices/waitingForPayments'].filter((invoice) => {
        return invoice.userUuid === this.$user.uuid
      })
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
      this.createDocument('invoice')
    },

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