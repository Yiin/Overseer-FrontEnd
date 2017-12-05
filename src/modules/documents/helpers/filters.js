import store from '@/store'

export const SELECTED_COMPANY_ITEMS = (document) => {
  if (typeof document.company === 'undefined') {
    /**
     * Company is undefined when we are filtering employees
     * and some of them are not visible to us, e.g. they
     * were moved to another company.
     */
    return false
  }
  return 'company' in document && document.company.uuid === store.state.auth.user.company.uuid
}
