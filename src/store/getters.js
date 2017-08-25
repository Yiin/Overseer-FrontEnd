/**
 * Fuck is this for
 */
export const user = (state) => state.user

export const productsTable = (state) => {
  const { page, pages, amount } = state.lists.products
  return { page, pages, amount }
}
