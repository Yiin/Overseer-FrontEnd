<template>
  <div class="table__footer">

    <div class="table__footer-block table__footer-block--left">
      <div class="table__footer-text">
        {{ $t('table.total') }}
      </div>
      <dropdown placeholder="Select" class="dropdown--primary dropdown--table-footer dropdown--calculator">
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
        <div class="nav-page nav-page--left">«</div>
        <input class="table__footer-page-input" type="text" value="1">
        <div class="nav-page nav-page--right">»</div>
      </div>
      <div class="table__footer-text">
        <template v-if="showing_all">
          {{ $t('table.showing_all_entries') }}
        </template>
        <template v-else>
          {{ $tc('table.showing_some_entries', { from, to, total }) }}
        </template>
      </div>
      <dropdown class="dropdown--primary dropdown--table-footer dropdown--page">
        <dropdown-option value="10" selected>
          10
        </dropdown-option>
        <dropdown-option value="20">
          20
        </dropdown-option>
        <dropdown-option value="50">
          50
        </dropdown-option>
        <dropdown-option value="All">
          All
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
  props: ['pagination'],

  computed: {
    page() {
      return this.pagination.page + 1
    },

    from() {
      return (this.pagination.page * this.pagination.amount) + 1
    },

    to() {
      return Math.min(this.pagination.total, this.page * this.pagination.amount)
    },

    showing_all() {
      return this.to === this.total
    },

    total() {
      return this.pagination.total
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
    font-size: 16px;
    font-weight: $font-weight-semibold;
    color: $color-dusty-gray;
    display: inline-block;
    user-select: none;
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