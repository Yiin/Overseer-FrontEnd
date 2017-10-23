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
        :context-menu-actions="contextMenuActions"
      >
        <template slot="head">
          <column width="23%">{{ $t('fields.vendor_name') }}</column>
          <column width="25%">{{ $t('fields.phone_number') }}</column>
          <column width="25%">{{ $t('fields.email') }}</column>
          <column width="15%">{{ $t('fields.expenses') }}</column>
          <column width="12%">{{ $t('fields.date_created') }}</column>
        </template>
        <template slot="columns" slot-scope="props">
          <column width="23%">
            <a :href="`#${props.row.key}`" @click="edit(props.row)">{{ props.row.company_name }}</a>
          </column>
          <column width="25%">
            <span>{{ props.row.phone }}</span>
          </column>
          <column width="25%">
            <span>{{ props.row.email }}</span>
          </column>
          <column width="15%">
            <span class="currency">{{ props.row.currency | currencySymbol }}</span>
            <span class="currency currency--primary">{{ props.row.expenses | currency }}</span>
          </column>
          <column width="12%">
            <span>{{ props.row.created_at | date }}</span>
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
  CountriesFilter,
  CurrenciesFilter,

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
  Preview,
  EditDocument,
  EnterExpense
} from '@/modules/table/cm-actions'

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
        SearchByText.extend({ key: 'company_name', name: 'vendor_name', placeholder: this.$t('search_by.vendor_name') }),
        SearchByText.extend({ key: 'phone', name: 'contact_number', placeholder: this.$t('search_by.contact_number') }),
        SearchByText.extend({ key: 'email', name: 'email', placeholder: this.$t('search_by.vendor_email') }),
        { type: 'separator' },
        SearchByDate.extend({ key: 'created_at', name: 'date_created', placeholder: this.$t('search_by.date_created') }),
        SearchByValue.extend({ key: 'expenses', name: 'expenses', placeholder: this.$t('search_by.expenses_amount') })
      ]
    },

    contextMenuActions() {
      return [
        SELECTED_ROWS,
        Archive.isVisible(whenMoreThanOneRowIsSelected),
        Delete.isVisible(whenMoreThanOneRowIsSelected),
        __SEPARATOR__.isVisible(whenMoreThanOneRowIsSelected),
        TableName.extend({
          title: 'common.vendor_table'
        }),
        CreateDocument.extend({
          documentType: 'vendor',
          title: 'actions.new_vendor',
          icon: 'icon-new-vendor-btn-icon'
        }),
        SELECTED_DOCUMENT.extend({ documentType: 'vendor' }),
        Preview,
        EditDocument.extend({ title: 'actions.edit_vendor' }),
        __SEPARATOR__.isVisible(whenSpecificRowIsSelected),
        EnterExpense,
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
        CountriesFilter.make(this.countries),
        CurrenciesFilter.make(this.currencies)
      ]
    },

    countries() {
      const countries = this.$store.getters[`table/${this.name}/filteredItems`]
        .filter((client) => client.country)
        .map((client) => client.country)

      return this.filterAndOrder(countries, {
        filterBy: 'id',
        orderBy: 'name'
      })
    },

    currencies() {
      const currencies = this.$store.getters[`table/${this.name}/filteredItems`]
        .filter((client) => client.currency)
        .map((client) => client.currency)

      return this.filterAndOrder(currencies, {
        filterBy: 'id',
        orderBy: 'name'
      })
    }
  },

  methods: {
    create() {
      this.$store.dispatch('form/vendor/OPEN_CREATE_FORM')
    },

    edit(data) {
      this.$store.dispatch('form/vendor/OPEN_EDIT_FORM', data)
    }
  }
}
</script>