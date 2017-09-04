<template>
  <div class="table">
    <!-- Table head -->
    <div class="table__head">
      <!-- Checkbox for page-wide rows toggling at once -->
      <div class="column column__checkbox column--center">
        <input @click="togglePageRows" class="checkbox checkbox--center" type="checkbox" :checked="isWholePageSelected">
      </div>
      <!-- Table columns -->
      <slot name="head"></slot>
    </div>

    <!-- Table body -->
    <div class="table__body">
      <!-- If table is empty, display message -->
      <div
        v-if="tableIsEmpty"
        class="table__row table__row--full-width"
      >
        <div class="column">
          No data available in table
        </div>
      </div>
      <!-- Else show current page rows -->
      <div
        v-else
        v-for="row in pageRows"
        class="table__row"
        :class="{ 'table__row--selected': isRowSelected(row) }"
        @click="toggle(row, $event)"
      >
        <!-- Row checkbox which indicates if row is selected -->
        <div class="column column__checkbox column--center">
          <input class="checkbox checkbox--center" type="checkbox" :checked="isRowSelected(row)">
        </div>
        <!-- Table columns with row data -->
        <slot name="columns" :row="row"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'entities-table',

  props: ['data'],

  computed: {
    /**
     * Get rows of current page
     * @return {Array} List of rows
     */
    pageRows() {
      return this.data ? this.data.pageList : []
    },

    /**
     * Check if table is empty
     * @return {Boolean}
     */
    tableIsEmpty() {
      return this.pageRows.length === 0
    },

    /**
     * Are all rows in current page selected?
     * @return {Boolean}
     */
    isWholePageSelected() {
      return this.pageRows.every((row) => this.isRowSelected(row))
    }
  },

  methods: {
    /**
     * Select or unselect all rows in current page at once
     * @return {void}
     */
    togglePageRows() {
      if (this.isWholePageSelected) {
        this.pageRows.forEach((row) => this.toggle(row))
      } else {
        this.pageRows.filter((row) => !this.isRowSelected(row)).forEach((row) => this.toggle(row))
      }
    },

    /**
     * Toggle row selection
     * @param  {object} row Row to toggle
     * @param  {object} event
     * @return {void}
     */
    toggle(row, event = null) {
      if (event && ['a'].indexOf(event.target.nodeName.toLowerCase()) > -1) {
        return
      }
      this.$store.dispatch('TOGGLE_ROW', {
        name: this.data.name,
        row
      })
    },

    /**
     * Check if row is selected
     * @param  {object}  row Row to check
     * @return {Boolean}     Is row selected
     */
    isRowSelected(row) {
      return this.data.selection.indexOf(row) > -1
    }
  }
}
</script>

<style lang="scss" src="@/styles/tables.scss"></style>