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
        :context-menu-actions="contextMenuActions"
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
        <template slot="table-controls-left"></template>
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
  EditDocument,
  InvoiceExpense
} from '@/modules/table/cm-actions'

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

    contextMenuActions() {
      return [
        SELECTED_ROWS,
        Archive.extend({ moreThanOne: true }),
        Unarchive.extend({ moreThanOne: true }),
        Recover.extend({ moreThanOne: true }),
        Delete.extend({ moreThanOne: true }),
        __SEPARATOR__.isVisible(whenMoreThanOneRowIsSelected),
        TableName.extend({
          title: 'common.expense_table'
        }),
        CreateDocument.extend({
          documentType: 'expense',
          title: 'actions.new_expense',
          icon: 'icon-new-expense-btn-icon'
        }),
        SELECTED_DOCUMENT.extend({ documentType: 'expense' }),
        Preview.extend({ title: 'actions.preview' }),
        EditDocument.extend({ title: 'actions.edit_expense' }),
        InvoiceExpense,
        __SEPARATOR__.isVisible(whenSpecificRowIsSelected),
        Archive,
        Unarchive,
        Delete,
        Recover
      ]
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