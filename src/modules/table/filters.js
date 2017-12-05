import moment from 'moment'
import Statuses from '@/modules/documents/statuses'
const _ = require('lodash')

/**
 * Status filters
 */
export const IsActiveFilter = {
  scope: 'status',
  name: 'active',
  placeholder: 'filters.active',
  filter: function (document) {
    return Statuses.generic.active.meetsCondition(document)
  }
}

export const IsArchivedFilter = {
  scope: 'status',
  name: 'archived',
  placeholder: 'filters.archived',
  filter: function (document) {
    return Statuses.generic.archived.meetsCondition(document)
  }
}

export const IsDeletedFilter = {
  scope: 'status',
  name: 'deleted',
  placeholder: 'filters.deleted',
  filter: function (document) {
    return Statuses.generic.deleted.meetsCondition(document)
  }
}

/**
 * Vat Checker filters
 */
export const VatVerifiedFilter = {
  scope: 'vat',
  name: 'vat_verified',
  placeholder: 'filters.vat_verified',
  filter: function (document) {
    return document.vat.getLatestInfo().status === 'valid'
  }
}

export const VatPendingFilter = {
  scope: 'vat',
  name: 'vat_pending',
  placeholder: 'filters.vat_pending',
  filter: function (document) {
    return document.vat.getLatestInfo().status === 'pending'
  }
}

export const VatInvalidFilter = {
  scope: 'vat',
  name: 'vat_invalid',
  placeholder: 'filters.vat_invalid',
  filter: function (document) {
    return document.vat.getLatestInfo().status === 'invalid'
  }
}

/**
 * Product Stock filters
 */
export const IsInStockFilter = {
  scope: 'qty',
  name: 'in_stock',
  placeholder: 'filters.in_stock',
  filter: function (document) {
    return document.qty > 0
  }
}

export const IsOutOfStockFilter = {
  scope: 'qty',
  name: 'out_of_stock',
  placeholder: 'filters.out_of_stock',
  filter: function (document) {
    return document.qty < 0 || document.qty === 0
  }
}

export const IsServiceFilter = {
  scope: 'qty',
  name: 'services',
  placeholder: 'filters.services',
  filter: function (document) {
    return document.qty === null
  }
}

/**
 * Invoice Status filters
 */
export const IsDraftFilter = {
  scope: 'invoice_status',
  name: 'draft',
  placeholder: 'filters.draft',
  filter: function (document) {
    return Statuses.invoice.draft.meetsCondition(document)
  }
}

export const IsPendingFilter = {
  scope: 'invoice_status',
  name: 'pending',
  placeholder: 'filters.pending',
  filter: function (document) {
    return Statuses.invoice.pending.meetsCondition(document)
  }
}

export const IsSentFilter = {
  scope: 'invoice_status',
  name: 'sent',
  placeholder: 'filters.sent',
  filter: function (document) {
    return Statuses.invoice.sent.meetsCondition(document)
  }
}

export const IsViewedFilter = {
  scope: 'invoice_status',
  name: 'viewed',
  placeholder: 'filters.viewed',
  filter: function (document) {
    return Statuses.invoice.viewed.meetsCondition(document)
  }
}

export const IsPartialFilter = {
  scope: 'invoice_status',
  name: 'partial',
  placeholder: 'filters.partial',
  filter: function (document) {
    return Statuses.invoice.partial.meetsCondition(document)
  }
}

export const IsPaidFilter = {
  scope: 'invoice_status',
  name: 'paid',
  placeholder: 'filters.paid',
  filter: function (document) {
    return Statuses.invoice.paid.meetsCondition(document)
  }
}

export const IsOverdueFilter = {
  scope: 'invoice_status',
  name: 'overdue',
  placeholder: 'filters.overdue',
  filter: function (document) {
    return Statuses.invoice.overdue.meetsCondition(document)
  }
}

/**
 * Quote Status filters
 */
export const IsQuoteDraftFilter = {
  scope: 'quote_status',
  name: 'draft',
  placeholder: 'filters.draft',
  filter: function (document) {
    return Statuses.quote.draft.meetsCondition(document)
  }
}

