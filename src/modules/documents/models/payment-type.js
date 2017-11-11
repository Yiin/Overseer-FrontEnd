import Model from './model'

/**
 * PaymentType model
 */
class PaymentType extends Model {
  static create(data) {
    return new PaymentType({
      id: data.id,
      name: data.name
    })
  }
}

export default PaymentType
