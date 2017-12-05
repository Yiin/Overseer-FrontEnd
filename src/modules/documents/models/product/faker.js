import faker from 'faker'

const ProductFaker = (superclass) => class extends superclass {
  static fakeData() {
    return {
      name: faker.commerce.productName(),
      identification_number: faker.finance.account(),
      description: faker.lorem.paragraph(),
      qty: faker.random.number() % 100,
      price: faker.commerce.price() / 10,
      currency_code: faker.random.arrayElement(['EUR', 'USD', 'GBP'])
    }
  }
}

export default ProductFaker
