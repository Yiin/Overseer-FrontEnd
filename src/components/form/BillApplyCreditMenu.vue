<template lang="pug">
  v-menu(
    top left
    min-width='430px'
    max-width='430px'
    v-model='creditsMenu'
    :close-on-content-click='false'
  )
    //-
      Form input where we show sum of applied credits

    template(slot='activator')
      slot(name='activator')
        .form__input--label-left(
          :data-label='currency.code'
        )
          .form__input {{ appliedCreditsSum.formatAmount() }}

    //-
      Credits menu

    v-card
      v-list
        v-list-tile(avatar='')
          v-list-tile-content
            v-list-tile-title {{ client && client.name }}
            v-list-tile-sub-title Available Credits
          v-list-tile-action
            v-btn(icon='', @click='createCredit()')
              v-icon add
      v-divider
      v-list.creditsList(
        :class="{ 'scrollable': availableCredits.length > 5 }"
      )

        //-
          If there are no available credits
          notify user about that

        v-list-tile(v-if='!availableCredits.length')
          v-list-tile-action
            v-btn(icon='' @click='createCredit()')
              v-icon add
          v-list-tile-content
            v-list-tile-title Selected client has no available credit.
            v-list-tile-sub-title Click + to create a new one.

        //-
          Else show list of available toggleable credits

        v-list-tile(v-for='availableCredit in availableCredits', :key='availableCredit.credit.uuid')
          v-list-tile-action
            v-switch(v-model='appliedCreditsList', :value='availableCredit.credit.uuid', color='orange')
          v-list-tile-content
            v-list-tile-title
              span.currency {{ currency | currencySymbol }}
              span.currency(
                :class="{ 'currency--primary': !availableCredit.isApplied, 'currency--secondary': availableCredit.isApplied }"
              )
                | {{ availableCredit.credit.balance.getIn(currency) + getCreditInitialAppliedAmount(availableCredit.credit) | currency }}

            v-list-tile-sub-title(:title='availableCredit.credit.creditNumber')
              | {{ availableCredit.credit.creditNumber }}

          v-list-tile-action.creditInput(:style="{ display: availableCredit.isApplied ? 'flex' : 'none' }")
            v-text-field(
              single-line=''
              label='Amount to apply'
              v-model='availableCredit.amountToApply'
              @change='checkCreditBoundaries(availableCredit)'
              :prefix='currency.symbol'
            )
      v-divider
      v-list
        v-list-tile
          v-list-tile-content
            v-list-tile-title Total applied credit
          v-list-tile-content
            v-list-tile-title
              span.currency
                | {{ appliedCreditsSum.currency | currencySymbol }}
              span.currency.currency--secondary
                | {{ appliedCreditsSum.amount | currency }}
</template>

<script>
import Client from '@models/client'
import Currency from '@models/currency'
import Money from '@models/money'
import { createDocument } from '@/modules/documents/actions'

export default {
  props: {
    /**
     * Currently selected currency
     */
    currency: {
      type: Currency,
      required: true
    },

    /**
     * Selected client
     */
    client: {
      type: Client,
      required: true
    },

    /**
     * List of available credits
     */
    credits: {
      type: Array,
      required: true
    },

    /**
     * v-model
     */
    value: {}
  },

  data() {
    return {
      /**
       * Are we showing credits menu?
       */
      creditsMenu: false,

      /**
       * List of applied credits uuids
       */
      appliedCreditsList: [],

      /**
       * List of applied credits (models)
       */
      appliedCredits: [],

      /**
       * Credits that were already applied.
       * Used to accurately calculate available
       * credit balance.
       */
      initialAppliedCredits: []
    }
  },

  computed: {
    /**
     * List of available credits
     */
    availableCredits() {
      return this.credits.filter((credit) => {
        return credit.balance.amount + this.getCreditInitialAppliedAmount(credit) > 0
      }).map((credit) => {
        const appliedCredit = this.appliedCredits.find((appliedCredit) => appliedCredit.credit.uuid === credit.uuid)

        return appliedCredit || {
          credit,
          isApplied: false
        }
      })
    },

    /**
     * Sum of applied credits
     */
    appliedCreditsSum() {
      return Money.create({
        amount: this.appliedCredits.reduce((sum, credit) => {
          return sum + parseFloat(credit.amountToApply)
        }, 0),
        currency: this.currency
      })
    }
  },

  watch: {
    /**
     * Watch applied credits list and update
     * value accordingly.
     */
    appliedCreditsList(appliedCreditsList) {
      const newAppliedCredits = appliedCreditsList.filter((uuid) => {
        return !this.appliedCredits.find((appliedCredit) => {
          return appliedCredit.credit.uuid === uuid
        })
      })

      newAppliedCredits.forEach((uuid) => {
        const credit = this.credits.find((credit) => credit.uuid === uuid)

        this.appliedCredits.push({
          isApplied: true,
          credit,
          amountToApply: credit.balance.getIn(this.currency)
        })
      })

      this.appliedCredits = this.appliedCredits.filter((appliedCredit) => appliedCreditsList.find((uuid) => uuid === appliedCredit.credit.uuid))
    },

    appliedCredits: {
      handler: function (appliedCredits) {
        this.$emit('input', appliedCredits.map((appliedCredit) => {
          return {
            credit_uuid: appliedCredit.credit.uuid,
            amount: Number(appliedCredit.amountToApply),
            currency_code: this.currency.code
          }
        }))
      },
      deep: true
    }
  },

  mounted() {
    this.initialAppliedCredits = JSON.parse(JSON.stringify(this.value))

    this.appliedCredits = this.value.map((appliedCredit) => {
      const credit = this.credits.find((credit) => credit.uuid === appliedCredit.credit_uuid)

      const amount = Money.create({
        amount: appliedCredit.amount,
        currency: appliedCredit.currency_code
      }).getIn(this.currency)

      return {
        isApplied: true,
        credit,
        amountToApply: amount
      }
    })
    this.appliedCreditsList = this.appliedCredits.map((appliedCredit) => appliedCredit.credit.uuid)
  },

  methods: {
    getCreditInitialAppliedAmount(credit) {
      const initial = this.initialAppliedCredits.find((initialAppliedCredit) => initialAppliedCredit.credit_uuid === credit.uuid)

      if (initial) {
        return Money.create({
          amount: initial.amount,
          currency: this.currency_code
        }).getIn(this.currency)
      } else {
        return 0
      }
    },

    checkCreditBoundaries(appliedCredit) {
      const currentCreditBalance = appliedCredit.credit.balance.getIn(this.currency) + this.getCreditInitialAppliedAmount(appliedCredit.credit)

      if (parseFloat(appliedCredit.amountToApply) > currentCreditBalance) {
        appliedCredit.amountToApply = currentCreditBalance
      } else if (parseFloat(appliedCredit.amountToApply) < 0) {
        appliedCredit.amountToApply = 0
      }
    },

    createCredit() {
      createDocument('credit', {
        client_uuid: this.client.uuid
      }, {
        tabIndex: 1
      }).then(() => {
        setTimeout(() => {
          this.$store.dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', 1)
        }, 100)
      })
    }
  }
}
</script>