<template>
  <div>
    <template v-if="!availableItems.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--vendors"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Here you can add vendors, <br>
          whom you will purchase from.
        </div>
        <button @click="create" class="button button--create">
          <span class="icon-new-vendor-btn-icon"></span>
          {{ $t('actions.new_vendor') }}
        </button>
      </div>
    </template>
    <template v-else>
      <breadcrumb :path="[ $t('common.vendors') ]"></breadcrumb>

      <div class="table__heading">
        <button @click="create" class="button button--create">
          <span class="icon-new-vendor-btn-icon"></span>
          {{ $t('actions.new_vendor') }}
        </button>

        <div class="table__dropdowns">
          <filter-by ref="filterByComponent" :watch="{ countries, currencies }" :name="name" :options="filterBy"></filter-by>
          <search-by :name="name" :options="searchBy"></search-by>
        </div>
      </div>

      <documents-table
        @apply-filters-to-show-hidden-results="applyFiltersToShowHiddenResults"
        :data="list"
        :context-menu-builder="contextMenuBuilder"
      >
        <template slot="head">
          <column width="23%">{{ $t('fields.vendor_name') }}</column>
          <column width="25%">{{ $t('fields.phone_number') }}</column>
          <column width="25%">{{ $t('fields.email') }}</column>
          <column width="15%">{{ $t('fields.expenses') }}</column>
          <column width="12%">{{ $t('fields.date_created') }}</column>
        </template>
        <template slot="columns" slot-scope="{ row }">
          <column width="23%">
            <a href="#" @click.prevent="edit(row)">{{ row.name }}</a>
          </column>
          <column width="25%">
            <span>{{ row.getPrimaryPhoneNumber() }}</span>
          </column>
          <column width="25%">
            <span>{{ row.email }}</span>
          </column>
          <column width="15%">
            <span class="currency">{{ row.currency | currencySymbol }}</span>
            <span class="currency currency--primary">{{ row.expenses.amount | currency }}</span>
          </column>
          <column width="12%">
            <span>{{ row.createdAt | date }}</span>
          </column>
        </template>
      </documents-table>

      <table-footer
        :table-name="name"
        :calculator-options="[
          { text: $t('fields.expenses'), value: 'expenses', type: 'money' }
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
  CountriesFilter,
  CurrenciesFilter,

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
      return 'vendors'
    },

    searchBy() {
      return [
        SearchByText.extend({ key: 'name', name: 'vendor_name', placeholder: this.$t('search_by.vendor_name') }),
        SearchByText.extend({ key: 'phone', name: 'contact_number', placeholder: this.$t('search_by.contact_number') }),
        SearchByText.extend({ key: 'email', name: 'email', placeholder: this.$t('search_by.vendor_email') }),
        { type: 'separator' },
        SearchByDate.extend({ key: 'createdAt', name: 'date_created', placeholder: this.$t('search_by.date_created') }),
        SearchByValue.extend({ key: 'expenses.amount', name: 'expenses', placeholder: this.$t('search_by.expenses_amount') })
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
          title: this.$t('actions.clone_vendor')
        }))
        .addItem(TableCmItems.HISTORY_LIST)
        .addSeparator()
        .addItem(TableCmItems.ENTER_EXPENSE)
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
        CountriesFilter.make(this.countries),
        CurrenciesFilter.make(this.currencies)
      ]
    },

    countries() {
      const countries = this.$store.getters[`table/${this.name}/activeItems`]
        .filter((vendor) => vendor.address.country)
        .map((vendor) => vendor.address.country)

      return this.filterAndOrder(countries, {
        filterBy: 'id',
        orderBy: 'name'
      })
    },

    currencies() {
      const currencies = this.$store.getters[`table/${this.name}/activeItems`]
        .filter((vendor) => vendor.currency)
        .map((vendor) => vendor.currency)

      return this.filterAndOrder(currencies, {
        filterBy: 'code',
        orderBy: 'name'
      })
    }
  },

  methods: {
    create() {
      this.createDocument('vendor')
    },

    edit(data) {
      this.editDocument(data, 'vendor')
    }
  }
}
</script>