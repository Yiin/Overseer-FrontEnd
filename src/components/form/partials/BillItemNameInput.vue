<template>
  <form-dropdown-input
    vuetify
    placeholder="Select item"
    :items="products"
    @input="selectItemProduct"
    @input-custom="updateItemName"
    allow-custom
    dense
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
</template>

<script>
export default {
  props: {
    value: {},
    watch: {}
  },

  watch: {
    watch(val) {
      if (val) {
        setTimeout(() => {
          this.$el.querySelector('input').focus()
        }, 50)
      }
    }
  },

  computed: {
    name: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('value', value)
      }
    },

    products() {
      return this.$store.getters['documents/repositories/product/ACTIVE_COMPANY_ITEMS'].map((product) => {
        return {
          text: product.name,
          value: product.uuid,

          ...product
        }
      })
    }
  },

  methods: {
    updateItemName(name) {
      this.$emit('input', name)
      this.$emit('select', null)
    },

    selectItemProduct(uuid) {
      this.$emit('select', uuid)
    }
  }
}
</script>