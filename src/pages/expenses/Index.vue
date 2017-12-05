<template>
  <div>
    <template v-if="!availableItems.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--expenses"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Here you can enter expenses<br>
          and track expenditures.
        </div>
        <button @click="create" class="button button--create">
          <span class="icon-new-expense-btn-icon"></span>
          {{ $t('actions.new_expense') }}
        </button>
      </div>
    </template>
    <template v-else>
      <breadcrumb :path="[ $t('common.expenses') ]"></breadcrumb>

      <div class="table__heading">
        <button @click="create" class="button button--create">
          <span class="icon-new-expense-btn-icon"></span>
          {{ $t('actions.new_expense') }}
        </button>

        <div class="table__dropdowns">
          <filter-by ref="filterByComponent" :watch="{ currencies, clients }" :name="name" :options="filterBy"></filter-by>
          <search-by :name="name" :options="searchBy"></search-by>
        </div>
      </div>

      <documents-table
        @apply-filters-to-show-hidden-results="applyFiltersToShowHiddenResults"
        :data="list"
        :context-menu-builder="contextMenuBuilder"
      >
        <template slot="head">
          <column width="20%">{{ $t('fields.vendor_name') }}</column>
          <column width="20%">{{ $t('fields.client_name') }}</column>
          <column width="15%">{{ $t('fields.category') }}</column>
          <column width="16%">{{ $t('fields.amount') }}</column>
          <column width="15%">{{ $t('fields.expense_date') }}</column>
          <column width="14%" class="column--center">{{ $t('fields.status') }}</column>
        </template>
        <template slot="columns" slot-scope="{ row }">
          <column width="20%">
            <a href="#" @click.prevent="edit(row)">
              {{ row.vendor.name }}
            </a>
          </column>
          <column width="20%">
            <a href="#" @click.prevent="editDocument(row.client, 'client')">
              {{ row.client.name }}
            </a>
          </column>
          <column width="15%">
            <!-- <a :href="`#${row.uuid}`" @click="edit(row)">{{ row.category.name }}</a> -->
          </column>
          <column width="16%">
            <span class="currency">{{ row.amount.currency | currencySymbol }}</span>
            <span class="currency currency--primary">{{ row.amount.amount | currency }}</span>
          </column>
          <column width="15%">
            <span>{{ row.date | date }}</span>
          </column>
          <column width="14%" class="column--center">
            <statuses-list type="expense" :document-uuid="row.uuid"></statuses-list>
          </column>
        </template>
      </documents-table>

      <table-footer
        :table-name="name"
        :calculator-options="[
          { text: $t('fields.amount'), value: 'amount', type: 'money' }
        ]"
      ></table-footer>
    </template>
  </div>
</template>

<script>
import TableMixin from '@/mixins/TableMixin'
import {
  IsActiveFilter,
  IsArchivedFilter,
  IsDeletedFilter,
  ExpenseIsInvoicedFilter,
  ExpenseIsPendingFilter,
  ExpenseIsPaidFilter,
  ExpenseIsLoggedFilter,
  CurrenciesFilter,
  ClientsFilter,

  // Search By
  SearchByText,
  SearchByValue,
  SearchByDate
} from '@/modules/table/filters'

import TableCmItems from '@/modules/table/contextmenu/items'

export default {
  mixins: [
    TableMixin
  ],

  computed: {
    name() {
      return 'expenses'
    },

    searchBy() {
      return [
        SearchByText.extend({ key: 'invoice.invoiceNumber', name: 'invoice_number', placeholder: this.$t('search_by.invoice_number') }),
        SearchByDate.extend({ key: 'date', name: 'expense_date', placeholder: this.$t('search_by.expense_date') }),
        SearchByValue.extend({ key: 'amount.amount', name: 'expense_amount', placeholder: this.$t('search_by.expense_amount') }),
        { type: 'separator' },
        SearchByText.extend({ key: 'vendor.name', name: 'vendor_name', placeholder: this.$t('search_by.vendor_name') })
      ]
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
          title: this.$t('actions.clone_expense')
        }))
        .addItem(TableCmItems.INVOICE_EXPENSE)
        .addItem(TableCmItems.HISTORY_LIST)
        .addSeparator()
        .addItem(TableCmItems.ARCHIVE)
        .addItem(TableCmItems.UNARCHIVE)
        .addItem(TableCmItems.DELETE)
        .addItem(TableCmItems.RECOVER)
    },

    filterBy() {
      return [
        IsActiveFilter,
        IsArchivedFilter,
        IsDeletedFilter,
        { type: 'separator' },
        ExpenseIsLoggedFilter,
        ExpenseIsInvoicedFilter,
        ExpenseIsPendingFilter,
        ExpenseIsPaidFilter,
        { type: 'separator' },
        CurrenciesFilter.make(this.currencies),
        { type: 'separator' },
        ClientsFilter.make(this.clients)
      ]
    },

    currencies() {
      const currencies = this.$store.getters[`table/${this.name}/activeItems`]
        .filter((expense) => expense.amount.currency)
        .map((expense) => expense.amount.currency)

      return this.filterAndOrder(currencies, {
        filterBy: 'code',
        orderBy: 'name'
      })
    },

    clients() {
      const clients = this.$store.getters[`table/${this.name}/activeItems`]
        .filter((expense) => expense.client)
        .map((expense) => expense.client)

      return this.filterAndOrder(clients, {
        filterBy: 'uuid',
        orderBy: 'name'
      })
    }
  },

  methods: {
    create() {
      this.createDocument('expense')
    },

    edit(data) {
      this.editDocument(data, 'expense')
    }
  }
}
</script>