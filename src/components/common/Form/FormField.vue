<template>
  <div class = "form__input-wrapper">

    <label class = "form__label">
      {{ label }}

      <span v-for = "(message, key) in errors"
            class = "form__input-error"
      >
        <template v-if="Array.isArray(catchErrors) ? catchErrors.indexOf(key) > -1 : key === catchErrors">
          {{ $t(message) }}
        </template>
      </span>
    </label>
    <slot></slot>

  </div>
</template>

<script>
export default {
  name: 'form-field',

  props: {
    label: {
      type: String,
      default: undefined
    },
    catchErrors: {
      type: [String, Array],
      default: undefined
    }
  },

  data() {
    return {
      stateName: ''
    }
  },

  computed: {
    errors() {
      if (!this.stateName) {
        return {}
      }
      return this.$store.state.form[this.stateName].errors
    },

    inputs() {
      return !this.$slots.default ? [] : this.$slots.default
        .filter((el) => el.tag && el.tag.indexOf('input') > -1 && el.tag.indexOf('form-inputs-group') < 0)
        .map((el) => el.componentInstance)
    },

    groups() {
      return !this.$slots.default ? [] : this.$slots.default
        .filter((el) => el.tag && el.tag.indexOf('form-inputs-group') > -1)
        .map((el) => el.componentInstance)
    }
  },

  mounted() {
    this.groups.forEach((group) => {
      group.inputs.forEach((input) => {
        input.$on('input', this.handleInput.bind(this, input.name))
      })
    })

    this.inputs.forEach((input) => {
      input.$on('input', this.handleInput.bind(this, input.name))
    })
  },

  destroyed() {
    this.groups.forEach((group) => {
      group.inputs.forEach((input) => {
        input.$off('input', this.handleInput.bind(this, input.name))
      })
    })

    this.inputs.forEach((input) => {
      input.$off('input', this.handleInput.bind(this, input.name))
    })
  },

  methods: {
    handleInput(name, value) {
      this.$emit('input', {
        name,
        value
      })
    }
  }
}
</script>