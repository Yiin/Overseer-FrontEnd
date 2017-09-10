<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">

      <!--
        Select vendor
       -->
      <modal-tab :title="$t('tabs.vendor')">
        <form-container name="expense">
          <form-inline-select-input name="vendor" :placeholder="$t('placeholders.type_vendor_name')">
            <inline-option v-for="vendor in vendors"
                          :key="vendor.uuid"
                          :value="vendor.uuid"
                          :selected.once="vendor.uuid === form.vendor"
            >
              {{ vendor.name }}
            </inline-option>
          </form-inline-select-input>
        </form-container>
      </modal-tab>

      <!--
        Expenses Category
       -->
      <modal-tab :title="$t('tabs.category')">
        <form-container name="expense">
          <form-inline-select-input name="category" :placeholder="$t('placeholders.type_category_name')">
            <inline-option v-for="category in categories"
                          :key="category.uuid"
                          :value="category.uuid"
                          :selected.once="category.uuid === form.category"
            >
              {{ category.name }}
            </inline-option>
          </form-inline-select-input>
        </form-container>
      </modal-tab>

      <modal-tab :title="$t('tabs.details')">
        <form-container name="expense">
          <form-row>

            <!--
              Cost
            -->
            <form-field :label="$t('labels.amount')" :catch-errors="[ 'amount', 'currency' ]">
              <form-inputs-group>

                <!--
                  Amount
                -->
                <form-text-input name="amount"></form-text-input>

                <!--
                  Currency
                -->
                <form-dropdown-input name="currency" class="dropdown--small" :placeholder="$t('labels.currency')">
                  <dropdown-option v-for="currency in currencies" :key="currency.id"
                                  :value="currency.id"
                                  :selected.once="currency.id === form.currency">
                    {{ currency.code }}
                  </dropdown-option>
                </form-dropdown-input>

              </form-inputs-group>
            </form-field>

            <!--
              Date
            -->
            <form-field catch-errors="date" :label="$t('labels.date')">
              <form-date-input name="date"></form-date-input>
            </form-field>

          </form-row>
        </form-container>
      </modal-tab>

      <modal-tab :title="$t('tabs.documents')">

      </modal-tab>

    </modal-tabs>
  </div>
</template>

<script>
export default {
  name: 'edit-expense',

  props: {
    data: {
      default: () => {
        return {}
      }
    }
  },

  data() {
    return {
      vendors: [
        { uuid: '0001', name: 'Vendor A' },
        { uuid: '0002', name: 'Vendor B' },
        { uuid: '0003', name: 'Vendor C' },
        { uuid: '0004', name: 'Vendor D' },
        { uuid: '0005', name: 'Vendor E' }
      ],

      currencies: [
        { id: 1, code: 'GEA' },
        { id: 2, code: 'HFB' },
        { id: 3, code: 'IGC' },
        { id: 4, code: 'JHD' },
        { id: 5, code: 'KIE' }
      ],

      categories: [
        { uuid: '0001', name: 'Category A' },
        { uuid: '0002', name: 'Category B' },
        { uuid: '0003', name: 'Category C' },
        { uuid: '0004', name: 'Category D' },
        { uuid: '0005', name: 'Category D' }
      ]
    }
  },

  computed: {
    form() {
      return this.$store.state.form.expense
    }
  },

  watch: {
    name: function (val) {
      this.data.expense.name = val
    },
    price: function (val) {
      this.data.expense.price = val
    },
    qty: function (val) {
      this.data.expense.qty = val
    },
    currency: function (val) {
      this.data.expense.currency = val
    },
    taxRate: function (val) {
      this.data.expense.taxRate = val
    },
    description: function (val) {
      this.data.expense.description = val
    }
  },

  methods: {
    save() {
      if (this.data.expense.key) {
        this.$store.dispatch('SAVE_ENTITY', {
          tableName: 'expenses',
          data: this.data
        })
      } else {
        this.create()
      }
    },

    create() {
      this.$store.dispatch('CREATE_ENTITY', {
        tableName: 'expenses',
        data: this.data
      })
    },

    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-form {
  display: flex;
  height: 617px;

  .modal-tabs {
    width: 990px;
  }
}
.modal-sidebar {
  width: 397px;
  border-left: 1px solid #e1e1e1;
  float: right;
}

.field--product {
  width: 30%;

  .list-item__field & {
    min-width: 39%;
  }
}

.field--cost {
  width: 15%;
}

.field--qty {
  width: 10%;
}

.field--discount {
  width: 10%;
}

.field--tax-rate {
  width: 20%;
}

.field--actions {
  min-width: 15%;

  &.list-item__field {
    min-width: 10%;
  }
}
</style>