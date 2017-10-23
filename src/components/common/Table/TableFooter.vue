<template>
  <div class="table__footer">

    <div class="table__footer-block table__footer-block--left">
      <div class="table__footer-text">
        {{ $t('table.total') }}
      </div>
      <dropdown v-model="calc" placeholder="Select" class="dropdown--primary dropdown--table-footer dropdown--calculator">
        <dropdown-option value="Price">
          Price
        </dropdown-option>
        <dropdown-option value="Balance">
          Balance
        </dropdown-option>
      </dropdown>
      <div class="table__footer-text">
        {{ $t('table.for_selected_is') }}
      </div>
    </div>

    <div class="table__footer-block table__footer-block--right">
      <div class="table__footer-text">
        {{ $t('table.page') }}
      </div>
      <div class="table__footer-page">
        <div @click="prevPage" v-show="!isFirstPage" class="nav-page nav-page--left">«</div>
        <input v-model="currentPage" class="table__footer-page-input" type="text">
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
      <dropdown @input="changeRowsPerPage" class="dropdown--primary dropdown--table-footer dropdown--page">
        <dropdown-option v-for="rpp in [10, 20, 50, 9007199254740991]"
                        :key="rpp"
                        :value="rpp"
                        :selected="rpp === tableState.rows_per_page"
        >
          {{ rpp === 9007199254740991 ? $t('common.all') : rpp }}
        </dropdown-option>
      </dropdown>
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
    }
  },

  data() {
    return {
      calc: '',
      currentPage: this.$store.state.table[this.tableName].page + 1
    }
  },

  watch: {
    currentPage: function (page) {
      const _page = parseInt(page)
      if (_page > 0 && _page <= this.pagesCount) {
        this.changePage(_page - 1)
      }
    },

    page: function (page) {
      this.currentPage = page
    }
  },

  computed: {
    tableState() {
      return this.$store.state.table[this.tableName]
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
    min-width: 158px;
    margin: 0 13px 0 20px;
  }
  &.dropdown--page {
    min-width: 83px;
    margin: 0 17px 0 18px;
  }
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