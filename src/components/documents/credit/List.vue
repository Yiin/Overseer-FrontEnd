<template>
  <div>
    <template v-if="!state.items || !state.items.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--credits"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Here you can enter and manage credit notes;<br>
          Such as bank cheques and refunds.
        </div>
        <a @click="create" class="button button--create">
          <span class="icon-new-credit-btn-icon"></span>
          {{ $t('actions.new_credit') }}
        </a>
      </div>
    </template>
    <template v-else>
      <breadcrumb :path="[ $t('common.credits') ]"></breadcrumb>

      <div class="table__heading">
        <a @click="create" class="button button--create">
          <span class="icon-new-credit-btn-icon"></span>
          {{ $t('actions.new_credit') }}
        </a>

        <div class="table__dropdowns">
          <filter-by :watch="{ clients }" :name="name" :options="filterBy"></filter-by>
          <search-by :name="name" :options="searchBy"></search-by>
        </div>
      </div>

      <documents-table :data="list" :context-menu-actions="contextMenuActions">
        <template slot="head">
          <column width="30%">{{ $t('fields.client_name') }}</column>
          <column width="30%">{{ $t('fields.credit_date') }}</column>
          <column width="20%">{{ $t('fields.amount') }}</column>
          <column width="20%">{{ $t('fields.balance') }}</column>
        </template>
        <template slot="columns" scope="props">
          <column width="30%">
            <a :href="`#${props.row.key}`" @click="edit(props.row)">{{ props.row.client.name }}</a>
          </column>
          <column width="30%">
            <span>{{ props.row.credit_date | date }}</span>
          </column>
          <column width="20%">
            <span class="currency">{{ props.row.client.currency | currencySymbol }}</span>
            <span class="currency currency--primary">{{ props.row.amount | currency }}</span>
          </column>
          <column width="20%">
            <span class="currency">{{ props.row.client.currency | currencySymbol }}</span>
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
import {
  IsActiveFilter,
  IsArchivedFilter,
  IsDeletedFilter,
  ClientsFilter,

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
  ApplyCredit
} from '@/modules/table/cm-actions'

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
        SearchByDate.extend({ key: 'credit_date', name: 'credit_date', placeholder: this.$t('search_by.credit_date') }),
        { type: 'separator' },
        SearchByValue.extend({ key: 'amount', name: 'credit_amount', placeholder: this.$t('search_by.amount') }),
        SearchByValue.extend({ key: 'balance', name: 'balance', placeholder: this.$t('search_by.balance') })
      ]
    },

    contextMenuActions() {
      return [
        SELECTED_ROWS,
        Archive.isVisible(whenMoreThanOneRowIsSelected),
        Delete.isVisible(whenMoreThanOneRowIsSelected),
        __SEPARATOR__.isVisible(whenMoreThanOneRowIsSelected),
        TableName.extend({
          title: 'common.credit_table'
        }),
        CreateDocument.extend({
          documentType: 'credit',
          title: 'actions.new_credit',
          icon: 'icon-new-credit-btn-icon'
        }),
        SELECTED_DOCUMENT.extend({ documentType: 'credit' }),
        Preview.extend({ title: 'actions.preview' }),
        EditDocument.extend({ title: 'actions.edit_credit' }),
        ApplyCredit,
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
        ClientsFilter.make(this.clients)
      ]
    },

    clients() {
      const clients = this.$store.getters[`table/${this.name}/filteredItems`]
        .filter((credit) => credit.client)
        .map((credit) => credit.client)

      return this.filterAndOrder(clients, {
        filterBy: 'uuid',
        orderBy: 'name'
      })
    }
  },

  methods: {
    create() {
      this.$store.dispatch('form/credit/OPEN_CREATE_FORM')
    },

    edit(data) {
      this.$store.dispatch('form/credit/OPEN_EDIT_FORM', data)
    }
  }
}
</script>