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
        <button v-if="canCreatePayment" @click="create" class="button button--create">
          <span class="icon-new-payment-btn-icon"></span>
          {{ $t('actions.new_payment') }}
        </button>
      </div>
    </template>
    <template v-else>
      <div class="table__heading">
        <button v-if="canCreatePayment" @click="create" class="button button--create">
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
        :context-menu-builder="contextMenuBuilder"
      >
        <template slot="head">
          <column width="17%">{{ $t('fields.transaction_reference') }}</column>
          <column width="16%">{{ $t('fields.invoice') }}</column>
          <column width="20%">{{ $t('fields.client_name') }}</column>
          <column width="11%">{{ $t('fields.method') }}</column>
          <column width="11%">{{ $t('fields.amount') }}</column>
          <column width="11%">{{ $t('fields.date_created') }}</column>
          <column width="14%" class="column--center">{{ $t('fields.status') }}</column>
        </template>
        <template slot="columns" slot-scope="{ row }">
          <column width="17%">
            <a href="#" @click.prevent="editDocument(row, 'payment')">
              {{ row.paymentReference }}
            </a>
          </column>
          <column width="16%">
            <a href="#" @click.prevent="editDocument(row.invoice, 'invoice')">
              {{ row.invoice.invoiceNumber }}
            </a>
          </column>
          <column width="20%">
            <a href="#" @click.prevent="editDocument(row.client, 'client')">
              {{ row.client.name }}
            </a>
          </column>
          <column width="11%">
            <span>{{ row.paymentType ? row.paymentType.name : '-' }}</span>
          </column>
          <column width="11%">
            <span class="currency">{{ row.amount.currency | currencySymbol }}</span>
            <span class="currency currency--primary">{{ row.amount.amount | currency }}</span>
          </column>
          <column width="11%">
            <span>{{ row.paymentDate | date }}</span>
          </column>
          <column width="14%" class="column--center">
            <statuses-list type="payment" :document-uuid="row.uuid"></statuses-list>
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
  IsPaymentCompletedFilter,
  IsRefundedFilter,
  PaymentMethodsFilter,
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
      return 'payments'
    },

    searchBy() {
      return [
        SearchByText.extend({ key: 'invoice.invoiceNumber', name: 'invoice_number', placeholder: this.$t('search_by.invoice_number') }),
        SearchByDate.extend({ key: 'createdAt', name: 'payment_date', placeholder: this.$t('search_by.payment_date') }),
        SearchByValue.extend({ key: 'amount.amount', name: 'payment_amount', placeholder: this.$t('search_by.payment_amount') }),
        { type: 'separator' },
        SearchByText.extend({ key: 'client.name', name: 'client_name', placeholder: this.$t('search_by.client_name') }),
        SearchByItemsProduct.extend({ key: 'invoice', name: 'product_name', placeholder: this.$t('search_by.product_name') })
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
        CurrenciesFilter.make(this.currencies),
        { type: 'separator' },
        ClientsFilter.make(this.clients),
        InvoiceProductsFilter.make(this.products)
      ]
    },

    paymentMethods() {
      const paymentTypes = this.$store.getters[`table/${this.name}/activeItems`].map((payment) => {
        return {
          id: payment.paymentType.id,
          name: payment.paymentType.name
        }
      })
      return this.filterAndOrder(paymentTypes, {
        filterBy: 'id',
        orderBy: 'name'
      })
    },

    clients() {
      const clients = this.$store.getters[`table/${this.name}/activeItems`].map((payment) => payment.client)

      return this.filterAndOrder(clients, {
        filterBy: 'uuid',
        orderBy: 'name'
      })
    },

    currencies() {
      const currencies = this.$store.getters[`table/${this.name}/activeItems`]
        .filter((payment) => payment.currency)
        .map((payment) => payment.currency)

      return this.filterAndOrder(currencies, {
        filterBy: 'code',
        orderBy: 'name'
      })
    },

    products() {
      let products = []

      // Get all invoices products
      this.$store.getters[`table/${this.name}/activeItems`].forEach((payment) => {
        const invoice = payment.invoice

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
      this.createDocument('payment')
    },

    edit(data) {
      this.editDocument(data, 'payment')
    }
  }
}
</script>