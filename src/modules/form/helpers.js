import $store from '@/store'

export const fieldMutator = (formName, field) => {
  if (typeof field === 'object') {
    return {
      get() {
        return field.get($store.state.form[formName].fields[field])
      },
      set(value) {
        $store.commit(`form/${formName}/SET_FIELD_VALUE`, {
          field: field.field,
          value: field.set(value)
        })
      }
    }
  } else {
    return {
      get() {
        return $store.state.form[formName].fields[field]
      },
      set(value) {
        $store.commit(`form/${formName}/SET_FIELD_VALUE`, {
          field,
          value
        })
      }
    }
  }
}
