<template>
  <div>
    <template v-if="!availableItems.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--credits"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Here you can enter and manage credit notes;<br>
          Such as bank cheques and refunds.
        </div>
        <button @click="create" class="button button--create">
          <span class="icon-new-credit-btn-icon"></span>
          {{ $t('actions.new_credit') }}
        </button>
      </div>
    </template>
    <template v-else>
      <breadcrumb :path="[ $t('common.credits') ]"></breadcrumb>

      <div class="table__heading">
        <button @click="create" class="button button--create">
          <span class="icon-new-credit-btn-icon"></span>
          {{ $t('actions.new_credit') }}
        </button>

        <div class="table__dropdowns">
          <filter-by ref="filterByComponent" :watch="{ clients }" :name="name" :options="filterBy"></filter-by>
          <search-by :name="name" :options="searchBy"></search-by>
        </div>
      </div>

      <documents-table
        @apply-filters-to-show-hidden-results="applyFiltersToShowHiddenResults"
        :data="list"
        :context-menu-builder="contextMenuBuilder"
      >
        <template slot="head">
          <column width="20%">{{ $t('fields.credit_number') }}</column>
          <column width="20%">{{ $t('fields.client_name') }}</column>
          <column width="20%">{{ $t('fields.credit_date') }}</column>
          <column width="20%">{{ $t('fields.amount') }}</column>
          <column width="20%">{{ $t('fields.balance') }}</column>
        </template>
        <template slot="columns" slot-scope="{ row }">
          <column width="20%">
            <a href="#" @click.prevent="edit(row)">
              {{ row.creditNumber }}
            </a>
          </column>
          <column width="20%">
            <a href="#" @click.prevent="editDocument(row.client, 'client')">
              {{ row.client.name }}
            </a>
          </column>
          <column width="20%">
            <span>{{ row.creditDate | date }}</span>
          </column>
          <column width="20%">
            <span class="currency">{{ row.amount.currency | currencySymbol }}</span>
            <span class="currency currency--primary">{{ row.amount.amount | currency }}</span>
          </column>
          <column width="20%">
            <span class="currency">{{ row.balance.currency | currencySymbol }}</span>
            <span class="currency currency--primary">{{ row.balance.amount | currency }}</span>
          </column>
        </template>
      </documents-table>

      <table-footer
        :table-name="name"
        :calculator-options="[
          { text: $t('fields.amount'), value: 'amount', type: 'money' },
          { text: $t('fields.balance'), value: 'balance', type: 'money' }
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
      return 'credits'
    },

    searchBy() {
      return [
        SearchByText.extend({ key: 'client.name', name: 'client_name', placeholder: this.$t('search_by.client_name') }),
        SearchByDate.extend({ key: 'creditDate', name: 'credit_date', placeholder: this.$t('search_by.credit_date') }),
        { type: 'separator' },
        SearchByValue.extend({ key: 'amount.amount', name: 'credit_amount', placeholder: this.$t('search_by.amount') }),
        SearchByValue.extend({ key: 'balance.amount', name: 'balance', placeholder: this.$t('search_by.balance') })
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
          title: this.$t('actions.clone_credit')
        }))
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
        CurrenciesFilter.make(this.currencies),
        { type: 'separator' },
        ClientsFilter.make(this.clients)
      ]
    },

    clients() {
      const clients = this.$store.getters[`table/${this.name}/activeItems`]
        .filter((credit) => credit.client)
        .map((credit) => credit.client)

      return this.filterAndOrder(clients, {
        filterBy: 'uuid',
        orderBy: 'name'
      })
    },

    currencies() {
      const currencies = this.$store.getters[`table/${this.name}/activeItems`]
        .filter((credit) => credit.currency)
        .map((credit) => credit.currency)

      return this.filterAndOrder(currencies, {
        filterBy: 'code',
        orderBy: 'name'
      })
    }
  },

  methods: {
    create() {
      this.createDocument('credit')
    },

    edit(data) {
      this.editDocument(data, 'credit')
    }
  }
}
</script>