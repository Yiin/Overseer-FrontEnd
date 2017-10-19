import i18n from '@/i18n'
import Statuses from './index'

/**
 * Warn if quote was already sent
 */
export const checkForQuoteMailingConflicts = (quote) => {
  const conflicts = []

  if (Statuses.quote.sent.meetsCondition(quote)) {
    conflicts.push({
      type: 'warning',
      message: i18n.t('text.quote_will_be_queued_to_be_sent_again')
    })
  }
  return conflicts
}
