<template lang="pug">
  .billForm

    //-
      Heading

    .billBlock
      .billHeader.billHeader--first
        .billHeaderLeft
          .billLogo
        .billHeaderRight
          .billType Invoice
          .billNumber
            .billNumberLabel Invoice No:
            .billNumberValue 12 3456 00

      .billHeader.billHeader--second
        .billHeaderLeft
          .billTitle.billTitle--client Customer
          form-dropdown-input.billClientName(
            :items='clients'
            v-model='clientUuid'
          )
            input.custom(
              slot='activator'
              slot-scope='{ parent }'
              v-model='clientName'
              type='text'
              placeholder='Select Client'
              data-lpignore='true'
              @input='parent.input($event.target.value)'
              @blur='parent.onBlur'
              @focus='parent.onFocus'
            )
          .billClientDetails(v-if='client')
            .billClientDetailsLine P. {{ client.phone }}
            .billClientDetailsLine E. {{ client.email }}
            .billClientDetailsLine A. {{ client.address.format() }}

        .billHeaderRight
          .billTopSummary
            .billTitle.billTitle--balanceDue Balance Due
            .billBalanceDue {{ totalAmountFormatted }}
            bill-date-field

    //-
      Items

    .billBlock
      .itemsList
        table.items
          thead
            tr
              th Item description
              th.center Quantity
              th.center Price
              th.center Total

          tbody

            //-
              List of items

            tr(
              is='item-row'
              v-for='(item, index) in items'
              :item='item'
              :currency='currency'
              :is-last='items.length === 1'
              @remove='removeRow(index)'
            )

          //-
            tr
                Add new row

                button.button.button--addRow(
                  @click='addRow'
                ) Add row

        //-
          Summary

        table.summary
          tbody
            tr
              td.field.field--paymentMethods(colspan='2')
                .billTitle.billTitle--paymentMethod Payment Options
                table.billPaymentMethod
                  tbody
                    tr
                      th Account Name:
                      td Dynamix Technologies
                    tr
                      th Account Number:
                      td 1234568
                    tr
                      th IBAN:
                      td IE12345680525645564656
                    tr
                      th SWIFT:
                      td 99-22-40

              td.field.field--subtotal(colspan='3')
                table.subtotal
                  tbody

                    //-
                      Subtotal

                    tr
                      th Subtotal
                      td {{ subtotalFormatted }}

                    //-
                      Taxes

                    tr
                      th Taxes
                      td.totalDiscount € 0.00

                    //-
                      Discount

                    tr
                      th Discount
                      td.totalDiscount {{ totalDiscount }}

                    //-
                      Applied Credit

                    tr
                      th
                        bill-apply-credit-menu(
                          v-if='client'
                          v-model='applied_credits'
                          :client='client'
                          :currency='currency'
                          :credits='clientCredits'
                        )
                          span.applyCredit(slot='activator') Applied credit
                        span(v-else) Applied credit

                      td {{ appliedCredit }}

                    //-
                      Total Amount

                    tr.spacer
                      td
                    tr.total
                      th Total
                      td.totalValue {{ totalAmountFormatted }}

      //-
        .billBlock.billBlock--summary
          fieldset.form-holder.form-holder--invoice-comment
            label.text.optional(for="comment") Comment
            textarea.text.optional#comment

        .billBlock.billBlock--footer
          .footerBlock
            span.footerLabel Amount in words:
            span {{ totalAmountInWords }}
      .billFooter
        .signatureArea
        .employeeName David Anderson
        .employeeTitle Account Manager


</template>

<script>
import { toWords } from 'number-to-words'
import S from 'string'
import pluralize from 'pluralize'
import BillApplyCreditMenu from '@/components/form/BillApplyCreditMenu.vue'
import ItemRow from './ItemRow.vue'
import Money from '@models/money'
import BillItem from '@models/bill-item'
import BillDateField from './fields/BillDateField.vue'

