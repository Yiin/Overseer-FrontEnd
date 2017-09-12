<template>
  <div>
    <breadcrumb :path="[ $t('common.quotes') ]"></breadcrumb>

    <div class="table__heading">
      <a @click="create" class="button button__create">
        <span class="icon-new-quote-btn-icon"></span>
        {{ $t('actions.new_quote') }}
      </a>

      <div class="table__dropdowns">
        <filter-by :options="filterBy"></filter-by>
        <search-by :options="searchBy"></search-by>
      </div>
    </div>

    <entities-table :data="list">
      <template slot="head">
        <column width="22%">{{ $t('fields.quote_number') }}</column>
        <column width="25%">{{ $t('fields.client_name') }}</column>
        <column width="11%">{{ $t('fields.date') }}</column>
        <column width="11%">{{ $t('fields.valid_until') }}</column>
        <column width="15%">{{ $t('fields.amount') }}</column>
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

    <table-footer :pagination="pagination"></table-footer>
  </div>
</template>

<script>
const name = 'quotes'

export default {
  data() {
    return {
      filterBy: [
        { name: 'active', placeholder: this.$t('filters.active') },
        { name: 'archived', placeholder: this.$t('filters.archived') },
        { name: 'deleted', placeholder: this.$t('filters.deleted') },
        { type: 'separator' },
        { name: 'draft', placeholder: this.$t('filters.draft') },
        { name: 'sent', placeholder: this.$t('filters.sent') },
        { name: 'viewed', placeholder: this.$t('filters.viewed') },
        { name: 'approved', placeholder: this.$t('filters.approved') },
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
        { type: 'text', name: 'quote_number', placeholder: this.$t('search_by.quote_number') },
        { type: 'numeric', name: 'quote_date', placeholder: this.$t('search_by.quote_date') },
        { type: 'numeric', name: 'valid_until_date', placeholder: this.$t('search_by.valid_until_date') },
        { type: 'numeric', name: 'amount', placeholder: this.$t('search_by.amount') },
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
        tableName: 'quotes',
        title: this.$t('actions.new_quote'),
        component: 'edit-quote',
        data: {
          quote: {}
        }
      })
    },

    edit(data) {
      this.$store.dispatch('OPEN_MODAL', {
        tableName: 'quotes',
        title: this.$t('actions.edit_quote'),
        component: 'edit-quote',
        data: {
          quote: Object.assign({}, data)
        }
      })
    }
  }
}
</script>