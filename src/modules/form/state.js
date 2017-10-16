export function parseDefinition(definition) {
  if (typeof definition.data !== 'object') {
    return {}
  }

  let stateData = {
    __name: definition.name,
    tabs: {}
  }

  for (let key in definition.data) {
    const prop = definition.data[key].name || key

    stateData[prop] = definition.data[key].default

    if (typeof definition.data[key].modal === 'object') {
      const tabIndex = definition.data[key].modal.tabIndex
      if (typeof stateData.tabs[tabIndex] === 'undefined') {
        stateData.tabs[tabIndex] = []
      }
      stateData.tabs[tabIndex].push(prop)
    }
  }

  return stateData
}

export default (name, state = {}) => {
  state = typeof name === 'object' ? name : state

  if (typeof state.validationErrors === 'undefined') {
    state.validationErrors = {}
  }
  for (let field in state.fields) {
    state.validationErrors[field] = []
  }

  return JSON.parse(JSON.stringify(Object.assign({
    __name: typeof name === 'string' ? name : '',
    __preview: false,

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
