<template>
  <div>
    <breadcrumb :path="[ $t('common.payments') ]"></breadcrumb>

    <div class="table__heading">
      <a @click="create" class="button button__create">
        <span class="icon-new-payment-btn-icon"></span>
        {{ $t('actions.new_payment') }}
      </a>

      <div class="table__dropdowns">
        <filter-by :options="filterBy"></filter-by>
        <search-by :options="searchBy"></search-by>
      </div>
    </div>

    <entities-table :data="list">
      <template slot="head">
        <column width="14%">{{ $t('fields.invoice') }}</column>
        <column width="20%">{{ $t('fields.client_name') }}</column>
        <column width="20%">{{ $t('fields.transaction_reference') }}</column>
        <column width="9%">{{ $t('fields.methods') }}</column>
        <column width="10%">{{ $t('fields.amount') }}</column>
        <column width="11%">{{ $t('fields.date_created') }}</column>
        <column width="12%">{{ $t('fields.status') }}</column>
      </template>
      <template slot="columns" scope="props">
        <column>
          <a :href="`#${props.row.key}`" @click="edit(props.row)">{{ props.row.name }}</a>
        </column>
        <column>{{ props.row.description }}</column>
        <column>
          <span class="currency">{{ props.row.currency | currencySymbol }}</span>
          <span class="currency currency--primary">{{ props.row.price | currency }}</span>
        </column>
        <column>{{ props.row.qty }}</column>
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
const name = 'payments'

export default {
  data() {
    return {
      filterBy: [
        { name: 'active', placeholder: this.$t('filters.active') },
        { name: 'archived', placeholder: this.$t('filters.archived') },
        { name: 'deleted', placeholder: this.$t('filters.deleted') },
        { name: 'completed', placeholder: this.$t('filters.completed') },
        { name: 'refunded', placeholder: this.$t('filters.refunded') },
        { type: 'separator' },
        { type: 'list',
          placeholder: this.$t('filters.method'),
          keyName: 'name',
          list: [
            { name: 'Bank Transfer' },
            { name: 'Cash' },
            { name: 'Check' },
            { name: 'Swish' }
          ]
        },
        { type: 'separator' },
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
        },
        { type: 'list',
          placeholder: this.$t('filters.products'),
          keyName: 'name',
          list: [
            { name: 'Product A' },
            { name: 'Product B' },
            { name: 'Product C' },
            { name: 'Product D' },
            { name: 'Product E' },
            { name: 'Product F' }
          ]
        }
      ],

      searchBy: [
        { type: 'text', name: 'invoice_number', placeholder: this.$t('search_by.invoice_number') },
        { type: 'numeric', name: 'payment_date', placeholder: this.$t('search_by.payment_date') },
        { type: 'numeric', name: 'payment_amount', placeholder: this.$t('search_by.payment_amount') },
        { type: 'separator' },
        { type: 'text', name: 'client_name', placeholder: this.$t('search_by.client_name') },
        { type: 'text', name: 'product_name', placeholder: this.$t('search_by.product_name') }
      ]
    }
  },

  watch: {
    // filterBy: function (val) {
      //
    // }
  },

  computed: {
    table() {
      return this.$store.getters[name]
    },

    list() {
      return {
        name,
        pageList: this.table.list,
        selection: this.table.selection
      }
    },

    pagination() {
      return {
        page: this.table.page,
        pages: this.table.pages,
        amount: this.table.amount,
        total: this.table.total
      }
    }
  },

  methods: {
    create() {
      this.$store.dispatch('CREATE_MODAL', {
        tableName: 'payments',
        title: this.$t('actions.new_payment'),
        component: 'edit-payment',
        data: {
          payment: {}
        }
      })
    },

    edit(data) {
      this.$store.dispatch('OPEN_MODAL', {
        tableName: 'payments',
        title: this.$t('actions.edit_payment'),
        component: 'edit-payment',
        data: {
          payment: Object.assign({}, data)
        }
      })
    }
  }
}
</script>