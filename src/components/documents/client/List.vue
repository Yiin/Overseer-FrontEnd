<template>
  <div>
    <template v-if="!state.items || !state.items.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--clients"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Here you can add customers<br>
          whom you will offer services to.
        </div>
        <button @click="create" class="button button--create">
          <span class="icon-new-client-btn-icon"></span>
          {{ $t('actions.new_client') }}
        </button>
      </div>
    </template>
    <template v-else>
      <breadcrumb :path="[ $t('common.clients') ]"></breadcrumb>

      <div class="table__heading">
        <button @click="create" class="button button--create">
          <span class="icon-new-client-btn-icon"></span>
          {{ $t('actions.new_client') }}
        </button>

        <div class="table__dropdowns">
          <filter-by ref="filterByComponent" :watch="{ 'countries': countries, 'currencies': currencies }" :name="name" :options="filterBy"></filter-by>
          <search-by :name="name" :options="searchBy"></search-by>
        </div>
      </div>

      <documents-table
        @apply-filters-to-show-hidden-results="applyFiltersToShowHiddenResults"
        :data="list"
        :context-menu-actions="contextMenuActions"
      >
        <template slot="head">
          <column width="17%">{{ $t('fields.client_name') }}</column>
          <column width="23%">{{ $t('fields.vat_number') }}</column>
          <column width="15%">{{ $t('fields.phone_number') }}</column>
          <column width="20%">{{ $t('fields.email') }}</column>
          <column width="11%">{{ $t('fields.date_created') }}</column>
          <column width="14%">{{ $t('fields.balance') }}</column>
        </template>
        <template slot="columns" slot-scope="props">
          <column width="17%">
            <a :href="`#${props.row.uuid}`" @click="edit(props.row)">{{ props.row.name }}</a>
          </column>
          <column width="23%">
            <span>{{ props.row.vat_number }}</span>
            <vat-info :vat="props.row.vat_number"></vat-info>
          </column>
          <column width="15%">
            <span>{{ props.row.phone }}</span>
          </column>
          <column width="20%">
            <span>{{ props.row.email }}</span>
          </column>
          <column width="11%">
            <span>{{ props.row.created_at | date }}</span>
          </column>
          <column width="14%">
            <span class="currency">{{ props.row.currency | currencySymbol }}</span>
            <span class="currency currency--primary">{{ props.row.balance | currency }}</span>
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
import VatInfo from '@/components/vat-checker/VatInfo.vue'

import {
  IsActiveFilter,
  IsArchivedFilter,
  IsDeletedFilter,
  VatVerifiedFilter,
  VatPendingFilter,
  VatInvalidFilter,
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
  Restore,
  Preview,
  EditDocument,
  NewInvoice,
  NewQuote,
  EnterPayment,
  EnterExpense,
  EnterCredit
} from '@/modules/table/cm-actions'

export default {
  mixins: [
    TableMixin
  ],

  components: {
    VatInfo
  },

  computed: {
    searchBy() {
      return [
        SearchByText.extend({ key: 'name', name: 'client_name', placeholder: this.$t('search_by.client_name') }),
        SearchByText.extend({ key: 'phone', name: 'contact_number', placeholder: this.$t('search_by.contact_number') }),
        { type: 'separator' },
        SearchByText.extend({ key: 'email', name: 'email', placeholder: this.$t('search_by.client_email') }),
        SearchByDate.extend({ key: 'created_at', name: 'date_created', placeholder: this.$t('search_by.date_created') }),
        SearchByValue.extend({ key: 'balance', name: 'balance', placeholder: this.$t('search_by.balance') })
      ]
    },

    contextMenuActions() {
      return [
        SELECTED_ROWS,
        Archive.isVisible(whenMoreThanOneRowIsSelected),
        Delete.isVisible(whenMoreThanOneRowIsSelected),
        Restore.isVisible(whenMoreThanOneRowIsSelected),
        __SEPARATOR__.isVisible(whenMoreThanOneRowIsSelected),
        TableName.extend({
          title: 'common.client_table'
        }),
        CreateDocument.extend({
          documentType: 'client',
          title: 'actions.new_client',
          icon: 'icon-new-client-btn-icon'
        }),
        SELECTED_DOCUMENT.extend({ documentType: 'client' }),
        Preview,
        EditDocument.extend({ title: 'actions.edit_client' }),
        __SEPARATOR__.isVisible(whenSpecificRowIsSelected),
        NewInvoice,
        NewQuote,
        __SEPARATOR__.isVisible(whenSpecificRowIsSelected),
        EnterPayment,
        EnterExpense,
        EnterCredit,
        __SEPARATOR__.isVisible(whenSpecificRowIsSelected),
        Archive,
        Delete,
        Restore
      ]
    },

    name() {
      return 'clients'
    },

    filterBy() {
      return [
        IsActiveFilter,
        IsArchivedFilter,
        IsDeletedFilter,
        { type: 'separator' },
        VatVerifiedFilter,
        VatPendingFilter,
        VatInvalidFilter,
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
    applyFiltersToShowHiddenResults() {
      this.$refs.filterByComponent.$children[0].$children[0].open()

      setTimeout(() => {
        const check = (i) => {
          if (i >= 3) {
            return
          }
          const option = this.$refs.filterByComponent.$refs.checkboxOption[i]

          if (option) {
            if (option.isChecked) {
              check(i + 1)
            } else {
              this.$nextTick(() => option.check())
              setTimeout(() => check(i + 1), 370)
            }
          }
        }
        setTimeout(() => check(0), 200)
      }, 100)
    },

    create() {
      this.$store.dispatch('form/client/OPEN_CREATE_FORM')
    },

    edit(data) {
      this.$store.dispatch('form/client/OPEN_EDIT_FORM', data)
    }
  }
}
</script>