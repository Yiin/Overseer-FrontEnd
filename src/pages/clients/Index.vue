<template>
  <div>
    <template v-if="!availableItems.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--clients"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Here you can add customers<br>
          whom you will offer services to.
        </div>
        <button v-if="canCreateClient" @click="create" class="button button--create">
          <span class="icon-new-client-btn-icon"></span>
          {{ $t('actions.new_client') }}
        </button>
      </div>
    </template>
    <template v-else>
      <div class="table__heading">
        <button v-if="canCreateClient" @click="create" class="button button--create">
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
        :context-menu-builder="contextMenuBuilder"
      >
        <template slot="head">
          <column width="17%">{{ $t('fields.client_name') }}</column>
          <column width="23%">{{ $t('fields.vat_number') }}</column>
          <column width="21%">{{ $t('fields.phone_number') }}</column>
          <column width="24%">{{ $t('fields.email') }}</column>
          <column width="15%">{{ $t('fields.balance') }}</column>
        </template>
        <template slot="columns" slot-scope="{ row }">
          <column width="17%">
            <a href="#" @click.prevent="edit(row)">
              {{ row.name }}
            </a>
          </column>
          <column width="23%">
            <span>{{ row.vat.vatNumber }}</span>
            <vat-info :vat="row.vat"></vat-info>
          </column>
          <column width="21%">
            <span>{{ row.getPrimaryPhoneNumber() }}</span>
          </column>
          <column width="24%">
            <span>{{ row.email }}</span>
          </column>
          <column width="15%">
            <span class="currency">{{ row.balance.currency | currencySymbol }}</span>
            <span class="currency currency--primary">{{ row.balance.amount | currency }}</span>
          </column>
        </template>
      </documents-table>

      <table-footer
        :table-name="name"
        :calculator-options="[
          { text: $t('fields.balance'), value: 'balance', type: 'money' }
        ]"
      ></table-footer>
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

import TableCmItems from '@/modules/table/contextmenu/items'

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
        SearchByDate.extend({ key: 'createdAt', name: 'date_created', placeholder: this.$t('search_by.date_created') }),
        SearchByValue.extend({ key: 'balance', name: 'balance', placeholder: this.$t('search_by.balance') })
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
          title: this.$t('actions.clone_client')
        }))
        // .addItem(TableCmItems.ASSIGN_USER)
        .addItem(TableCmItems.HISTORY_LIST)
        .addSeparator({
          filter(builder) {
            return !builder.selectedMoreThanOneRow()
          }
        })
        .addItem(TableCmItems.ARCHIVE)
        .addItem(TableCmItems.UNARCHIVE)
        .addItem(TableCmItems.DELETE)
        .addItem(TableCmItems.RECOVER)
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
      const countries = this.$store.getters[`table/${this.name}/activeItems`]
        .filter((client) => client.address.country)
        .map((client) => client.address.country)

      return this.filterAndOrder(countries, {
        filterBy: 'id',
        orderBy: 'name'
      })
    },

    currencies() {
      const currencies = this.$store.getters[`table/${this.name}/activeItems`]
        .filter((client) => client.currency)
        .map((client) => client.currency)

      return this.filterAndOrder(currencies, {
        filterBy: 'code',
        orderBy: 'name'
      })
    }
  },

  methods: {
    create() {
      this.createDocument('client')
    },

    edit(data) {
      this.editDocument(data, 'client')
    }
  }
}
</script>