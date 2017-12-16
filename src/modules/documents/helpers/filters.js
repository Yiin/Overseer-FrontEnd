import store from '@/store'

export const SELECTED_COMPANY_ITEMS = (document) => {
  const companyUuid = store.state.auth.user.company.uuid

  /**
   * Basic documents like clients, invoices, payments.
   *
   * Note:
   * document.company is undefined when we are filtering employees
   * and some of them are not visible to us, e.g. they
   * were moved to another company.
   */
  if ('company' in document && document.company && document.company.uuid === companyUuid) {
    return true
  }

  /**
   * Roles
   */
  if ('roleable' in document && document.roleable && document.roleable.uuid === companyUuid) {
    return true
  }

  return false
}