export default {
  components: {
    ItemRow,
    BillApplyCreditMenu,
    BillDateField
  },

  props: {
    currency: {
      required: true
    },
    client: {
      required: true
    }
  },

  data() {
    return {
      clientUuid: null,
      clientName: '',
      bankAccountUuid: null,
      bankAccountNumber: '',
      items: [],
      applied_credits: []
    }
  },

  computed: {
    bankAccounts() {
      return [
        { text: 'SEB. LT98 2349 0000 2112 4455', value: 'test' }
      ]
    },

    clientCredits() {
      if (this.client) {
        return this.$repository('credits').activeCompanyItems.filter((credit) => {
          return credit.client.uuid === this.client.uuid
        }).map((credit) => ({
          ...credit,
          text: credit.getTitle(),
          value: credit.uuid
        }))
      } else {
        return []
      }
    },

    appliedCreditSum() {
      return this.applied_credits.reduce((sum, appliedCredit) => {
        return sum + appliedCredit.amount
      }, 0)
    },

    appliedCredit() {
      const amount = this.appliedCreditSum

      return this.currency.symbol + ' ' + Money.formatNumber(amount)
    },

    clients() {
      return this.$repository('clients').activeCompanyItems.map((client) => ({
        text: client.name,
        value: client.uuid
      }))
    },

    sellerName() {
      return this.$user.getSelf().getTitle()
    },

    sellerAddress() {
      return '123 6th St. Melbourne, FL 32904'
    },

    subtotal() {
      return this.items.reduce((subtotalSum, item) => {
        return subtotalSum + item.getInitialPrice()
      }, 0)
    },

    subtotalFormatted() {
      return this.currency.symbol + ' ' + Money.formatNumber(this.subtotal)
    },

    totalDiscount() {
      const amount = this.items.reduce((discountSum, item) => {
        return discountSum + item.getDiscount()
      }, 0)

      return this.currency.symbol + ' ' + Money.formatNumber(amount)
    },

    totalAmount() {
      let amount = this.items.reduce((amountSum, item) => {
        return amountSum + item.getFinalPrice()
      }, 0)

      amount -= this.appliedCreditSum

      return amount
    },

    totalAmountFormatted() {
      return this.currency.symbol + ' ' + Money.formatNumber(this.totalAmount)
    },

    totalAmountInWords() {
      const wholeNumber = S(toWords(this.totalAmount)).capitalize().s
      const currencyName = pluralize(this.currency.name).toLowerCase()
      const centsAmount = toWords((this.totalAmount * 100) % 100)

      return `${wholeNumber} ${currencyName} and ${centsAmount} cents.`
    }
  },

  watch: {
    clientUuid(clientUuid) {
      this.$emit('update-client', clientUuid)
    },

    clientName(clientName) {
      if (this.client && clientName !== this.client.name) {
        this.clientUuid = null
      }
    },

    client(client) {
      this.clientName = client.name
      this.applied_credits = []
    },

    bankAccountUuid(bankAccountUuid) {
      const bankAccount = this.bankAccounts.find((bankAccount) => bankAccount.value === bankAccountUuid)

      if (bankAccount) {
        this.bankAccountNumber = bankAccount.text
      }
    },

    /**
     * Sync items changes
     */
    items: {
      handler(items) {
        this.$emit('update-items', items)
      },
      deep: true
    },

    /**
     * Sync applied credit
     */
    applied_credits: {
      handler(appliedCredits) {
        this.$emit('update-applied-credits', appliedCredits)
      },
      deep: true
    }
  },

  mounted() {
    this.addRow(BillItem.fakeData())
    this.addRow(BillItem.fakeData())
    this.addRow(BillItem.fakeData())
    this.addRow(BillItem.fakeData())
  },

  methods: {
    addRow(itemData = {}) {
      const item = BillItem.create({
        currency_code: this.currency.code,

        ...itemData
      })
      this.items.push(item)
    },

    removeRow(index) {
      if (this.items.length > 1) {
        this.items.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" src="./styles/main.scss"></style>