<template>
  <form-field catch-errors="currency_code" :label="$t('labels.currency')">

    <form-dropdown-input
      v-model="localValue"
      :items="currencies"
    >
      <template slot="option" slot-scope="{ item, parent }">

      </template>
    </form-dropdown-input>
  </form-field>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number]
    }
  },

  data() {
    return {
      localValue: this.value
    }
  },

  watch: {
    value(value) {
      this.localValue = value
    },

    localValue(value) {
      if (value !== this.value) {
        this.$emit('input', value)
      }
    }
  },

  computed: {
    currencies() {
      return this.$store.state.passive.currencies.map((currency) => {
        return Object.assign({}, currency, {
          text: currency.code
        })
      })
    },

    settings() {
      return this.$store.state.settings
    }
  }
}
</script>