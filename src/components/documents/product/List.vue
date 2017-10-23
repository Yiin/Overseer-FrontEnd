<template>
  <div>
    <template v-if="!availableItems.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--products"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Here you can add products.<br>
          Both physical stock and services.
        </div>
        <button @click="create" class="button button--create">
          <span class="icon-new-product-btn-icon"></span>
          {{ $t('actions.new_product') }}
        </button>
      </div>
    </template>
    <template v-else>
      <breadcrumb :path="[ $t('common.products') ]"></breadcrumb>

      <div class="table__heading">
        <button @click="create" class="button button--create">
          <span class="icon-new-product-btn-icon"></span>
          {{ $t('actions.new_product') }}
        </button>

        <div class="table__dropdowns">
          <filter-by ref="filterByComponent" :name="name" :options="filterBy"></filter-by>
          <search-by :name="name" :options="searchBy"></search-by>
        </div>
      </div>

      <documents-table
        @apply-filters-to-show-hidden-results="applyFiltersToShowHiddenResults"
        :data="list"
        :context-menu-actions="contextMenuActions"
      >
        <template slot="head">
          <column width="21%">{{ $t('fields.product_name') }}</column>
          <column width="21%">{{ $t('fields.identification_number') }}</column>
          <column width="28%">{{ $t('fields.description') }}</column>
          <column width="15%">{{ $t('fields.price') }}</column>
          <column width="15%">{{ $t('fields.stock') }}</column>
        </template>
        <template slot="columns" slot-scope="{ row }">
          <column width="21%">
            <a :href="`#${row.uuid}`" @click="edit(row)">{{ row.name }}</a>
          </column>
          <column width="21%">
            <span>{{ row.identificationNumber }}</span>
          </column>
          <column width="28%">
            <span>{{ row.description }}</span>
          </column>
          <column width="15%">
            <span class="currency">{{ row.price.currency | currencySymbol }}</span>
            <span class="currency currency--primary">{{ row.price.amount | currency }}</span>
          </column>
          <column width="15%">
            <span v-if="row.isService" class="product-qty product-qty--service">Service</span>
            <span v-else-if="row.qty <= 0" class="product-qty product-qty--out-of-stock">Out of Stock</span>
            <span v-else class="product-qty">{{ row.qty }}</span>
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
  // Filters
  IsActiveFilter,
  IsArchivedFilter,
  IsDeletedFilter,
  IsInStockFilter,
  IsOutOfStockFilter,
  IsServiceFilter,

  // Search By
  SearchByText,
  SearchByValue
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
  EditDocument
} from '@/modules/table/cm-actions'

export default {
  mixins: [
    TableMixin
  ],

  computed: {
    name() {
      return 'products'
    },

    repository() {
      return 'product'
    },

    searchBy() {
      return [
        SearchByText.extend({ key: 'name', name: 'product_name', placeholder: this.$t('search_by.product_name') }),
        SearchByValue.extend({ key: 'price', name: 'product_price', placeholder: this.$t('search_by.product_price') }),
        SearchByText.extend({ key: 'description', name: 'description', placeholder: this.$t('search_by.words_in_description') }),
        SearchByValue.extend({ key: 'qty', name: 'stock_amount', placeholder: this.$t('search_by.stock_amount') })
      ]
    },

    contextMenuActions() {
      return [
        SELECTED_ROWS,
        Archive.isVisible(whenMoreThanOneRowIsSelected),
        Delete.isVisible(whenMoreThanOneRowIsSelected),
        __SEPARATOR__.isVisible(whenMoreThanOneRowIsSelected),
        TableName.extend({
          title: 'common.product_table'
        }),
        CreateDocument.extend({
          documentType: 'product',
          title: 'actions.new_product',
          icon: 'icon-new-product-btn-icon'
        }),
        SELECTED_DOCUMENT.extend({ documentType: 'product' }),
        Preview.extend({ title: 'actions.preview' }),
        EditDocument.extend({ title: 'actions.edit_product' }),
        __SEPARATOR__.isVisible(whenSpecificRowIsSelected),
        Archive,
        Delete,
        Restore
      ]
    },

    filterBy() {
      return [
        IsActiveFilter,
        IsArchivedFilter,
        IsDeletedFilter,
        { type: 'separator' },
        IsInStockFilter,
        IsOutOfStockFilter,
        IsServiceFilter
      ]
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
.product-qty {
  font-weight: bold;
}

.product-qty--service {
  color: #940e96;
}

.product-qty--out-of-stock {
  color: $color-red;
}
</style>