import faker from 'faker'
import BillItem from '../../bill-item'

const HasBillItemsFaker = (superclass) => class extends superclass {
  static fakeItems() {
    return {
      items: Array.from({ length: (faker.random.number() % 10) + 1 }).map(BillItem.fakeData)
    }
  }
}

export default HasBillItemsFaker
