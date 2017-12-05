<template>
  <div class="billItemsList">
    <table>
      <tbody style="border-collapse: collapse">
        <tr class="newItemRow">
          <td class="newItemField" :style="{ width: newItemHeaders[0].width }">
            <form-dropdown-input
              vuetify
              placeholder="Select item"
              :items="products"
              @input="selectItemProduct"
              @input-custom="updateItemName"
              allow-custom
              dense
            >
              <v-list-tile slot="option" slot-scope="{ item, parent }" @click="parent.select(item)">
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ item.name }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    <template v-if="item.identification_number">
                      {{ item.identification_number }} |
                    </template>
                    x {{ item.qty }}
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </form-dropdown-input>
          </td>
          <td class="newItemField" :style="{ width: newItemHeaders[1].width }">
            <v-text-field
              label="ID Number"
              v-model="item.identification_number"
            ></v-text-field>
          </td>
          <td class="newItemField" :style="{ width: newItemHeaders[2].width }">
            <v-text-field
              label="Cost"
              v-model="item.cost"
              :prefix="currency.symbol"
            ></v-text-field>
          </td>
          <td class="newItemField" :style="{ width: newItemHeaders[3].width }">
            <v-text-field
              label="Quantity"
              v-model="item.qty"
            ></v-text-field>
          </td>
          <td
            class="text-xs-right"
            :style="{
              width: newItemHeaders[4].width,
              'vertical-align': 'bottom',
              'padding-bottom': '1px'
            }">
            <div class="button button--create" @click="addItem">
              Add item
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <v-data-table
      class="datatable--bill-items"
      :headers="headers"
      :items="items"
      item-key="name"
      hide-actions
    >
      <template slot="headers" slot-scope="{ headers }">
        <tr>
          <th
            v-for="header in headers"
            :key="header.text"
            class="column"
            :class="[ 'text-xs-' + header.align ]"
            :style="{ 'width': header.width }"
          >
            {{ header.text }}
          </th>
        </tr>
      </template>
      <template slot="items" slot-scope="{ item, index }">
        <bill-items-list-item
          v-model="item"
          :index="index"
          :headers="headers"
          :currency="currency"
          @remove="remove(index)"
        ></bill-items-list-item>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Currency from '@/modules/documents/models/currency'
import BillItemsListItem from './BillItemsListItem.vue'
import FormFormattedInput from '@/components/common/Form/FormFormattedInput.vue'

export default {
  components: {
    BillItemsListItem,
    FormFormattedInput
  },

  props: {
    value: {},
    currency: {
      type: Currency
    },
    addItemForm: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      newItemHeaders: [
        { width: '30%' },
        { width: '27%' },
        { width: '18%' },
        { width: '15%' },
        { width: '10%' }
      ],
      headers: [
        { sortable: false, width: '26%', text: 'Name', align: 'left' },
        { sortable: false, width: '25%', text: 'ID Number', align: 'left' },
        { sortable: false, width: '16%', text: 'Cost', align: 'left' },
        { sortable: false, width: '13%', text: 'Qty', align: 'left' },
        { sortable: false, width: '20%', text: 'Total', align: 'left' }
      ],
      items: this.value.slice(),
      item: {
        product_uuid: null,
        name: '',
        identification_number: '',
        cost: '',
        qty: ''
      }
    }
  },

  computed: {
    products() {
      return this.$store.getters['documents/repositories/product/ACTIVE_COMPANY_ITEMS'].map((product) => {
        return Object.assign({
          text: product.name,
          value: product.uuid,
          editing: false
        }, product)
      })
    }
  },

  watch: {
    items: {
      handler: function (items) {
        this.$emit('input', items)
      },
      deep: true
    }
  },

  methods: {
    addItem() {
      if (!this.item.name) {
        return
      }
      if (Number(this.item.cost) <= 0) {
        return
      }
      if (Number(this.item.qty) <= 0) {
        return
      }
      this.items.push(Object.assign({}, this.item))

      // this.item = {
      //   product_uuid: null,
      //   name: '',
      //   identification_number: '',
      //   cost: 0,
      //   qty: 1
      // }
    },

    updateItemName(name) {
      this.item.name = name
    },

    selectItemProduct(uuid) {
      const product = this.products.find((product) => product.uuid === uuid)

      this.item.product_uuid = uuid
      this.item.name = product.name
      this.item.identification_number = product.identificationNumber
      this.item.cost = product.price.getIn(this.currency)
      this.item.qty = 1
    },

    remove(index) {
      this.items.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.newItemRow {
  .button--create {
    min-width: 106px;
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    box-shadow: none;
  }
  .form__input--label-left {
    &::before {
      font-size: 14px;
      height: 35px;
      width: 40px;
    }
    .form__input {
      padding-left: 40px;
    }
  }
  .input-group__details {
    min-height: 1px;
    padding: 0 !important;
  }
  .dropdown__input-wrapper::after {
    top: 32px;
    right: 10px;
  }
  .dropdown--open .dropdown__input-wrapper::after {
    top: 27px;
  }
  .dropdown__options-wrapper:not(.dropdown__options-wrapper--reversed) {
    top: 48px;
  }
}

.newItemField {
  max-width: 0;
  > .input-group,
  > .dropdown {
    width: 90%;
  }
  .form__input, .dropdown__input {
    line-height: initial;
    height: auto;
    padding: 8px 15px;
    font-size: 14px;
  }
}

.datatable--bill-items table {
    line-height: initial;

    tbody {
        display: block;
        max-height: 300px;
        overflow: auto;
    }

    tbody::-webkit-scrollbar-track
    {
        margin-top: 6px;
        margin-bottom: 6px;

        border-radius: 5px;
        background-color: $color-wild-sand;
    }

    tbody::-webkit-scrollbar
    {
        width: 6px;
        height: 6px;

        background-color: transparent;
    }

    tbody::-webkit-scrollbar-thumb
    {
        border-radius: 5px;
        background-color: $color-main;
    }
    thead th {
      font-size: 14px;
    }

    tr {
        display: table;
        width: 100%;
        table-layout: fixed;
    }
}

.menu__content.small-dialog__content {
  overflow: visible;
}

.itemsList {
    max-height: 400px;
    overflow: auto;
    padding-right: 6px;
    &.scrollable {
      padding-right: 0;
    }
}

.billItemsList {
  .placeholder:not(.placeholder--line) {
    margin: 20px auto;
  }
}
</style>