<template>
   <inputs-dropdown @input="onInput" :placeholder="$t('actions.search_by')" class="dropdown--primary">

    <template v-for="option in options">
      <dropdown-separator v-if="option.type === 'separator'"></dropdown-separator>

      <dropdown-date-range-option v-if="option.type === 'date'"
        :name="option.name"
        v-model="values[option.name]"
        :placeholder="option.placeholder">
      </dropdown-date-range-option>

      <dropdown-numeric-option v-else-if="option.type === 'numeric'"
        :name="option.name"
        v-model="values[option.name]"
        :placeholder="option.placeholder">
      </dropdown-numeric-option>

      <dropdown-text-option v-else-if="option.type === 'text'"
        :name="option.name"
        v-model="values[option.name]"
        :placeholder="option.placeholder">
      </dropdown-text-option>
    </template>

  </inputs-dropdown>
</template>

<script>
import he from 'he'
import DropdownDateRangeOption from '@/components/common/Dropdown/DropdownDateRangeOption.vue'
import DropdownNumericOption from '@/components/common/Dropdown/DropdownNumericOption.vue'
import DropdownTextOption from '@/components/common/Dropdown/DropdownTextOption.vue'

export default {
  name: 'search-by',

  components: {
    DropdownDateRangeOption,
    DropdownNumericOption,
    DropdownTextOption
  },

  props: {
    options: Array,
    name: String
  },

  data() {
    const values = {}

    this.options.forEach((option) => {
      values[option.name] = ''
    })

    return {
      values
    }
  },

  computed: {
    searchBy() {
      return this.$store.state.table[this.name].searchBy
    }
  },

  watch: {
    searchBy(searchBy) {
      for (let name in this.values) {
        if (typeof searchBy[name] === 'undefined') {
          this.values[name] = ''
        } else {
          this.values[name] = searchBy[name].value
        }
      }
    }
  },

  methods: {
    onInput(e) {
      for (let name in e) {
        const option = this.options.find((option) => option.name === name)
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