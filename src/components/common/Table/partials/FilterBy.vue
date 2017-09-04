<template>
  <checkbox-dropdown :placeholder="$t('actions.select_to_show')" class="dropdown--primary">

    <template v-for="option in options">

      <template v-if="option.type === 'separator'">
        <dropdown-separator></dropdown-separator>
      </template>

      <template v-else-if="option.type === 'list'">

        <dropdown-childs-option>
          <template slot="label"> {{ option.placeholder }} </template>
          <template slot="options">

            <dropdown-checkbox-option v-for="child in option.list"
                                      :key="child[option.keyName]"
                                      :value="child[option.keyName]"
                                      :searchable="child.name">
              {{ child.name }}
            </dropdown-checkbox-option>

          </template>
        </dropdown-childs-option>

      </template>

      <dropdown-checkbox-option v-else :value="option.name">
        {{ option.placeholder }}
      </dropdown-checkbox-option>
    </template>

  </checkbox-dropdown>
</template>

<script>
export default {
  name: 'filter-by',

  props: {
    options: Array
  }
}
</script>