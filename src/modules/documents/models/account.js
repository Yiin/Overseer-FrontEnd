import Model from './model'

class Account extends Model {
  static create(data) {
    return new Account({
      uuid: data.uuid,
      siteAddress: data.site_address,
      name: data.name
    })
  }
}

export default Account
