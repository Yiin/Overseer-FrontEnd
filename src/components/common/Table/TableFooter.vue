<template>
  <div class="table__footer">

    <div class="table__footer-block table__footer-block--left">
      <div class="table__footer-text">
        {{ $t('table.total') }}
      </div>
      <form-dropdown-input
        :items="calculatorOptions"
        v-model="calculate"
        placeholder="Select"
        class="dropdown--primary dropdown--table-footer dropdown--calculator"
      ></form-dropdown-input>
      <div class="table__footer-text">
        {{ $t('table.for_selected_is') }}
        <span v-if="selectedCalculatorOption" class="calculator-result">
          <template v-if="selectedCalculatorOption.type === 'money'">
            <span class="currency">
              {{ calculatorResult.currency | currencySymbol }}
            </span>
            <span class="currency currency--primary">
              {{ calculatorResult.amount | currency }}
            </span>
          </template>
          <template v-else>
            {{ calculatorResult }}
          </template>
        </span>
      </div>
    </div>

    <div class="table__footer-block table__footer-block--right">
      <div class="table__footer-text">
        {{ $t('table.page') }}
      </div>
      <div class="table__footer-page">
        <div @click="prevPage" v-show="!isFirstPage" class="nav-page nav-page--left">«</div>
        <input v-model="currentPage" class="table__footer-page-input" type="text" data-lpignore="true">
        <div @click="nextPage" v-show="!isLastPage" class="nav-page nav-page--right">»</div>
      </div>
      <div class="table__footer-text">
        <template v-if="showing_all && total > 0">
          {{ $t('table.showing_all_entries') }}
        </template>
        <template v-else>
          {{ $tc('table.showing_some_entries', to - from, { from, to, total }) }}
        </template>
      </div>
      <form-dropdown-input
        :items="rowsPerPageOptions"
        v-model="rowsPerPage"
        class="dropdown--primary dropdown--table-footer dropdown--page"
      ></form-dropdown-input>
      <div class="table__footer-text">
        {{ $t('table.rows') }}
      </div>
    </div>
  </div>
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