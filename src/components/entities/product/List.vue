<template>
  <div>
    <breadcrumb :path="['Products']"></breadcrumb>

    <div class="table__heading">
      <a @click="openModal" class="button button__create">
        <span class="icon-new-product-btn-icon"></span>
        New Product
      </a>
    </div>

    <entities-table :data="list">
      <template slot="head">
        <column width="20%">Product</column>
        <column width="46%">Description</column>
        <column width="16%">Price</column>
        <column width="14%">Stock</column>
      </template>
      <template slot="columns" scope="props">
        <column>
          <a :href="`#${props.row.id}`">{{ props.row.name }}</a>
        </column>
        <column>{{ props.row.description }}</column>
        <column>
          <span class="currency">{{ props.row.currency | currencySymbol }}</span>
          <span class="currency currency--primary">{{ props.row.balance | currency }}</span>
        </column>
        <column>{{ props.row.qty }}</column>
      </template>
      <template slot="table-controls-left"></template>
    </entities-table>

    Page: {{ data.page }}
    Amount of Pages: {{ data.pages }}
    Amount of Items: {{ data.list.length }}
    Amount of Items (total): {{ data.amount }}
  </div>
</template>

<script>
  const name = 'products'

  export default {
    computed: {
      data() {
        return this.$store.state.lists[name]
      },

      list() {
        return {
          name,
          page: this.data.list,
          selection: this.data.selection
        }
      }
    },

    methods: {
      openModal() {
        this.$store.dispatch('openNewModal', {
          title: 'New Product',
          component: 'edit-product',
          data: {}
        })
      }
    }
  }
</script>