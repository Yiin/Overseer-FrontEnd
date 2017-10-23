<template>
  <div>
    <template v-if="!availableItems.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--invoices"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Here you can create and manage invoices, <br>
          E-Mail them to clients and save drafts.
        </div>
        <button @click="create" class="button button--create">
          <span class="icon-new-invoice-btn-icon"></span>
          {{ $t('actions.new_invoice') }}
        </button>
      </div>
    </template>
    <template v-else>
      <breadcrumb :path="[ $t('common.invoices') ]"></breadcrumb>

      <div class="table__heading">
        <button @click="create" class="button button--create">
          <span class="icon-new-invoice-btn-icon"></span>
          {{ $t('actions.new_invoice') }}
        </button>

        <div class="table__dropdowns">
          <filter-by ref="filterByComponent" :watch="{ clients, invoice_products: products }" :name="name" :options="filterBy"></filter-by>
          <search-by :name="name" :options="searchBy"></search-by>
        </div>
      </div>

      <tabs tab="Invoices" @change="$emit('change', $event)" labels visuals-only>
        <tab title="Invoices"></tab>
        <tab title="Recurring"></tab>
      </tabs>

      <documents-table
        @apply-filters-to-show-hidden-results="applyFiltersToShowHiddenResults"
        :data="list"
        :context-menu-actions="contextMenuActions"
      >
        <template slot="head">
          <column width="16%">{{ $t('fields.invoice_number') }}</column>
          <column width="20%">{{ $t('fields.client_name') }}</column>
          <column width="15%">{{ $t('fields.date') }}</column>
          <column width="15%">{{ $t('fields.due_date') }}</column>
          <column width="10%">{{ $t('fields.amount') }}</column>
          <column width="10%">{{ $t('fields.paid_in') }}</column>
          <column width="14%" class="column--center">{{ $t('fields.status') }}</column>
        </template>
        <template slot="columns" slot-scope="{ row }">
          <column width="16%">
            <a :href="`#${row.uuid}`" @click="edit(row)">
              {{ row.invoiceNumber }}
            </a>
          </column>
          <column width="20%">
            <a href="#" @click.prevent="editDocument(row.client, 'client')">
              {{ row.client.name }}
            </a>
          </column>
          <column width="15%">
            <span>{{ row.invoiceDate | date }}</span>
          </column>
          <column width="15%">
            <span>{{ row.dueDate | date }}</span>
          </column>
          <column width="10%">
            <span class="currency">{{ row.amount.currency | currencySymbol }}</span>
            <span class="currency currency--primary">{{ row.amount.amount | currency }}</span>
          </column>
          <column width="10%">
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
          <column width="14%" class="column--center">
            <statuses-list type="invoice" :document="row"></statuses-list>
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
  IsPartialFilter,
  IsPaidFilter,
  IsOverdueFilter,
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
  Restore,
  PrintDocument,
  Preview,
  EditDocument,
  CloneDocument,
  ViewHistory,
  MarkSent,
  MarkPaid,
  EnterPayment
} from '@/modules/table/cm-actions'

export default {
  mixins: [
    TableMixin
  ],

  props: {
    currentLayout: {
      type: String
    }
  },

  computed: {
    name() {
      return 'invoices'
    },

    searchBy() {
      return [
        SearchByText.extend({ key: 'invoice_number', name: 'invoice_number', placeholder: this.$t('search_by.invoice_number') }),
        SearchByDate.extend({ key: 'invoice_date', name: 'invoice_date', placeholder: this.$t('search_by.invoice_date') }),
        SearchByDate.extend({ key: 'due_date', name: 'due_date', placeholder: this.$t('search_by.due_date') }),
        SearchByValue.extend({ key: 'amount', name: 'invoice_amount', placeholder: this.$t('search_by.invoice_amount') }),
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
          title: 'common.invoice_table'
        }),
        CreateDocument.extend({
          documentType: 'invoice',
          title: 'actions.new_invoice',
          icon: 'icon-new-invoice-btn-icon'
        }),
        SELECTED_DOCUMENT.extend({ documentType: 'invoice' }),
        PrintDocument.extend({ title: 'actions.print_invoice' }),
        Preview,
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
        IsPartialFilter,
        IsPaidFilter,
        IsOverdueFilter,
        { type: 'separator' },
        ClientsFilter.make(this.clients),
        InvoiceProductsFilter.make(this.products)
      ]
    },

    clients() {
      const clients = this.$store.getters[`table/${this.name}/filteredItems`]
        .map((invoice) => invoice.client)
        .filter((client) => client)

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
      this.$store.dispatch('form/invoice/OPEN_CREATE_FORM')
    },

    edit(data) {
      this.$store.dispatch('form/invoice/OPEN_EDIT_FORM', data)
    }
  }
}
</script>