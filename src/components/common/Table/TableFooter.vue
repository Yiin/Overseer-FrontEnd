<template lang="pug">
  .table__footer

    //-
      Table values calculator

    .table__footer-block.table__footer-block--left(v-if="calculatorOptions.length")
      .table__footer-text {{ $t('table.total') }}

      //-
        Dropdown with available columns that we can sum

      form-dropdown-input.dropdown--primary.dropdown--table-footer.dropdown--calculator(
        :items="calculatorOptions"
        v-model="calculate"
        placeholder="Select"
      )

      //-
        Result

      .table__footer-text {{ $t('table.for_selected_is') }}
        span.calculator-result(v-if="selectedCalculatorOption")
          template(v-if="selectedCalculatorOption.type === 'money'")
            span.currency {{ calculatorResult.currency | currencySymbol }}
            span.currency.currency--primary {{ calculatorResult.amount | currency }}

          template(v-else) {{ calculatorResult }}

    //-
      Current page & left/right navigation

    .table__footer-block.table__footer-block--right
      .table__footer-text {{ $t('table.page') }}

      .table__footer-page

        //-
          Go to previous page

        .nav-page.nav-page--left(
          v-show="!isFirstPage"
          @click="prevPage"
        ) «

        //-
           Current page

        input.table__footer-page-input(
          v-model="currentPage"
          type="text"
          data-lpignore="true"
        )

        //-
          Go to next page

        .nav-page.nav-page--right(
          v-show="!isLastPage"
          @click="nextPage"
        ) »

      //-
        Table data summary

      .table__footer-text
        template(v-if="showing_all && total > 0")
          | {{ $t('table.showing_all_entries') }}
        template(v-else)
          | {{ $tc('table.showing_some_entries', to - from, { from, to, total }) }}

      form-dropdown-input.dropdown--primary.dropdown--table-footer.dropdown--page(
        v-model="rowsPerPage"
        :items="rowsPerPageOptions"
      )
      .table__footer-text {{ $t('table.rows') }}
</template>

<script>
export default {
  props: {
    tableName: {
      type: String,
      required: true
    },

    calculatorOptions: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      calculate: this.calculatorOptions.length ? this.calculatorOptions[0].value : null,
      currentPage: this.$store.state.table[this.tableName].page + 1
    }
  },

  watch: {
    currentPage(page) {
      const _page = parseInt(page)
      if (_page > 0 && _page <= this.pagesCount) {
        this.changePage(_page - 1)
      }
    },

    page(page) {
      this.currentPage = page
    }
  },

  computed: {
    rowsPerPageOptions() {
      return [10, 20, 50, Number.MAX_SAFE_INTEGER].map((value) => {
        return {
          text: value === Number.MAX_SAFE_INTEGER ? this.$t('common.all') : value,
          value
        }
      })
    },

    rowsPerPage: {
      get() {
        return this.rows
      },
      set(value) {
        this.changeRowsPerPage(value)
      }
    },

    tableState() {
      return this.$store.state.table[this.tableName]
    },

    defaultCurrency() {
      return this.$store.state.settings.currency
    },

    selectedCalculatorOption() {
      return this.calculatorOptions.find((option) => option.value === this.calculate)
    },

    calculatorResult() {
      if (this.calculate) {
        const option = this.selectedCalculatorOption

        if (option.type === 'money') {
          return {
            amount: this.tableState.selection.reduce((sum, row) => {
              return sum + row[this.calculate].getIn(this.defaultCurrency)
            }, 0),
            currency: this.defaultCurrency
          }
        } else {
          return this.tableState.selection.reduce((sum, row) => {
            return sum + row[this.calculate]
          }, 0)
        }
      }
      return null
    },

    page() {
      return this.tableState.page + 1
    },

    pagesCount() {
      return this.$store.getters[`table/${this.tableName}/pagesCount`]
    },

    isFirstPage() {
      return this.tableState.page === 0
    },

    isLastPage() {
      return this.tableState.page === this.pagesCount - 1 || this.pagesCount === 0
    },

    rows() {
      return this.$store.state.table[this.tableName].rows_per_page
    },

    from() {
      return this.total ? (this.tableState.page * this.tableState.rows_per_page) + 1 : 0
    },

    to() {
      return Math.min(this.total, this.page * this.tableState.rows_per_page)
    },

    showing_all() {
      return this.from === 1 && this.to === this.total
    },

    total() {
      return this.$store.getters[`table/${this.tableName}/filteredItems`].length
    }
  },

  methods: {
    changeRowsPerPage(rows) {
      this.$store.dispatch(`table/${this.tableName}/SET_ROWS_PER_PAGE`, rows)
    },

    changePage(page) {
      this.$store.dispatch(`table/${this.tableName}/SET_PAGE`, page)
    },

    nextPage() {
      if (!this.isLastPage) {
        this.changePage(this.tableState.page + 1)
      }
    },

    prevPage() {
      if (!this.isFirstPage) {
        this.changePage(this.tableState.page - 1)
      }
    }
  }
}
</script>

<style lang="scss">
.dropdown--primary.dropdown--table-footer {
  display: inline-block;
  width: auto;
  margin: 0;
  &.dropdown--calculator {
    width: 158px;
    margin: 0 13px 0 20px;
  }
  &.dropdown--page {
    width: 83px;
    margin: 0 17px 0 18px;
  }
}

span.calculator-result {
    padding-left: 5px;
    color: $color-main;
    font-weight: 700;
}

.table__footer-page-input {
  line-height: 44px;

  text-align: center;
  font-size: 16px;
  background: #ffffff;

  width: 70px;
  height: 44px;
  margin: 0 9px;

  border: none;
  box-shadow: $box-shadow;

  &:focus {
    outline: none;
  }
}

.nav-page {
  font-size: 30px;
  color: $color-dusty-gray;
  font-weight: 600;
  margin-top: -4px;
  user-select: none;
  cursor: pointer;
  &:hover {
    color: $color-main-dark;
  }
}

.nav-page--left {
    float: left;
}

.nav-page--right {
    float: right;
}

.table__footer-page {
    display: flex;
    align-items: center;
    margin: 0 18px 0 14px;
}

.table__footer-text {
    font-size: 15px;
    font-weight: $font-weight-semibold;
    color: $color-dusty-gray;
    display: inline-block;
    user-select: none;
    cursor: default;
}

.table__footer {
    font-size: 0;
    margin-top: 37px;
}

.table__footer-block {
    display: flex;
    align-items: center;
}

.table__footer-block--left {
    float: left;
}

.table__footer-block--right {
    float: right;
}
</style>