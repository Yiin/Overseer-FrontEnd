<template>
  <div>
    <breadcrumb :path="['Clients']"></breadcrumb>

    <div class="table__heading">
      <a @click="openModal" class="button button__create">
        <span class="icon-new-client-btn-icon"></span>
        New Client
      </a>
    </div>

    <entities-table :data="list">
      <template slot="head">
        <column width="18%">Name</column>
        <column width="20%">VAT Number</column>
        <column width="13%">Phone number</column>
        <column width="20%">Email</column>
        <column width="11%">Date Created</column>
        <column width="14%">Balance</column>
      </template>
      <template slot="columns" scope="props">
        <column>
          <a :href="`#${props.row.id}`">{{ props.row.name }}</a>
        </column>
        <column>{{ props.row.vat_number }}</column>
        <column>{{ props.row.phone }}</column>
        <column>{{ props.row.email }}</column>
        <column>{{ props.row.created_at }}</column>
        <column>
          <span class="currency">{{ props.row.balance.currency }}</span>
          <span class="currency currency--primary">{{ props.row.balance | currency }}</span>
        </column>
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
  const name = 'clients'

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
          title: 'New Client',
          component: 'edit-client',
          data: {}
        })
      }
    }
  }
</script>