import { mix } from 'mixwith'
import store from '@/store'
import Document from '../document'
import BelongsToCompany from '../concerns/belongs-to-company'
import ClientSchema from './schema'
import ClientMethods from './methods'
import ClientRelationships from './relationships'
import ClientFaker from './faker'

/**
 * Client model
 */
class Client extends mix(Document).with(ClientSchema, ClientMethods, ClientRelationships, ClientFaker, BelongsToCompany) {
  constructor(data) {
    super(data)

    /**
     * Watch credits and invoices so we can update client balance if any of these relationships changes.
     *
     * Note:
     * Balance wont be calculated correctly, if user misses permission to see some of the clients
     * relationships.
     */
    store.watch(() => store.getters['documents/repositories/credit/AVAILABLE_ITEMS'].filter((credit) => {
      return credit.client.uuid === this.uuid
    }), this.updateBalance.bind(this))

    store.watch(() => store.getters['documents/repositories/invoice/AVAILABLE_ITEMS'].filter((invoice) => {
      return invoice.client.uuid === this.uuid
    }), this.updateBalance.bind(this))
  }

  static create(data) {
    return new this(this.parse(data))
  }

  updateBalance() {
    this.balance.amount = this.credits().reduce((sum, credit) => {
      return sum + credit.balance.getIn(this.currency)
    }, this.invoices().reduce((sum, invoice) => {
      return sum + (invoice.amount.getIn(this.currency) - invoice.paidIn.getIn(this.currency))
    }, 0))
  }
}

export default Client
