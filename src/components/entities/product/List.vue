<template>
  <div>
    <breadcrumb :path="[ $t('common.products') ]"></breadcrumb>

    <div class="table__heading">
      <a @click="create" class="button button__create">
        <span class="icon-new-product-btn-icon"></span>
        {{ $t('actions.new_product') }}
      </a>

      <div class="table__dropdowns">
        <filter-by :options="filterBy"></filter-by>
        <search-by :options="searchBy"></search-by>
      </div>
    </div>

    <entities-table :data="list">
      <template slot="head">
        <column width="20%">{{ $t('fields.product_name') }}</column>
        <column width="46%">{{ $t('fields.description') }}</column>
        <column width="16%">{{ $t('fields.price') }}</column>
        <column width="14%">{{ $t('fields.stock') }}</column>
      </template>
      <template slot="columns" scope="props">
        <column width="20%">
          <a :href="`#${props.row.uuid}`" @click="edit(props.row)">{{ props.row.name }}</a>
        </column>
        <column width="46%">{{ props.row.description }}</column>
        <column width="16%">
          <span class="currency">{{ props.row.currency | currencySymbol }}</span>
          <span class="currency currency--primary">{{ props.row.price | currency }}</span>
        </column>
        <column width="14%">{{ props.row.qty }}</column>
      </template>
      <template slot="table-controls-left"></template>
    </entities-table>

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
        { name: 'in_stock', placeholder: this.$t('filters.in_stock') },
        { name: 'out_of_stock', placeholder: this.$t('filters.out_of_stock') },
        { name: 'services', placeholder: this.$t('filters.services') },
        { type: 'separator' },
        { type: 'list',
          placeholder: this.$t('filters.clients'),
          keyName: 'value',
          list: [
            { name: 'Client A', value: 'A' },
            { name: 'Client B', value: 'B' },
            { name: 'Client C', value: 'C' }
          ]
        }
      ],

      searchBy: [
        { type: 'text', name: 'product_name', placeholder: this.$t('search_by.product_name') },
        { type: 'numeric', name: 'product_price', placeholder: this.$t('search_by.product_price') },
        { type: 'text', name: 'description', placeholder: this.$t('search_by.words_in_description') },
        { type: 'numeric', name: 'stock_amount', placeholder: this.$t('search_by.stock_amount') }
      ],

      clients: [
        { name: 'Client A', value: 'A' },
        { name: 'Client B', value: 'B' },
        { name: 'Client C', value: 'C' }
      ]
    }
  },

  computed: {
    name() {
      return 'products'
    }
  },

  methods: {
    create() {
      this.$store.dispatch('form/product/OPEN_CREATE_FORM')
    },

    edit(data) {
      this.$store.dispatch('form/product/OPEN_EDIT_FORM', data)
    }
  }
}
</script>

<style lang="scss">

</style>