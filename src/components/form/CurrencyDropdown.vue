<template lang="pug">
  form-field(
    :errors='errors'
    :label="$t('labels.currency')"
  )
    form-dropdown-input(
      v-model='localValue'
      :items='currencies'
      v-bind='$attrs'
      avatar
      searchable
    )
      template(slot='option' slot-scope='{ item, parent }')
        v-list-tile(avatar @click='parent.select(item)' tag='div')
          v-list-tile-avatar
            img(:src='require(`@/assets/icons/currency/${item.code.toLowerCase()}.svg`)')
          v-list-tile-content
            v-list-tile-title(v-html='item.code')
            v-list-tile-sub-title(v-html='item.name')

</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number]
    },
    errors: {
      type: Array,
      default: () => []
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
      return this.$store.getters['documents/repositories/currency/AVAILABLE_ITEMS'].map((currency) => {
        return {
          ...currency,

          text: currency.code
        }
      })
    }
  }
}
</script>