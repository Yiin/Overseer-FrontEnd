<template>
  <div>
    <template v-if="!state.items || !state.items.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--quotes"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Here you can create quotes for clients.<br>
          Quotes can be converted to invoices.
        </div>
        <button @click="create" class="button button--create">
          <span class="icon-new-quote-btn-icon"></span>
          {{ $t('actions.new_quote') }}
        </button>
      </div>
    </template>
    <template v-else>
      <breadcrumb :path="[ $t('common.quotes') ]"></breadcrumb>

      <div class="table__heading">
        <button @click="create" class="button button--create">
          <span class="icon-new-quote-btn-icon"></span>
          {{ $t('actions.new_quote') }}
        </button>

        <div class="table__dropdowns">
          <filter-by :watch="{ clients, products }" :name="name" :options="filterBy"></filter-by>
          <search-by :name="name" :options="searchBy"></search-by>
        </div>
      </div>

      <documents-table :data="list" :context-menu-actions="contextMenuActions">
        <template slot="head">
          <column width="20%">{{ $t('fields.quote_number') }}</column>
          <column width="20%">{{ $t('fields.client_name') }}</column>
          <column width="15%">{{ $t('fields.date') }}</column>
          <column width="15%">{{ $t('fields.valid_until') }}</column>
          <column width="18%">{{ $t('fields.amount') }}</column>
          <column width="12%" class="column--center">{{ $t('fields.status') }}</column>
        </template>
        <template slot="columns" scope="props">
          <column width="20%">
            <a :href="`#${props.row.uuid}`" @click="edit(props.row)">{{ props.row.quote_number }}</a>
          </column>
          <column width="20%">
            <span>{{ props.row.client.name }}</span>
          </column>
          <column width="15%">
            <span>{{ props.row.quote_date | date }}</span>
          </column>
          <column width="15%">
            <span>{{ props.row.due_date | date }}</span>
          </column>
          <column width="18%">
            <span class="currency">{{ props.row.currency | currencySymbol }}</span>
            <span class="currency currency--primary">{{ props.row.amount | currency }}</span>
          </column>
          <column width="12%" class="column--center">
            <statuses-list type="quote" :document="props.row"></statuses-list>
          </column>
        </template>
        <template slot="table-controls-left"></template>
      </documents-table>

      <table-footer :table-name="name"></table-footer>
    </template>
  </div>
</template>

<script>
import TableMixin from '@/mixins/TableMixin'
import {
  IsActiveFilter,
  IsArchivedFilter,
  IsDeletedFilter,
  IsDraftFilter,
  IsSentFilter,
  IsViewedFilter,
  IsApprovedFilter,
  ClientsFilter,
  InvoiceProductsFilter,

  // Search By
  SearchByText,
  SearchByValue,
  SearchByDate,
  SearchByItemsProduct
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
  EditDocument,
  CloneDocument,
  ViewHistory,
  MarkSent,
  ConvertToInvoice,
  ViewInvoice
} from '@/modules/table/cm-actions'

export default {
  mixins: [
    TableMixin
  ],

  computed: {
    name() {
      return 'quotes'
    },

    searchBy() {
      return [
        SearchByText.extend({ key: 'quote_number', name: 'quote_number', placeholder: this.$t('search_by.quote_number') }),
        SearchByDate.extend({ key: 'quote_date', name: 'quote_date', placeholder: this.$t('search_by.quote_date') }),
        SearchByDate.extend({ key: 'due_date', name: 'valid_until_date', placeholder: this.$t('search_by.valid_until_date') }),
        SearchByValue.extend({ key: 'amount', name: 'invoice_amount', placeholder: this.$t('search_by.amount') }),
        { type: 'separator' },
        SearchByText.extend({ key: 'client.name', name: 'client_name', placeholder: this.$t('search_by.client_name') }),
        SearchByItemsProduct.extend({ name: 'product_name', placeholder: this.$t('search_by.product_name') })
      ]
    },

    contextMenuActions() {
      return [
        SELECTED_ROWS,
        Archive.isVisible(whenMoreThanOneRowIsSelected),
        Delete.isVisible(whenMoreThanOneRowIsSelected),
        __SEPARATOR__.isVisible(whenMoreThanOneRowIsSelected),
        TableName.extend({
          title: 'common.quote_table'
        }),
        CreateDocument.extend({
          documentType: 'quote',
          title: 'actions.new_quote',
          icon: 'icon-new-quote-btn-icon'
        }),
        SELECTED_DOCUMENT.extend({ documentType: 'quote' }),
        Preview.extend({ title: 'actions.preview' }),
        EditDocument.extend({ title: 'actions.edit_quote' }),
        CloneDocument.extend({ title: 'actions.clone_quote' }),
        ViewHistory,
        __SEPARATOR__.isVisible(whenSpecificRowIsSelected),
        MarkSent,
        ConvertToInvoice,
        ViewInvoice,
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
        IsDraftFilter,
        IsSentFilter,
        IsViewedFilter,
        IsApprovedFilter,
        { type: 'separator' },
        ClientsFilter.make(this.clients),
        InvoiceProductsFilter.make(this.products)
      ]
    },

    clients() {
      const clients = this.$store.getters[`table/${this.name}/filteredItems`].map((invoice) => invoice.client)
      return this.filterAndOrder(clients, {
        filterBy: 'uuid',
        orderBy: 'name'
      })
    },

    products() {
      let products = []

      // Get all invoices products
      this.$store.getters[`table/${this.name}/filteredItems`].forEach((invoice) => {
        if (!invoice.items) {
          return
        }
        invoice.items.forEach((item) => {
          products.push(item.product)
        })
      })

      return this.filterAndOrder(products, {
        filterBy: 'uuid',
        orderBy: 'name'
      })
    }
  },

  methods: {
    create() {
      this.$store.dispatch('form/quote/OPEN_CREATE_FORM')
    },

    edit(data) {
      this.$store.dispatch('form/quote/OPEN_EDIT_FORM', data)
    }
  }
}
</script>