<template>
   <inputs-dropdown @input="onInput" :placeholder="$t('actions.search_by')" class="dropdown--primary">

    <template v-for="option in options">
      <dropdown-separator v-if="option.type === 'separator'"></dropdown-separator>

      <dropdown-numeric-option v-else-if="option.type === 'numeric' || option.type === 'date'"
        :name="option.name"
        :placeholder="option.placeholder">
      </dropdown-numeric-option>

      <dropdown-text-option v-else-if="option.type === 'text'"
        :name="option.name"
        :placeholder="option.placeholder">
      </dropdown-text-option>
    </template>

  </inputs-dropdown>
</template>

<script>
import he from 'he'

export default {
  name: 'search-by',

  props: {
    options: Array,
    name: String
  },

  methods: {
    onInput(e) {
      for (let name in e) {
        const option = this.options.find((option) => option.name === name)
        console.log('id', option.id, option)
        e[name] = {
          key: option.key,
          id: option.id,
          value: typeof e[name] === 'string' ? he.decode(e[name]).trim() : e[name]
        }
      }
      this.$store.commit(`table/${this.name}/SEARCH_BY`, e)
    }
  }
}
</script>