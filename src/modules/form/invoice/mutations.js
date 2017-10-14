import FormMutations from '@/modules/form/mutations'

export default FormMutations({
  SET_ITEMS(state, items) {
    state.items = items.map((item) => {
      if (!item.product_uuid) {
        item.product_uuid = item.product ? item.product.uuid || null : null
      }
      if (!item.tax_rate_uuid) {
        item.tax_rate_uuid = item.tax_rate ? item.tax_rate.uuid || null : null
      }
      if (item.product) {
        item.product_name = item.product.name
      }
      return item
    })
  }
})
