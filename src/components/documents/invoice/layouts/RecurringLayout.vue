<template>
  <div>
    <template v-if="!availableItems.length">
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
          <filter-by ref="filterByComponent" :watch="{ frequencies, clients, invoice_products: products }" :name="name" :options="filterBy"></filter-by>
          <search-by :name="name" :options="searchBy"></search-by>
        </div>
      </div>

      <tabs tab="Recurring" @change="$emit('change', $event)" labels visuals-only>
        <tab title="Invoices"></tab>
        <tab title="Recurring"></tab>
      </tabs>

      <documents-table
        @apply-filters-to-show-hidden-results="applyFiltersToShowHiddenResults"
        :data="list"
        :context-menu-actions="contextMenuActions"
      >
        <template slot="head">
          <column width="13%">{{ $t('fields.frequency') }}</column>
          <column width="17%">{{ $t('fields.client_name') }}</column>
          <column width="14%">{{ $t('fields.start_date') }}</column>
          <column width="14%">{{ $t('fields.last_sent') }}</column>
          <column width="15%">{{ $t('fields.end_date') }}</column>
          <column width="15%">{{ $t('fields.amount') }}</column>
          <column width="12%" class="column--center">{{ $t('fields.status') }}</column>
        </template>
        <template slot="columns" slot-scope=" { row }">
          <column width="13%">
            <a :href="`#${row.uuid}`" @click="edit(row)">
              {{ row.frequency | frequencyName }}
            </a>
          </column>
          <column width="17%">
            <span>{{ row.client ? row.client.name : '' }}</span>
          </column>
          <column width="14%">
            <span>{{ row.startDate | date }}</span>
          </column>
          <column width="14%">
            <span>{{ row.lastSent | date }}</span>
          </column>
          <column width="15%">
            <span>{{ row.endDate | date }}</span>
          </column>
          <column width="15%">
            <span class="currency">{{ row.amount.currency | currencySymbol }}</span>
            <span class="currency currency--primary">{{ row.amount.amount | currency }}</span>
          </column>
          <column width="12%" class="column--center">
            <statuses-list type="recurring_invoice" :document-uuid="row.uuid"></statuses-list>
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
  Unarchive,
  Recover,
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
        Archive.extend({ moreThanOne: true }),
        Unarchive.extend({ moreThanOne: true }),
        Recover.extend({ moreThanOne: true }),
        Delete.extend({ moreThanOne: true }),
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
      const clients = this.$store.getters[`table/${this.name}/activeItems`]
        .map((invoice) => invoice.client)

      return this.filterAndOrder(clients, {
        filterBy: 'uuid',
        orderBy: 'name'
      })
    },

    products() {
      let products = []

      // Get all invoices products
      this.$store.getters[`table/${this.name}/activeItems`].forEach((invoice) => {
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
      this.createDocument('recurring_invoice')
    },

    edit(data) {
      this.editDocument(data, 'recurring_invoice')
    }
  }
}
</script>