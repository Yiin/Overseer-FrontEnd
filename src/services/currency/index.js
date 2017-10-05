import store from '@/store'

export function convert(amount, fromId, toId) {
  if (fromId === toId) {
    return amount
  }
  const currencyFrom = store.state.passive.currencies.find((currency) => currency.id === fromId)
  const currencyTo = store.state.passive.currencies.find((currency) => currency.id === toId)

  if (currencyFrom.code !== 'EUR') {
    amount *= currencyFrom.eur_rate
  }

  return amount / currencyTo.eur_rate
}
