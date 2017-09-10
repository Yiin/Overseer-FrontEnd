<template>
   <inputs-dropdown :placeholder="$t('actions.search_by')" primary>

    <template v-for="option in options">
      <dropdown-separator v-if="option.type === 'separator'"></dropdown-separator>

      <dropdown-numeric-option v-else-if="option.type === 'numeric'"
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
export default {
  name: 'search-by',

  props: {
    options: Array
  }
}
</script>