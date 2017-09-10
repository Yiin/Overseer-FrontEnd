<template>
  <div>
    <breadcrumb :path="[ $t('common.credits') ]"></breadcrumb>

    <div class="table__heading">
      <a @click="create" class="button button__create">
        <span class="icon-new-credit-btn-icon"></span>
        {{ $t('actions.new_credit') }}
      </a>

      <div class="table__dropdowns">
        <filter-by :options="filterBy"></filter-by>
        <search-by :options="searchBy"></search-by>
      </div>
    </div>

    <entities-table :data="list">
      <template slot="head">
        <column width="21%">{{ $t('fields.client_name') }}</column>
        <column width="19%">{{ $t('fields.public_notes') }}</column>
        <column width="19%">{{ $t('fields.private_notes') }}</column>
        <column width="11%">{{ $t('fields.credit_date') }}</column>
        <column width="13%">{{ $t('fields.amount') }}</column>
        <column width="13%">{{ $t('fields.balance') }}</column>
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
const name = 'credits'

export default {
  data() {
    return {
      filterBy: [
        { name: 'active', placeholder: this.$t('filters.active') },
        { name: 'archived', placeholder: this.$t('filters.archived') },
        { name: 'deleted', placeholder: this.$t('filters.deleted') },
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
        }
      ],

      searchBy: [
        { type: 'text', name: 'client_name', placeholder: this.$t('search_by.client_name') },
        { type: 'numeric', name: 'credit_date', placeholder: this.$t('search_by.credit_date') },
        { type: 'separator' },
        { type: 'numeric', name: 'credit_amount', placeholder: this.$t('search_by.amount') },
        { type: 'numeric', name: 'invoice_number', placeholder: this.$t('search_by.balance') }
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
        tableName: 'credits',
        title: this.$t('actions.new_credit'),
        component: 'edit-credit',
        data: {
          credit: {}
        }
      })
    },

    edit(data) {
      this.$store.dispatch('OPEN_MODAL', {
        tableName: 'credits',
        title: this.$t('actions.edit_credit'),
        component: 'edit-credit',
        data: {
          credit: Object.assign({}, data)
        }
      })
    }
  }
}
</script>