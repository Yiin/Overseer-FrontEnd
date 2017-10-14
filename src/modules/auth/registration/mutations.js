export default {
  RESET_STATE(state) {
    const copy = JSON.parse(JSON.stringify(state.__initial_state))

    for (let key in copy) {
      state[key] = copy[key]
    }
  },

  SET_STEP(state, step) {
    if (step < 0) {
      step = 0
    }
    if (step >= state.steps.length) {
      step = state.steps.length - 1
    }
    state.step = step
  },

  NEXT_STEP(state) {
    if (state.step < state.steps.length - 1) {
      state.step++
    }
  },

  PREV_STEP(state) {
    if (state.step > 0) {
      state.step--
    }
  },

  UPDATE_FIELD_STATE(state, { field, fieldState }) {
    state.fields[field].state = fieldState
  },

  UPDATE_FIELD_ERRORS(state, { field, errors }) {
    state.fields[field].errors = errors
  },

  UPDATE_FIELD(state, { field, value }) {
    state.fields[field].value = value
  },

  ADD_VALIDATION_PROMISE(state, promise) {
    state.validationPromises.push(promise)
  },

  REMOVE_VALIDATION_PROMISE(state, promise) {
    state.validationPromises = state.validationPromises.filter((p) => p !== promise)
  }
}
