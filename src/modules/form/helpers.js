import $store from '@/store'

export const fieldMutator = (formName, fieldName) => {
  return {
    get() {
      return $store.state.form[formName].fields[fieldName]
    },
    set(value) {
      $store.commit(`form/${formName}/SET_FIELD_VALUE`, {
        field: fieldName,
        value
      })
    }
  }
}
