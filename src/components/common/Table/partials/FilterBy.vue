<template>
  <checkbox-dropdown v-model="values" :placeholder="$t('actions.select_to_show')" class="dropdown--primary">

    <template v-for="option in options">

      <template v-if="option.type === 'separator'">
        <dropdown-separator></dropdown-separator>
      </template>

      <template v-else-if="option.type === 'list'">

        <dropdown-childs-option :watch="watch[option.name]">
          <template slot="label"> {{ $t(option.placeholder) }} </template>
          <template slot="options">

            <dropdown-checkbox-option v-for="child in option.list"
                                      :key="child[option.keyName]"
                                      :value="option.name + ':' + child[option.keyName]"
                                      :title="child.name">
              {{ child.name }}
            </dropdown-checkbox-option>

          </template>
        </dropdown-childs-option>

      </template>

      <dropdown-checkbox-option ref="checkboxOption" v-else :value="option.name">
        {{ $t(option.placeholder) }}
      </dropdown-checkbox-option>
    </template>

  </checkbox-dropdown>
</template>

<script>
export default {
  name: 'filter-by',

  props: {
    options: Array,
    name: String,
    watch: {
      default: null
    }
  },

  data() {
    return {
      values: []
    }
  },

  watch: {
    values: function (values) {
      this.$store.commit(`table/${this.name}/FILTER_BY`, values)
    }
  }
}
</script>