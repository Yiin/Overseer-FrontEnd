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

// export default transformForm

export default (state = {}) => JSON.parse(JSON.stringify(Object.assign({
  __preview: false,
  listeners: {
    create: [],
    update: []
  },
  errors: {}
}, state)))
