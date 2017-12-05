<template>
  <div>
    <template v-if="!availableItems.length">
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
          <filter-by ref="filterByComponent" :watch="{ clients, products }" :name="name" :options="filterBy"></filter-by>
          <search-by :name="name" :options="searchBy"></search-by>
        </div>
      </div>

      <documents-table
        @apply-filters-to-show-hidden-results="applyFiltersToShowHiddenResults"
        :data="list"
        :context-menu-builder="contextMenuBuilder"
      >
        <template slot="head">
          <column width="20%">{{ $t('fields.quote_number') }}</column>
          <column width="20%">{{ $t('fields.client_name') }}</column>
          <column width="15%">{{ $t('fields.date') }}</column>
          <column width="15%">{{ $t('fields.valid_until') }}</column>
          <column width="16%">{{ $t('fields.amount') }}</column>
          <column width="14%" class="column--center">{{ $t('fields.status') }}</column>
        </template>
        <template slot="columns" slot-scope="{ row }">
          <column width="20%">
            <a href="#" @click.prevent="edit(row)">
              {{ row.quoteNumber }}
            </a>
          </column>
          <column width="20%">
            <a href="#" @click.prevent="editDocument(row.client, 'client')">
              {{ row.client.name }}
            </a>
          </column>
          <column width="15%">
            <span>{{ row.date | date }}</span>
          </column>
          <column width="15%">
            <span>{{ row.dueDate | date }}</span>
          </column>
          <column width="16%">
            <span class="currency">{{ row.currency | currencySymbol }}</span>
            <span class="currency currency--primary">{{ row.amount.amount | currency }}</span>
          </column>
          <column width="14%" class="column--center">
            <statuses-list type="quote" :document-uuid="row.uuid"></statuses-list>
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
  IsQuoteDraftFilter,
  IsQuoteSentFilter,
  IsQuoteViewedFilter,
  IsQuoteApprovedFilter,
  CurrenciesFilter,
  ClientsFilter,
  InvoiceProductsFilter,

  // Search By
  SearchByText,
  SearchByValue,
  SearchByDate,
  SearchByItemsProduct
} from '@/modules/table/filters'

import TableCmItems from '@/modules/table/contextmenu/items'

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
        SearchByDate.extend({ key: 'date', name: 'quote_date', placeholder: this.$t('search_by.quote_date') }),
        SearchByDate.extend({ key: 'dueDate', name: 'valid_until_date', placeholder: this.$t('search_by.valid_until_date') }),
        SearchByValue.extend({ key: 'amount', name: 'invoice_amount', placeholder: this.$t('search_by.amount') }),
        { type: 'separator' },
        SearchByText.extend({ key: 'client.name', name: 'client_name', placeholder: this.$t('search_by.client_name') }),
        SearchByItemsProduct.extend({ name: 'product_name', placeholder: this.$t('search_by.product_name') })
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
          title: this.$t('actions.clone_quote')
        }))
        .addItem(TableCmItems.HISTORY_LIST)
        .addSeparator()
        .addItem(TableCmItems.PRINT_DOCUMENT.extend({ title: this.$t('actions.print_quote') }))
        .addItem(TableCmItems.CONVERT_TO_INVOICE)
        .addItem(TableCmItems.VIEW_INVOICE)
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
        IsQuoteDraftFilter,
        IsQuoteSentFilter,
        IsQuoteViewedFilter,
        IsQuoteApprovedFilter,
        { type: 'separator' },
        CurrenciesFilter.make(this.currencies),
        { type: 'separator' },
        ClientsFilter.make(this.clients),
        InvoiceProductsFilter.make(this.products)
      ]
    },

    clients() {
      const clients = this.$store.getters[`table/${this.name}/activeItems`].map((quote) => quote.client)
      return this.filterAndOrder(clients, {
        filterBy: 'uuid',
        orderBy: 'name'
      })
    },

    currencies() {
      const currencies = this.$store.getters[`table/${this.name}/activeItems`]
        .map((quote) => quote.currency)
        .filter((currency) => currency)

      return this.filterAndOrder(currencies, {
        filterBy: 'code',
        orderBy: 'name'
      })
    },

    products() {
      let products = []

      // Get all invoices products
      this.$store.getters[`table/${this.name}/activeItems`].forEach((quote) => {
        if (!quote.items) {
          return
        }
        quote.items.forEach((item) => {
          if (!item.product) {
            return
          }
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
      this.createDocument('quote')
    },

    edit(data) {
      this.editDocument(data, 'quote')
    }
  }
}
</script>