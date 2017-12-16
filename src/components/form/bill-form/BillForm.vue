<template lang="pug">
  .billForm

    //-
      Heading

    .billBlock
      .billHeader
        .billBlockColumn
          .billLogo
        .billBlockColumn.billBlockColumn--headerRight
          .billTitle Invoice
          .billNumber
            slot(name='number')

      .billHeader.billHeader--info
        .billBlockColumn
          .billTitle.billTitle--client Customer
          .billClientName Client Name Here
          .billClientDetails
            .billClientDetailsLine P. +01 234 854 654
            .billClientDetailsLine E. uremailname@gmail.com
            .billClientDetailsLine A. 6598 West media sponcer, usa-568

        .billBlockColumn.billBlockColumn--headerRight
          .billTopSummary
            .billTitle.billTitle--balanceDue Balance Due
            .billBalanceDue $ 1,750.00/-
            .billTitle.billTitle--weekday Tuesday
            .billDate 7#[small th] June, 2018

    .billItemsList

    //-
      Companies

    .billBlock.billBlock--companies

      //-
        Our company

      .billBlockColumn
        .billSellerTitle
          slot(name='sellerTitle') Seller
        .billSellerName
          slot(name='sellerName') {{ sellerName }}
        .billSellerAddress
          slot(name='sellerAddress') {{ sellerAddress }}
        .billSellerBank
          slot(name='sellerBank')
            form-dropdown-input(
              :items='bankAccounts'
              :top='36'
              v-model='bankAccountUuid'
            )
              input(
                slot='activator'
                type='text'
                v-model='bankAccountNumber'
                readonly
              )

      //-
        Clients company

      .billBlockColumn
        .billBuyerTitle
          slot(name='buyerTitle') Buyer
        .billBuyerCompany
          slot(name='buyerCompany' :clients='clients')
        .billBuyerName
          slot(name='buyerName')
        .billBuyerAddress
          slot(name='buyerAddress')
        .billBuyerCode
          slot(name='buyerCode')
        .billBuyerVatCode
          slot(name='buyerVatCode')
        .billBuyerPhoneNumber
          slot(name='buyerPhoneNumber')
        .billBuyerEmptyField
          slot(name='buyerEmptyField')

    //-
      Items

    .billBlock
      .itemsList
        table
          thead
            tr
              th Product or Service
              th.center Qty
              th.center Price
              th.center Discount
              th.center Amount
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
              Summary

            tr.summaryRow
              td.field(colspan='2')

                //-
                  Add new row

                button.button.button--addRow(
                  @click='addRow'
                ) Add row

              td(colspan='3')
                table.subtotal
                  tbody
                    tr
                      th Discount
                      td.totalDiscount {{ totalDiscount }}
                    tr
                      th Applied credit
                        bill-apply-credit-menu(
                          v-if='client'
                          v-model='applied_credits'
                          :client='client'
                          :currency='currency'
                          :credits='clientCredits'
                        )
                          template(slot='activator')
                            button.button.button--applyCredit Apply Credit

                      td {{ appliedCredit }}
                    tr.total
                      th Total amount
                      td.totalValue {{ totalAmountFormatted }}

    .billBlock.billBlock--summary
      fieldset.form-holder.form-holder--invoice-comment
        label.text.optional(for="comment") Comment
        textarea.text.optional#comment

    .billBlock.billBlock--footer
      .footerBlock
        span.footerLabel Amount in words:
        span {{ totalAmountInWords }}

</template>

<script>
import { toWords } from 'number-to-words'
import S from 'string'
import pluralize from 'pluralize'
import BillApplyCreditMenu from '@/components/form/BillApplyCreditMenu.vue'
import ItemRow from './ItemRow.vue'
import Money from '@models/money'
import BillItem from '@models/bill-item'

export default {
  components: {
    ItemRow,
    BillApplyCreditMenu
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
    this.addRow()
  },

  methods: {
    addRow() {
      const item = BillItem.create({
        currency_code: this.currency.code
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