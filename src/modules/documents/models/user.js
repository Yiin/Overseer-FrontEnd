import Model from './model'

class User extends Model {
  static create(data) {
    return new User({
      uuid: data.uuid,
      fullName: data.full_name,
      email: data.email
    })
  }
}

export default User
