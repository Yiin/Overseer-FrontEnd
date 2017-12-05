const VendorMethods = (superclass) => class extends superclass {

  getPrimaryPhoneNumber() {
    return this.contacts.length && this.contacts[0].phone || ''
  }
}

export default VendorMethods
