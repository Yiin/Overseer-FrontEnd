import numeral from 'numeral'
import Currency from '@/services/currency'

export const currencySymbol = (val) => {
  return val || Currency.DEFAULT_SYMBOL
}

export const currency = (val) => {
  return numeral(parseFloat(typeof val === 'object' ? val.value : val)).format('0,0.00')
}
