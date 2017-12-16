<template>
  <div class="bill-summary">
    <div class="bill-summary__items" :class="{ 'scrollable': items.length > 6 }">
      <div v-if="!items.length" class="placeholder-area">
        <div class="placeholder" :class="[ `placeholder--${form}s` ]"></div>
      </div>
      <bill-summary-item
        @click="navigateToItem(item)"
        v-for="(item, index) in items"
        :key="index"
        :item="item"
      ></bill-summary-item>
    </div>
    <div class="bill-summary__details bill-summary__details--lines">
      <div class="bill-summary__detail">
        <div class="bill-detail__title">
          Subtotal
        </div>
        <div class="bill-detail__value">
          <span class="currency">
            {{ currency | currencySymbol }}
          </span>
          <span class="currency currency--primary">
            {{ subtotal | currency }}
          </span>
        </div>
      </div>
      <div class="bill-summary__detail">
        <div class="bill-detail__title">
          Discount
        </div>
        <div class="bill-detail__value">
          <span class="currency">
            {{ currency | currencySymbol }}
          </span>
          <span class="currency currency--primary">
            {{ discount | currency }}
          </span>
        </div>
      </div>
      <div class="bill-summary__detail">
        <div class="bill-detail__title">
          Taxes
        </div>
        <div class="bill-detail__value">
          <span class="currency">
            {{ currency | currencySymbol }}
          </span>
          <span class="currency currency--primary">
            {{ taxes | currency }}
          </span>
        </div>
      </div>
      <div class="bill-summary__detail">
        <div class="bill-detail__title">
          Paid In
        </div>
        <div class="bill-detail__value">
          <span class="currency">
            {{ currency | currencySymbol }}
          </span>
          <span class="currency currency--secondary">
            {{ paidIn | currency }}
          </span>
        </div>
      </div>
    </div>
    <div class="bill-summary__total">
      <div class="bill-summary__total-title">
        Total
      </div>
      <div class="bill-summary__total-amount">
        <span class="currency">
          {{ currency | currencySymbol }}
        </span>
        <span class="currency currency--primary">
          {{ total | currency }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import BillSummaryItem from './BillSummaryItem.vue'
// import BillItem from '@models/bill-item'
import Money from '@models/money'
import { getRepositoryName } from '@/modules/documents/helpers'

export default {
  components: {
    BillSummaryItem
  },

  props: {
    /**
     * Name of the form we display summary of
     */
    form: {
      type: String,
      required: true
    }
  },

  computed: {
    /**
     * Form fields object
     */
    formFields() {
      return this.$store.state.form[this.form].fields
    },

    currency() {
      return this.$store.getters['documents/repositories/currency/FIND_ITEM_BY_KEY'](this.formFields.currency_code)
    },

    items() {
      return this.formFields.items.map((item) => {
        return {
          product: null,
          name: item.name,
          qty: item.qty,
          cost: Money.create({
            amount: item.cost,
            currency: this.$store.getters['documents/repositories/currency/FIND_ITEM_BY_KEY'](this.formFields.currency_code)
          })
        }
      })
    },

    subtotal() {
      return this.items.reduce((sum, item) => {
        return sum + (item.cost.get() * item.qty)
      }, 0)
    },

    sumOfItemsDiscount() {
      // return this.items.reduce((sum, item) => {
      //   return 0 // sum + item.discount || 0
      // }, 0)
      return 0
    },

    discount() {
      return this.sumOfItemsDiscount + this.formFields.discount_type === 'percentage'
        ? this.subtotal * parseFloat(this.formFields.discount_value)
        : this.formFields.discount_value
    },

    taxes() {
      return 0
    },

    paidIn() {
      let sum = 0

      // if document already exists
      if (this.formFields.uuid) {
        const repositoryName = getRepositoryName(this.form)

        // because it's invoice, we need to take into account all its payments
        if (repositoryName === 'invoice') {
          sum += this.$store.getters['documents/repositories/payment/ACTIVE_COMPANY_ITEMS'].filter((payment) => {
            return payment.invoice.uuid === this.formFields.uuid
          }).reduce((sum, payment) => {
            return sum + payment.amount.getIn(this.formFields.currency_code)
          }, 0)
        }
      }

      // sum partial
      sum += this.formFields.partial

      // applied credits
      sum += this.formFields.applied_credits.reduce((sum, appliedCredit) => {
        return sum + appliedCredit.amount
      }, 0)

      return sum
    },

    total() {
      let total = 0

      total += this.subtotal
      total -= this.discount
      total += this.taxes

      return total
    }
  }
}
</script>

<style lang="scss">
//dimension defaults
$radius: 4px;
$bp-tablet: 900px;
$content-width: 960px;
//colors
$color-background: #FFCC66;
$color-primary: $color-main;
$color-success: #86D65F;
$color-title: #7C818E;
$color-border: #DDD;

.bill-summary {
    padding: 0px 16px 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 32px;
        border-bottom: 1px solid #ddd;
    }
    &__title {
        display: inline-block;
        font-weight: normal;
        color: $color-title;
    }
    &__balance {
        font-size: 32px;
        font-weight: bold;
    }
    &__items {
        width: calc(100% + 12px);
        border-spacing: 0 24px;
        height: 300px;
        overflow: auto;
        padding: 0;
        &:not(.scrollable) {
            padding-right: 6px;
            overflow: hidden;
        }
        .placeholder-area {
            transform: translateY(-23px);
        }
    }

    &__item {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 49px;
        padding: 0 23px 0 17px;

        &:hover {
            background-color: $color-wild-sand;
        }
    }

    &__item-icon {
        font-size: 20px;
        color: #737373;
        margin-right: 8px;
        height: 100%;
        display: inline-block;
    }

    &__item-title {
        font-weight: 600;
        display: block;
        margin-bottom: 6px;
        font-size: 14px;
    }

    &__item-sub-title {
        color: #373737; //#BDBDBD;
        font-size: 0.8em;
    }

    &__item-price {
        font-size: 15px;
        font-weight: bold;
    }

    &__details {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        height: 138px;
        border-top: 2px solid $color-wild-sand;
        padding: 18px 17px 19px;
    }

    &__detail {
        width: 100%;
        height: 38px;
        font-size: 16px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    &__total {
        border-top: 2px solid $color-wild-sand;
        border-bottom: 2px solid $color-wild-sand;
        padding: 20px 17px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

    &__total-title {
        font-size: 28px;
        font-weight: 600;
    }

    &__total-amount {
        font-size: 28px;
        font-weight: 600;
    }
}

.bill-detail {
    &__title {
        color: #373737;
        font-weight: 600;
        font-size: 15px;
    }
    &__value {
        font-size: 15px;
    }
}

.bill-price {
    &__dollars {
        font-size: 1em;
        line-height: 1;
        &:after {
            content: '.';
        }
    }

    &__cents {
        font-size: 0.625em;
        line-height: 1.4;
        vertical-align: top;
    }
}
</style>