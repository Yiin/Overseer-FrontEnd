
const EmployeeMethods = (superclass) => class extends superclass {

  /**
   * Check if this employee is assigned to given
   * company.
   */
  isInCompany(uuid) {
    if (typeof uuid === 'object') {
      uuid = uuid.uuid
    }

    if (!this.auth) {
      return this.company.uuid === uuid
    }
    return this.auth.isInCompany(uuid)
  }

  /**
   * Check if this employee is current authenticated user
   */
  isMe() {
    return this.user && this.user.isMe()
  }

  /**
   * Get profile picture
   *
   * Use placeholder if employee doesnt have any picture set.
   */
  getPicture() {
    return this.profilePicture || require('@/assets/images/placeholders/profile-placeholder.svg')
  }

  getRoleName() {
    return this.user ? this.user.getRoleName() : '-'
  }
}

export default EmployeeMethods
