import i18n from '@/i18n'

import {
  patchDocument
} from '@/modules/documents/actions'

/**
 * Refund payment
 */
export const checkForCompletedPaymentConflict = (payment) => {
  const conflicts = []

  if (payment.refunded <= 0) {
    conflicts.push({
      type: 'warning',
      message: i18n.t('text.payment_will_be_refunded'),
      solve() {
        return patchDocument(payment, 'payment', { refunded: payment.amount.get() - payment.refunded.get() })
      }
    })
  }

  return conflicts
}

/**
 * Un-refund payment
 */
export const checkForRefundedPaymentConflict = (payment) => {
  const conflicts = []

  if (payment.refunded.get() > 0) {
    conflicts.push({
      type: 'warning',
      message: i18n.t('text.payment_will_be_no_longer_refunded'),
      solve() {
        return patchDocument(payment, 'payment', { refunded: -payment.refunded.get() })
      }
    })
  }

  return conflicts
}
