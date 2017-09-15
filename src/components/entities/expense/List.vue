<template>
  <div>
    <breadcrumb :path="[ $t('common.expenses') ]"></breadcrumb>

    <div class="table__heading">
      <a @click="create" class="button button__create">
        <span class="icon-new-expense-btn-icon"></span>
        {{ $t('actions.new_expense') }}
      </a>

      <div class="table__dropdowns">
        <filter-by :options="filterBy"></filter-by>
        <search-by :options="searchBy"></search-by>
      </div>
    </div>

    <entities-table :data="list">
      <template slot="head">
        <column width="14%">{{ $t('fields.vendor_name') }}</column>
        <column width="20%">{{ $t('fields.client_name') }}</column>
        <column width="10%">{{ $t('fields.category') }}</column>
        <column width="19%">{{ $t('fields.public_notes') }}</column>
        <column width="11%">{{ $t('fields.expense_date') }}</column>
        <column width="10%">{{ $t('fields.amount') }}</column>
        <column width="12%">{{ $t('fields.status') }}</column>
      </template>
      <template slot="columns" scope="props">
        <column width="14%">
          <a :href="`#${props.row.uuid}`" @click="edit(props.row)">{{ props.row.vendor.name }}</a>
        </column>
        <column width="20%">
          <a :href="`#${props.row.uuid}`" @click="edit(props.row)">{{ props.row.client.name }}</a>
        </column>
        <column width="10%">
          <a :href="`#${props.row.uuid}`" @click="edit(props.row)">{{ props.row.category.name }}</a>
        </column>
        <column width="19%"></column>
        <column width="11%">{{ props.row.date }}</column>
        <column width="10%">
          <span class="currency">{{ props.row.currency | currencySymbol }}</span>
          <span class="currency currency--primary">{{ props.row.amount | currency }}</span>
        </column>
        <column width="12%">{{ props.row.status }}</column>
      </template>
      <template slot="table-controls-left"></template>
    </entities-table>

<!--
    <calculator :rows="">
      <calculator-option :option-key="price">{{ $t('fields.price') }}</calculator-option>
    </calculator>
-->
    <table-footer :pagination="pagination"></table-footer>
  </div>
</template>

<script>
import TableMixin from '@/mixins/TableMixin'

export default {
  mixins: [
    TableMixin
  ],

  data() {
    return {
      filterBy: [
        { name: 'active', placeholder: this.$t('filters.active') },
        { name: 'archived', placeholder: this.$t('filters.archived') },
        { name: 'deleted', placeholder: this.$t('filters.deleted') },
        { type: 'separator' },
        { type: 'list',
          placeholder: this.$t('filters.status'),
          keyName: 'name',
          list: [
            { name: this.$t('filters.invoiced') },
            { name: this.$t('filters.pending') },
            { name: this.$t('filters.paid') },
            { name: this.$t('filters.logged') }
          ]
        },
        { type: 'separator' },
        { type: 'list',
          placeholder: this.$t('filters.currency'),
          keyName: 'name',
          list: [
            { name: 'Currency A' },
            { name: 'Currency B' },
            { name: 'Currency C' },
            { name: 'Currency D' },
            { name: 'Currency E' },
            { name: 'Currency F' }
          ]
        },
        { type: 'list',
          placeholder: this.$t('filters.clients'),
          keyName: 'name',
          list: [
            { name: 'Client A' },
            { name: 'Client B' },
            { name: 'Client C' },
            { name: 'Client D' },
            { name: 'Client E' },
            { name: 'Client F' }
          ]
        }
      ],

      searchBy: [
        { type: 'text', name: 'invoice_number', placeholder: this.$t('search_by.invoice_number') },
        { type: 'numeric', name: 'expense_date', placeholder: this.$t('search_by.expense_date') },
        { type: 'numeric', name: 'expense_amount', placeholder: this.$t('search_by.expense_amount') },
        { type: 'separator' },
        { type: 'text', name: 'client_name', placeholder: this.$t('search_by.client_name') }
      ]
    }
  },

  computed: {
    name() {
      return 'expenses'
    }
  },

  methods: {
    create() {
      this.$store.dispatch('form/expense/OPEN_CREATE_FORM')
    },

    edit(data) {
      this.$store.dispatch('form/expense/OPEN_EDIT_FORM', data)
    }
  }
}
</script>