import BillItem from '../../bill-item'

const HasBillItemsSchema = (superclass) => class extends superclass {

  static parse(data) {
    return Object.assign(super.parse(data), {
      items: (data.items.map(this._setCurrency.bind(null, data)) || []).map(BillItem.create, BillItem)
    })
  }

  static _setCurrency(data, item) {
    return Object.assign({
      currency_code: data.currency_code
    }, item)
  }

  serialize(options = {}) {
    return Object.assign(super.serialize(options), {
      items: this.items.map((item) => item.serialize(options))
    })
  }
}

export default HasBillItemsSchema
