const HasRolesMethods = (superclass) => class extends superclass {

  /**
   * Get first visible role that this employee has
   */
  getRoleName() {
    const role = this.roles.find((role) => role.name)

    if (!role) {
      return '-'
    }
    return role.name
  }

  /**
   * Adds role if it's not present.
   */
  addRoleOrDoNothing(role) {
    // check if role already exist
    const existingRole = this.roles.find((userRole) => userRole.uuid === role.uuid)

    if (existingRole) {
      return
    }

    this.roles.push(role)
  }
}

export default HasRolesMethods