export const IsQuotePendingFilter = {
  scope: 'quote_status',
  name: 'pending',
  placeholder: 'filters.pending',
  filter: function (document) {
    return Statuses.quote.pending.meetsCondition(document)
  }
}

export const IsQuoteSentFilter = {
  scope: 'quote_status',
  name: 'sent',
  placeholder: 'filters.sent',
  filter: function (document) {
    return Statuses.quote.sent.meetsCondition(document)
  }
}

export const IsQuoteViewedFilter = {
  scope: 'quote_status',
  name: 'viewed',
  placeholder: 'filters.viewed',
  filter: function (document) {
    return Statuses.quote.viewed.meetsCondition(document)
  }
}

export const IsQuoteApprovedFilter = {
  scope: 'quote_status',
  name: 'approved',
  placeholder: 'filters.approved',
  filter: function (document) {
    return Statuses.quote.approved.meetsCondition(document)
  }
}

export const IsQuoteOverdueFilter = {
  scope: 'quote_status',
  name: 'overdue',
  placeholder: 'filters.overdue',
  filter: function (document) {
    return Statuses.quote.overdue.meetsCondition(document)
  }
}

/**
 * Expense filters
 */
export const ExpenseIsLoggedFilter = {
  scope: 'expense_status',
  name: 'logged',
  placeholder: 'filters.logged',
  filter: function (document) {
    return Statuses.expense.logged.meetsCondition(document)
  }
}

export const ExpenseIsInvoicedFilter = {
  scope: 'expense_status',
  name: 'invoiced',
  placeholder: 'filters.invoiced',
  filter: function (document) {
    return Statuses.expense.invoiced.meetsCondition(document)
  }
}

export const ExpenseIsPendingFilter = {
  scope: 'expense_status',
  name: 'pending',
  placeholder: 'filters.pending',
  filter: function (document) {
    return Statuses.expense.pending.meetsCondition(document)
  }
}

export const ExpenseIsSentFilter = {
  scope: 'expense_status',
  name: 'sent',
  placeholder: 'filters.sent',
  filter: function (document) {
    return Statuses.expense.sent.meetsCondition(document)
  }
}

export const ExpenseIsViewedFilter = {
  scope: 'expense_status',
  name: 'viewed',
  placeholder: 'filters.viewed',
  filter: function (document) {
    return Statuses.expense.viewed.meetsCondition(document)
  }
}

export const ExpenseIsPartialFilter = {
  scope: 'expense_status',
  name: 'partial',
  placeholder: 'filters.partial',
  filter: function (document) {
    return Statuses.expense.partial.meetsCondition(document)
  }
}

export const ExpenseIsPaidFilter = {
  scope: 'expense_status',
  name: 'paid',
  placeholder: 'filters.paid',
  filter: function (document) {
    return Statuses.expense.paid.meetsCondition(document)
  }
}

export const ExpenseIsUnpaidFilter = {
  scope: 'expense_status',
  name: 'unpaid',
  placeholder: 'filters.unpaid',
  filter: function (document) {
    return Statuses.expense.unpaid.meetsCondition(document)
  }
}

export const ExpenseIsOverdueFilter = {
  scope: 'expense_status',
  name: 'overdue',
  placeholder: 'filters.overdue',
  filter: function (document) {
    return Statuses.expense.overdue.meetsCondition(document)
  }
}

/**
 * Recurring Invoices filters
 */
export const FrequenciesFilter = {
  scope: 'frequency',
  name: 'frequencies',
  placeholder: 'filters.frequency',
  type: 'list',
  keyName: 'key',
  list: [],
  filter: function (document, value) {
    return document.frequency === value
  },
  make: function (frequencies) {
    return Object.assign({}, this, {
      list: frequencies.map((f) => {
        f.key = f.value + ':' + f.type
        return f
      })
    })
  }
}

export const CountriesFilter = {
  scope: 'countries',
  name: 'countries',
  placeholder: 'filters.country',
  type: 'list',
  keyName: 'id',
  list: [],
  filter: function (document, id) {
    return parseInt(id) === (document.address.country ? parseInt(document.address.country.id) : null)
  },
  make: function (countries) {
    return Object.assign({}, this, {
      list: countries
    })
  }
}

