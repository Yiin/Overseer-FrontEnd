<template>
  <v-card height="500px">
    <v-list>
      <v-list-tile avatar>
        <v-list-tile-content v-if="create">
          <v-list-tile-title>Add new item</v-list-tile-title>
          <v-list-tile-sub-title>Select existing product or enter a new one</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-content v-else-if="edit">
          <v-list-tile-title>Edit item</v-list-tile-title>
          <v-list-tile-sub-title>Select existing product or enter a new one</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-divider></v-divider>
    <form-dropdown-input
      placeholder="Enter item or select product"
      :items="products"
      @input="selectItemProduct"
      @input-custom="updateItemName"
      allow-custom
    >
      <v-list-tile slot="option" slot-scope="{ item, parent }" @click="parent.select(item)">
        <v-list-tile-content>
          <v-list-tile-title>
            {{ item.name }}
          </v-list-tile-title>
          <v-list-tile-sub-title>
            <template v-if="item.identification_number">
              {{ item.identification_number }} |
            </template>
            x {{ item.qty }}
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </form-dropdown-input>
    <div class="row">
      <v-text-field
        label="Quantity"
        single-line
        prepend-icon="library_add"
      ></v-text-field>
    </div>
    <div class="row">
      <v-text-field
        label="Cost"
        single-line
        :prefix="currency.symbol"
      ></v-text-field>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    create: {
      type: Boolean,
      default: false
    },

    edit: {
      type: Boolean,
      default: false
    },

    item: {
      type: Object,
      default: null
    },

    currency: {
      type: Object
    }
  },

  computed: {
    products() {
      return this.$store.getters['documents/repositories/product/ACTIVE_COMPANY_ITEMS']
    }
  },

  mounted() {

  },

  methods: {
    selectItemProduct() {

    },

    updateItemName() {

    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  padding: 0 15px;
}
</style>