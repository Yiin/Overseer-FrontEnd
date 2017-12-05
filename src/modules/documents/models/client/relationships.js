import store from '@/store'

const ClientRelationships = (superclass) => class extends superclass {
  credits() {
    return store.getters['documents/repositories/credit/AA_ITEMS'].filter((credit) => {
      return credit.client.uuid === this.uuid
    })
  }

  invoices() {
    return store.getters['documents/repositories/invoice/AA_ITEMS'].filter((invoice) => {
      return invoice.client.uuid === this.uuid
    })
  }
}

export default ClientRelationships