export const CurrenciesFilter = {
  scope: 'currencies',
  name: 'currencies',
  placeholder: 'filters.currency',
  type: 'list',
  keyName: 'code',
  list: [],
  filter: function (document, code) {
    return code === this.filterKeyOf(document)
  },
  filterKeyOf(document) {
    return document.currency.code
  },
  make: function (currencies, options = {}) {
    return Object.assign({}, this, {
      list: currencies
    }, options)
  }
}

export const ClientsFilter = {
  scope: 'clients',
  name: 'clients',
  placeholder: 'filters.clients',
  type: 'list',
  keyName: 'uuid',
  list: [],
  filter: function (document, uuid) {
    return uuid === (document.client ? document.client.uuid : null)
  },
  make: function (clients) {
    return Object.assign({}, this, {
      list: clients
    })
  }
}

export const InvoiceProductsFilter = {
  scope: 'invoice_products',
  name: 'invoice_products',
  placeholder: 'filters.products',
  type: 'list',
  keyName: 'uuid',
  list: [],
  filter: function (document, uuid) {
    return document.items.map((item) => item.product)
      .find((product) => product.uuid === uuid)
  },
  make: function (products) {
    return Object.assign({}, this, {
      list: products
    })
  }
}

export const IsPaymentCompletedFilter = {
  scope: 'payment_status',
  name: 'completed',
  placeholder: 'filters.completed',
  filter: function (document) {
    return Statuses.payment.completed.meetsCondition(document)
  }
}

export const IsRefundedFilter = {
  scope: 'payment_status',
  name: 'refunded',
  placeholder: 'filters.refunded',
  filter: function (document) {
    return Statuses.payment.refunded.meetsCondition(document)
  }
}

export const PaymentMethodsFilter = {
  scope: 'payment_methods',
  name: 'payment_methods',
  placeholder: 'filters.methods',
  type: 'list',
  keyName: 'id',
  list: [],
  filter: function (document, id) {
    if (document.paymentType) {
      return parseInt(document.paymentType.id) === parseInt(id)
    }
    return false
  },
  make: function (paymentTypes) {
    return Object.assign({}, this, {
      list: paymentTypes
    })
  }
}

/**
 * Search By
 */
export const SearchByText = {
  id: 'text',
  type: 'text',
  searchBy: function (document, key, value) {
    const val = typeof key === 'function'
      ? key(document)
      : _.get(document, key)

    return val && val.toLowerCase().indexOf(value.toLowerCase()) > -1
  },
  extend: function (data) {
    return Object.assign({}, this, data)
  }
}

export const SearchByValue = {
  id: 'value',
  type: 'numeric',
  searchBy: function (document, key, value) {
    const val = typeof key === 'function'
      ? key(document)
      : _.get(document, key)

    const higherThanMin = value.from === null || val >= parseFloat(value.from)
    const lowerThanMax = value.to === null || val <= parseFloat(value.to)

    return higherThanMin && lowerThanMax
  },
  extend: function (data) {
    return Object.assign({}, this, data)
  }
}

export const SearchByDate = {
  id: 'date',
  type: 'date',
  searchBy: function (document, key, value) {
    let val = typeof key === 'function'
      ? key(document)
      : _.get(document, key)

    if (!(val instanceof moment)) {
      if (typeof val === 'string') {
        val = moment(val)
      } else if (typeof val.date === 'string') {
        val = moment(val.date)
      } else {
        // you're out of luck baby
      }
    }

    const higherThanMin = !value.from || !value.from.isValid() || val.isSameOrAfter(value.from, 'day')
    const lowerThanMax = !value.to || !value.to.isValid() || val.isSameOrBefore(value.to, 'day')

    return higherThanMin && lowerThanMax
  },
  extend: function (data) {
    return Object.assign({}, this, data)
  }
}

export const SearchByItemsProduct = {
  id: 'items_product_name',
  type: 'text',
  searchBy: function (document, key, value) {
    const val = key
      ? typeof key === 'function'
        ? key(document)
        : _.get(document, key)
      : document

    return !!val.items.map((item) => item.product)
      .find((product) => product.name.toLowerCase().indexOf(value.toLowerCase()) > -1) ||
      !!val.items.find((item) => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
  },
  extend: function (data) {
    return Object.assign({}, this, data)
  }
}
