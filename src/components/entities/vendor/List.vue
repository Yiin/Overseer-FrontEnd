<template>
  <div>
    <breadcrumb :path="[ $t('common.vendors') ]"></breadcrumb>

    <div class="table__heading">
      <a @click="create" class="button button__create">
        <span class="icon-new-vendor-btn-icon"></span>
        {{ $t('actions.new_vendor') }}
      </a>

      <div class="table__dropdowns">
        <filter-by :options="filterBy"></filter-by>
        <search-by :options="searchBy"></search-by>
      </div>
    </div>

    <entities-table :data="list">
      <template slot="head">
        <column width="15%">{{ $t('fields.vendor_name') }}</column>
        <column width="15%">{{ $t('fields.city') }}</column>
        <column width="12%">{{ $t('fields.phone_number') }}</column>
        <column width="30%">{{ $t('fields.email') }}</column>
        <column width="12%">{{ $t('fields.date_created') }}</column>
        <column width="13%">{{ $t('fields.expenses') }}</column>
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
  const name = 'vendors'

  export default {
    data() {
      return {
        filterBy: [
          { name: 'active', placeholder: this.$t('filters.active') },
          { name: 'archived', placeholder: this.$t('filters.archived') },
          { name: 'deleted', placeholder: this.$t('filters.deleted') },
          { type: 'separator' },
          { type: 'list',
            placeholder: this.$t('filters.countries'),
            keyName: 'name',
            list: [
              { name: 'Country A' },
              { name: 'Country B' },
              { name: 'Country C' },
              { name: 'Country D' },
              { name: 'Country E' },
              { name: 'Country F' }
            ]
          },
          { type: 'list',
            placeholder: this.$t('filters.currencies'),
            keyName: 'name',
            list: [
              { name: 'Currency A' },
              { name: 'Currency B' },
              { name: 'Currency C' },
              { name: 'Currency D' },
              { name: 'Currency E' },
              { name: 'Currency F' }
            ]
          }
        ],

        searchBy: [
          { type: 'text', name: 'vendor_name', placeholder: this.$t('search_by.vendor_name') },
          { type: 'numeric', name: 'contact_number', placeholder: this.$t('search_by.contact_number') },
          { type: 'text', name: 'email', placeholder: this.$t('search_by.vendor_email') },
          { type: 'separator' },
          { type: 'numeric', name: 'date_created', placeholder: this.$t('search_by.date_created') },
          { type: 'numeric', name: 'expenses', placeholder: this.$t('search_by.expenses_amount') }
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
          tableName: 'vendors',
          title: this.$t('actions.new_vendor'),
          component: 'edit-vendor',
          data: {
            vendor: {}
          }
        })
      },

      edit(data) {
        this.$store.dispatch('OPEN_MODAL', {
          tableName: 'vendors',
          title: this.$t('actions.edit_vendor'),
          component: 'edit-vendor',
          data: {
            vendor: Object.assign({}, data)
          }
        })
      }
    }
  }
</script>

<style lang="scss">

</style>