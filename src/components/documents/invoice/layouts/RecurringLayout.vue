<template>
  <div>
    <template v-if="!state.items || !state.items.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--invoices"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Oops! There are no recurring invoices here.<br>
          Add a new recurring invoice by pressing the button below.
        </div>
        <button @click="create" class="button button--create">
          <span class="icon-new-recurring-btn-icon"></span>
          {{ $t('actions.new_recurring_invoice') }}
        </button>
      </div>
    </template>
    <template v-else>
      <breadcrumb :path="[ $t('common.recurring_invoices') ]"></breadcrumb>

      <div class="table__heading">
        <button @click="create" class="button button--create">
          <span class="icon-new-recurring-btn-icon"></span>
          {{ $t('actions.new_invoice') }}
        </button>

        <div class="table__dropdowns">
          <filter-by :watch="{ frequencies, clients, invoice_products: products }" :name="name" :options="filterBy"></filter-by>
          <search-by :name="name" :options="searchBy"></search-by>
        </div>
      </div>

      <tabs tab="Recurring" @change="$emit('change', $event)" labels visuals-only>
        <tab title="Invoices"></tab>
        <tab title="Recurring"></tab>
      </tabs>

      <documents-table :data="list" :context-menu-actions="contextMenuActions">
        <template slot="head">
          <column width="16%">{{ $t('fields.frequency') }}</column>
          <column width="20%">{{ $t('fields.client_name') }}</column>
          <column width="11%">{{ $t('fields.start_date') }}</column>
          <column width="11%">{{ $t('fields.last_sent') }}</column>
          <column width="15%">{{ $t('fields.end_date') }}</column>
          <column width="15%">{{ $t('fields.amount') }}</column>
          <column width="12%" class="column--center">{{ $t('fields.status') }}</column>
        </template>
        <template slot="columns" slot-scope="props">
          <column width="16%">
            <a :href="`#${props.row.uuid}`" @click="edit(props.row)">
              {{ props.row.frequency | frequencyName }}
            </a>
          </column>
          <column width="20%">
            <span>{{ props.row.client ? props.row.client.name : '' }}</span>
          </column>
          <column width="11%">
            <span>{{ props.row.start_date | date }}</span>
          </column>
          <column width="11%">
            <span>{{ props.row.last_sent | date }}</span>
          </column>
          <column width="15%">
            <span>{{ props.row.end_date | date }}</span>
          </column>
          <column width="15%">
            <span class="currency">{{ props.row.currency | currencySymbol }}</span>
            <span class="currency currency--primary">{{ props.row.amount | currency }}</span>
          </column>
          <column width="12%" class="column--center">
            <statuses-list type="recurring_invoice" :document="props.row"></statuses-list>
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
  IsPendingFilter,
  IsOverdueFilter,
  FrequenciesFilter,
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
  EditDocument,
  CloneDocument
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
      return 'recurring_invoices'
    },

    searchBy() {
      return [
        SearchByDate.extend({ key: 'start_date', name: 'start_date', placeholder: this.$t('search_by.start_date') }),
        SearchByDate.extend({ key: 'last_sent', name: 'last_sent', placeholder: this.$t('search_by.last_sent_date') }),
        SearchByValue.extend({ key: 'amount', name: 'amount', placeholder: this.$t('search_by.amount') }),
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
          title: 'common.recurring_invoice_table'
        }),
        CreateDocument.extend({
          documentType: 'recurring_invoice',
          title: 'actions.new_recurring_invoice',
          icon: 'icon-new-recurring-btn-icon'
        }),
        SELECTED_DOCUMENT.extend({ documentType: 'invoice' }),
        EditDocument.extend({ title: 'actions.edit_invoice' }),
        CloneDocument.extend({ title: 'actions.clone_invoice' }),
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
        IsPendingFilter,
        IsOverdueFilter,
        { type: 'separator' },
        FrequenciesFilter.make(this.frequencies),
        { type: 'separator' },
        ClientsFilter.make(this.clients),
        InvoiceProductsFilter.make(this.products)
      ]
    },

    frequencies() {
      return this.$store.state.passive.frequencies
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
      this.$store.dispatch('form/recurring_invoice/OPEN_CREATE_FORM')
    },

    edit(data) {
      this.$store.dispatch('form/recurring_invoice/OPEN_EDIT_FORM', data)
    }
  }
}
</script>