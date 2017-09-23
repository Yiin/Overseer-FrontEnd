<template>
  <div>
    <breadcrumb :path="[ $t('common.expenses') ]"></breadcrumb>

    <div class="table__heading">
      <a @click="create" class="button button--create">
        <span class="icon-new-expense-btn-icon"></span>
        {{ $t('actions.new_expense') }}
      </a>

      <div class="table__dropdowns">
        <filter-by :watch="{ currencies, clients }" :name="name" :options="filterBy"></filter-by>
        <search-by :name="name" :options="searchBy"></search-by>
      </div>
    </div>

    <documents-table :data="list" :context-menu-actions="contextMenuActions">
      <template slot="head">
        <column width="20%">{{ $t('fields.vendor_name') }}</column>
        <column width="20%">{{ $t('fields.client_name') }}</column>
        <column width="12%">{{ $t('fields.category') }}</column>
        <column width="12%">{{ $t('fields.public_notes') }}</column>
        <column width="12%">{{ $t('fields.expense_date') }}</column>
        <column width="12%">{{ $t('fields.amount') }}</column>
        <column width="12%" class="column--center">{{ $t('fields.status') }}</column>
      </template>
      <template slot="columns" scope="props">
        <column width="20%">
          <a :href="`#${props.row.uuid}`" @click="edit(props.row)">{{ props.row.vendor.company_name }}</a>
        </column>
        <column width="20%">
          <a :href="`#${props.row.uuid}`" @click="edit(props.row)">{{ props.row.client.name }}</a>
        </column>
        <column width="12%">
          <!-- <a :href="`#${props.row.uuid}`" @click="edit(props.row)">{{ props.row.category.name }}</a> -->
        </column>
        <column width="12%">
          <span></span>
        </column>
        <column width="12%">
          <span>{{ props.row.date | date }}</span>
        </column>
        <column width="12%">
          <span class="currency">{{ props.row.currency | currencySymbol }}</span>
          <span class="currency currency--primary">{{ props.row.amount | currency }}</span>
        </column>
        <column width="12%" class="column--center">
          <statuses-list type="expense" :document="props.row"></statuses-list>
        </column>
      </template>
      <template slot="table-controls-left"></template>
    </documents-table>

    <table-footer :table-name="name"></table-footer>
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
        SearchByText.extend({ key: 'invoice_number', name: 'invoice_number', placeholder: this.$t('search_by.invoice_number') }),
        SearchByDate.extend({ key: 'date', name: 'expense_date', placeholder: this.$t('search_by.expense_date') }),
        SearchByValue.extend({ key: 'amount', name: 'expense_amount', placeholder: this.$t('search_by.expense_amount') }),
        { type: 'separator' },
        SearchByText.extend({ key: 'vendor.company_name', name: 'vendor_name', placeholder: this.$t('search_by.vendor_name') })
      ]
    },

    contextMenuActions() {
      return [
        SELECTED_ROWS,
        Archive.isVisible(whenMoreThanOneRowIsSelected),
        Delete.isVisible(whenMoreThanOneRowIsSelected),
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
        EditDocument.extend({ title: 'actions.edit_expense' }),
        InvoiceExpense,
        __SEPARATOR__.isVisible(whenSpecificRowIsSelected),
        Archive,
        Delete
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
        CurrenciesFilter,
        ClientsFilter
      ]
    },

    currencies() {
      const currencies = this.$store.getters[`table/${this.name}/filteredItems`]
        .filter((expense) => expense.currency)
        .map((expense) => expense.currency.id)

      return this.filterAndOrder(currencies, {
        filterBy: 'id',
        orderBy: 'name'
      })
    },

    clients() {
      const clients = this.$store.getters[`table/${this.name}/filteredItems`]
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
      this.$store.dispatch('form/expense/OPEN_CREATE_FORM')
    },

    edit(data) {
      this.$store.dispatch('form/expense/OPEN_EDIT_FORM', data)
    }
  }
}
</script>