<template>
  <form-field catch-errors="currency_code" :label="$t('labels.currency')">
    <form-dropdown-input
      v-bind="$attrs"
      :watch="currencies"
      v-model="localValue"
      name="currency_code"
      :placeholder="$t('labels.currency')"
      scrollable
      searchable
    >
      <dropdown-option v-for="currency in currencies" :key="currency.code"
                      :value="currency.code"
                      :title="currency.code + ' - ' + currency.name"
                      :selected="currency.code === (localValue || settings.currency.code)">
        {{ currency.code }} - {{ currency.name }}
      </dropdown-option>
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
      return this.$store.state.passive.currencies
    },

    settings() {
      return this.$store.state.settings
    }
  }
}
</script>