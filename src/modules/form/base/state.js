export default (name, state = {}) => {
  state = typeof name === 'object' ? name : state

  if (typeof state.validationErrors === 'undefined') {
    state.validationErrors = {}
  }
  for (let field in state.fields) {
    state.validationErrors[field] = []
  }

  return JSON.parse(JSON.stringify(Object.assign({
    _name: typeof name === 'string' ? name : '',
    _preview: false,

    /**
     * Current revision
     */
    activity: null,

    /**
     * Form fields
     */
    fields: {},

    /**
     * Validation errors by field name
     */
    validationErrors: {},

    /**
     * Currently forms are inside modal tabs.
     * This array contains information, in which
     * tab form field is located, so when validation
     * of that field fails, we can open corresponding
     * tab so user can correct the field.
     */
    tabs: [],

    /**
     * Form events listeners
     */
    listeners: {
      create: [],
      update: []
    }
  }, state)))
}
