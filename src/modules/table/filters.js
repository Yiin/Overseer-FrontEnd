import moment from 'moment'
const _ = require('lodash')

/**
 * Status filters
 */
export const IsActiveFilter = {
  scope: 'status',
  name: 'active',
  placeholder: 'filters.active',
  filter: function (document) {
    return !document.deleted_at && !document.archived_at
  }
}

export const IsArchivedFilter = {
  scope: 'status',
  name: 'archived',
  placeholder: 'filters.archived',
  filter: function (document) {
    return document.archived_at
  }
}

export const IsDeletedFilter = {
  scope: 'status',
  name: 'deleted',
  placeholder: 'filters.deleted',
  filter: function (document) {
    return document.deleted_at
  }
}

/**
 * Vat Checker filters
 */
export const VatVerifiedFilter = {
  name: 'vat_verified',
  placeholder: 'filters.vat_verified',
  filter: function (document) {
    return document.vat_status === 'verified'
  }
}

export const VatPendingFilter = {
  name: 'vat_pending',
  placeholder: 'filters.vat_pending',
  filter: function (document) {
    return document.vat_status === null || document.vat_status === 'pending'
  }
}

export const VatInvalidFilter = {
  name: 'vat_invalid',
  placeholder: 'filters.vat_invalid',
  filter: function (document) {
    return document.vat_status === 'invalid'
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
    return document.status === 'draft'
  }
}

export const IsSentFilter = {
  scope: 'invoice_status',
  name: 'sent',
  placeholder: 'filters.sent',
  filter: function (document) {
    return document.status === 'sent'
  }
}

export const IsViewedFilter = {
  scope: 'invoice_status',
  name: 'viewed',
  placeholder: 'filters.viewed',
  filter: function (document) {
    return document.status === 'viewed'
  }
}

export const IsApprovedFilter = {
  scope: 'invoice_status',
  name: 'approved',
  placeholder: 'filters.approved',
  filter: function (document) {
    return document.status === 'approved'
  }
}

export const IsPartialFilter = {
  scope: 'invoice_status',
  name: 'partial',
  placeholder: 'filters.partial',
  filter: function (document) {
    return document.status === 'partial'
  }
}

export const IsPaidFilter = {
  scope: 'invoice_status',
  name: 'paid',
  placeholder: 'filters.paid',
  filter: function (document) {
    return document.status === 'paid'
  }
}

export const IsPendingFilter = {
  scope: 'invoice_status',
  name: 'pending',
  placeholder: 'filters.pending',
  filter: function (document) {
    return document.status === 'pending'
  }
}

export const IsOverdueFilter = {
  scope: 'invoice_status',
  name: 'overdue',
  placeholder: 'filters.overdue',
  filter: function (document) {
    return document.due_date && moment().isAfter(document.due_date)
  }
}

export const ExpenseIsInvoicedFilter = {
  scope: 'expense_status',
  name: 'invoiced',
  placeholder: 'filters.invoiced',
  filter: function (document) {
    return document.invoice && document.invoice.paid_in < document.invoice.amount
  }
}

export const ExpenseIsPendingFilter = {
  scope: 'expense_status',
  name: 'pending',
  placeholder: 'filters.pending',
  filter: function (document) {
    return document.invoice === null && document.should_be_invoiced
  }
}

export const ExpenseIsPaidFilter = {
  scope: 'expense_status',
  name: 'paid',
  placeholder: 'filters.paid',
  filter: function (document) {
    return document.invoice && document.invoice.paid_in >= document.invoice.amount
  }
}

export const ExpenseIsLoggedFilter = {
  scope: 'expense_status',
  name: 'logged',
  placeholder: 'filters.logged',
  filter: function (document) {
    return document.invoice === null && !document.should_be_invoiced
  }
}

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
  placeholder: 'filters.countries',
  type: 'list',
  keyName: 'id',
  list: [],
  filter: function (document, id) {
    return parseInt(id) === (document.country ? document.country.id : null)
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
  placeholder: 'filters.currencies',
  type: 'list',
  keyName: 'id',
  list: [],
  filter: function (document, id) {
    return parseInt(id) === (document.currency ? document.currency.id : null)
  },
  make: function (currencies) {
    return Object.assign({}, this, {
      list: currencies
    })
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
    return document.refunded === 0
  }
}

export const IsRefundedFilter = {
  scope: 'payment_status',
  name: 'refunded',
  placeholder: 'filters.refunded',
  filter: function (document) {
    return document.refunded !== 0
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
    return parseInt(document.method_id) === parseInt(id)
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
    const val = _.get(document, key)
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
    const val = _.get(document, key)

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
    const val = _.get(document, key)

    const higherThanMin = value.start === null || moment(val.date).isSameOrAfter(moment(value.start), 'day')
    const lowerThanMax = value.end === null || moment(val.date).isSameOrBefore(moment(value.end), 'day')

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
    const val = key ? _.get(document, key) : document
    return !!val.items.map((item) => item.product)
      .find((product) => product.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
  },
  extend: function (data) {
    return Object.assign({}, this, data)
  }
}
