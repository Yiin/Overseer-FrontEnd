<template>
  <tr class="billItemRow">
    <td :style="{ width: headers[0].width }" @click="!edit.name && editProp('name')">
      <v-tooltip top color="white"
        :activator="getTD(index, 0)"
        v-model="edit.name"
      >
        <bill-item-name-input
          v-clickaway="stopEditName"
          :watch="edit.name"
          v-model="name"
          @select="selectItemProduct"
        ></bill-item-name-input>
      </v-tooltip>
      <span @click="editProp('name')" style="cursor: pointer">
        {{ name }}
      </span>
    </td>
    <td :style="{ width: headers[1].width }" @click="!edit.identification_number && editProp('identification_number')">
      <v-tooltip top color="white"
        :activator="getTD(index, 1)"
        v-model="edit.identification_number"
      >
        <bill-item-id-number-input
          v-clickaway="stopEditIdNumber"
          :watch="edit.identification_number"
          v-model="identification_number"
        ></bill-item-id-number-input>
      </v-tooltip>
      <span @click="editProp('identification_number')" style="cursor: pointer">
        {{ identification_number }}
      </span>
    </td>
    <td :style="{ width: headers[2].width }">
      <v-tooltip top color="white"
        :activator="getTD(index, 2)"
        v-model="edit.cost"
      >
        <bill-item-cost-input
          :style="{ width: '90px' }"
          v-clickaway="stopEditCost"
          :watch="edit.cost"
          :currency="currency"
          v-model="cost"
        ></bill-item-cost-input>
      </v-tooltip>
      <span @click="editProp('cost')" style="cursor: pointer">
        <span class="currency">
          {{ currency | currencySymbol }}
        </span>
        <span class="currency currency--primary">
          {{ cost | currency }}
        </span>
      </span>
    </td>
    <td :style="{ width: headers[3].width }">
      <v-tooltip top color="white"
        :activator="getTD(index, 3)"
        v-model="edit.qty"
      >
        <bill-item-qty-input
          :style="{ width: '90px' }"
          v-clickaway="stopEditQty"
          :watch="edit.qty"
          v-model="qty"
        ></bill-item-qty-input>
      </v-tooltip>
      <span @click="editProp('qty')" style="cursor: pointer">
        x {{ qty }}
      </span>
    </td>
    <td :style="{ width: headers[4].width }">
      <span class="currency">
        {{ currency | currencySymbol }}
      </span>
      <span class="currency currency--primary">
        {{ cost * qty | currency }}
      </span>
      <div class="removeItemBtn" @click="removeItem()"></div>
    </td>
  </tr>
</template>

<script>
import Currency from '@models/currency'
import BillItemNameInput from './partials/BillItemNameInput.vue'
import BillItemIdNumberInput from './partials/BillItemIdNumberInput.vue'
import BillItemCostInput from './partials/BillItemCostInput.vue'
import BillItemQtyInput from './partials/BillItemQtyInput.vue'

function mapProps(props) {
  const mappedProps = {}

  props.forEach((prop) => {
    mappedProps[prop] = {
      get() {
        return this.value[prop]
      },

      set(value) {
        this.value[prop] = value
      }
    }
  })

  return mappedProps
}

export default {
  components: {
    BillItemNameInput,
    BillItemIdNumberInput,
    BillItemCostInput,
    BillItemQtyInput
  },

  props: {
    value: {
      type: Object
    },
    index: {
      type: Number
    },
    headers: {
      type: Array
    },
    currency: {
      type: Currency
    }
  },

  data() {
    return {
      edit: {
        name: false,
        identification_number: false,
        qty: false,
        cost: false
      }
    }
  },

  computed: {
    ...mapProps([
      'product_uuid',
      'name',
      'identification_number',
      'qty',
      'cost'
    ])
  },

  methods: {
    selectItemProduct(uuid) {
      this.stopEditName()

      if (!uuid) {
        this.product_uuid = uuid
        return
      }

      const product = this.products.find((product) => product.uuid === uuid)

      this.product_uuid = uuid
      this.name = product.name
      this.identification_number = product.identificationNumber
      this.cost = product.price.getIn(this.currency)
      this.qty = 1
    },

    getTD(row, column) {
      return `.billItemRow:nth-child(${row + 1}) td:nth-child(${column + 1})`
    },

    editProp(prop) {
      this.edit[prop] = true
      this.$forceUpdate()
    },

    stopEditName() {
      this.edit.name = false
    },

    stopEditIdNumber() {
      this.edit.identification_number = false
    },

    stopEditCost() {
      this.edit.cost = false
    },

    stopEditQty() {
      this.edit.qty = false
    },

    removeItem() {
      this.$emit('remove')
    }
  }
}
</script>

<style lang="scss">
.billItemRow {
  td {
    position: relative;
  }
}

.tooltip__content {
  transform: translateY(-15px);
  opacity: 1 !important;

  .input-group__details {
    height: 6px;
    min-height: 6px;
    padding: 0 !important;
  }
}

.removeItemBtn {
  display: none;
}

tr:hover {
  .removeItemBtn {
    position: absolute;
    display: block;
    top: 9px;
    right: 17px;
    padding: 15px;
    cursor: pointer;
    &::before {
      position: absolute;
      content: '';
      background: url(../../assets/icons/cross.svg) no-repeat;
      background-size: contain;
      width: 12px;
      height: 12px;
      top: 9px;
      left: 9px;
    }
  }
}
</style>