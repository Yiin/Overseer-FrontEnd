<template>
  <div>
    <breadcrumb :path="[ $t('common.recurring_invoices') ]"></breadcrumb>

    <div class="table__heading">
      <a @click="create" class="button button__create">
        <span class="icon-new-recurring-btn-icon"></span>
        {{ $t('actions.new_recurring_invoice') }}
      </a>

      <div class="table__dropdowns">
        <filter-by :options="filterBy"></filter-by>
        <search-by :options="searchBy"></search-by>
      </div>
    </div>

    <entities-table>
      <template slot="head">
        <column width="14%">{{ $t('fields.frequency') }}</column>
        <column width="19%">{{ $t('fields.client_name') }}</column>
        <column width="11%">{{ $t('fields.start_date') }}</column>
        <column width="11%">{{ $t('fields.last_sent') }}</column>
        <column width="15%">{{ $t('fields.end_date') }}</column>
        <column width="14%">{{ $t('fields.amount') }}</column>
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
  const name = 'recurring_invoices'

  export default {
    data() {
      return {
        filterBy: [
          { name: 'active', placeholder: this.$t('filters.active') },
          { name: 'archived', placeholder: this.$t('filters.archived') },
          { name: 'deleted', placeholder: this.$t('filters.deleted') },
          { type: 'separator' },
          { name: 'draft', placeholder: this.$t('filters.draft') },
          { name: 'pending', placeholder: this.$t('filters.pending') },
          { name: 'overdue', placeholder: this.$t('filters.overdue') },
          { type: 'separator' },
          { type: 'list',
            placeholder: this.$t('filters.frequency'),
            keyName: 'name',
            list: [
              { name: 'Weekly' },
              { name: 'Monthly' },
              { name: 'Annualy' }
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
          { type: 'numeric', name: 'start_date', placeholder: this.$t('search_by.start_date') },
          { type: 'numeric', name: 'last_sent', placeholder: this.$t('search_by.last_sent_date') },
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
          tableName: 'recurring-invoices',
          title: this.$t('actions.new_recurring_invoice'),
          component: 'edit-recurring-invoice',
          data: {
            'recurring-invoice': {}
          }
        })
      },

      edit(data) {
        this.$store.dispatch('OPEN_MODAL', {
          tableName: 'recurring-invoices',
          title: this.$t('actions.edit_recurring_invoice'),
          component: 'edit-recurring-invoice',
          data: {
            'recurring-invoice': Object.assign({}, data)
          }
        })
      }
    }
  }
</script>