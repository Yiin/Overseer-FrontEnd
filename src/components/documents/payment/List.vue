<template>
  <div>
    <template v-if="!availableItems.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--payments"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Here you can enter incoming payments,<br>
          manage cashflow and track revenue.
        </div>
        <button @click="create" class="button button--create">
          <span class="icon-new-payment-btn-icon"></span>
          {{ $t('actions.new_payment') }}
        </button>
      </div>
    </template>
    <template v-else>
      <breadcrumb :path="[ $t('common.payments') ]"></breadcrumb>

      <div class="table__heading">
        <button @click="create" class="button button--create">
          <span class="icon-new-payment-btn-icon"></span>
          {{ $t('actions.new_payment') }}
        </button>

        <div class="table__dropdowns">
          <filter-by ref="filterByComponent" :watch="{ payment_methods: paymentMethods, clients, invoice_products: products }" :name="name" :options="filterBy"></filter-by>
          <search-by :name="name" :options="searchBy"></search-by>
        </div>
      </div>

      <documents-table
        @apply-filters-to-show-hidden-results="applyFiltersToShowHiddenResults"
        :data="list"
        :context-menu-actions="contextMenuActions"
      >
        <template slot="head">
          <column width="17%">{{ $t('fields.transaction_reference') }}</column>
          <column width="16%">{{ $t('fields.invoice') }}</column>
          <column width="20%">{{ $t('fields.client_name') }}</column>
          <column width="12%">{{ $t('fields.method') }}</column>
          <column width="12%">{{ $t('fields.amount') }}</column>
          <column width="11%">{{ $t('fields.date_created') }}</column>
          <column width="12%" class="column--center">{{ $t('fields.status') }}</column>
        </template>
        <template slot="columns" slot-scope="{ row }">
          <column width="17%">
            <a href="`#${row.key}`" @click.prevent="editDocument(row, 'payment')">
              {{ row.paymentReference }}
            </a>
          </column>
          <column width="16%">
            <a :href="`#${row.key}`" @click.prevent="editDocument(row.invoice, 'invoice')">
              {{ row.invoice.invoiceNumber }}
            </a>
          </column>
          <column width="20%">
            <a :href="`#${row.key}`" @click.prevent="editDocument(row.client, 'client')">
              {{ row.client.name }}
            </a>
          </column>
          <column width="12%">
            <span>{{ row.paymentType.name }}</span>
          </column>
          <column width="12%">
            <span class="currency">{{ row.amount.currency | currencySymbol }}</span>
            <span class="currency currency--primary">{{ row.amount.amount | currency }}</span>
          </column>
          <column width="11%">
            <span>{{ row.paymentDate | date }}</span>
          </column>
          <column width="12%" class="column--center">
            <statuses-list type="payment" :document="row"></statuses-list>
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
  IsPaymentCompletedFilter,
  IsRefundedFilter,
  PaymentMethodsFilter,
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
  RefundPayment
} from '@/modules/table/cm-actions'

export default {
  mixins: [
    TableMixin
  ],

  computed: {
    name() {
      return 'payments'
    },

    searchBy() {
      return [
        SearchByText.extend({ key: 'invoice.invoice_number', name: 'invoice_number', placeholder: this.$t('search_by.invoice_number') }),
        SearchByDate.extend({ key: 'created_at', name: 'payment_date', placeholder: this.$t('search_by.payment_date') }),
        SearchByValue.extend({ key: 'amount', name: 'payment_amount', placeholder: this.$t('search_by.payment_amount') }),
        { type: 'separator' },
        SearchByText.extend({ key: 'client.name', name: 'client_name', placeholder: this.$t('search_by.client_name') }),
        SearchByItemsProduct.extend({ key: 'invoice', name: 'product_name', placeholder: this.$t('search_by.product_name') })
      ]
    },

    contextMenuActions() {
      return [
        SELECTED_ROWS,
        Archive.isVisible(whenMoreThanOneRowIsSelected),
        Delete.isVisible(whenMoreThanOneRowIsSelected),
        __SEPARATOR__.isVisible(whenMoreThanOneRowIsSelected),
        TableName.extend({
          title: 'common.payment_table'
        }),
        CreateDocument.extend({
          documentType: 'payment',
          title: 'actions.new_payment',
          icon: 'icon-new-payment-btn-icon'
        }),
        SELECTED_DOCUMENT.extend({ documentType: 'payment' }),
        Preview.extend({ title: 'actions.preview' }),
        EditDocument.extend({ title: 'actions.edit_payment' }),
        RefundPayment,
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
        IsPaymentCompletedFilter,
        IsRefundedFilter,
        { type: 'separator' },
        PaymentMethodsFilter.make(this.paymentMethods),
        { type: 'separator' },
        ClientsFilter.make(this.clients),
        InvoiceProductsFilter.make(this.products)
      ]
    },

    paymentMethods() {
      const paymentTypes = this.$store.getters[`table/${this.name}/filteredItems`].map((payment) => {
        return {
          id: payment.method_id,
          name: payment.method
        }
      })
      return this.filterAndOrder(paymentTypes, {
        filterBy: 'id',
        orderBy: 'name'
      })
    },

    clients() {
      const clients = this.$store.getters[`table/${this.name}/filteredItems`].map((payment) => payment.client)
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
      this.$store.dispatch('form/payment/OPEN_CREATE_FORM')
    },

    edit(data) {
      this.$store.dispatch('form/payment/OPEN_EDIT_FORM', data)
    }
  }
}
</script>