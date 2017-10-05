<template>
  <div class = "form">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'form-container',

  props: {
    name: {
      type: String,
      required: true
    }
  },

  mounted() {
    this.$on('input:field', ({ name, value }) => {
      console.log('wtf', name, value)
      // find index if array
      let matches = name.match(/(.*)\[(.*?)\]/)

      if (matches && matches.length >= 3) {
        const field = matches[1]
        const index = matches[2]

        this.$store.commit(`form/${this.name}/SET_${field.toUpperCase()}`, {
          value,
          data: index
        })
        return
      }
      if (typeof value === 'string') {
        let [nameA, nameB] = name.split(':')
        let [valueA, valueB] = value.split(':')

        // key1:key2 = val1:val2
        if (nameB && valueB) {
          this.$store.dispatch(`form/${this.name}/UPDATE_FIELD_VALUE`, {
            field: nameA,
            value: valueA
          })

          this.$store.dispatch(`form/${this.name}/UPDATE_FIELD_VALUE`, {
            field: nameB,
            value: valueB
          })
          return
        }
      }
      if (name[0] === '$') {
        this.$store.commit(`form/${this.name}/SET_${name.slice(1).toUpperCase()}`, value)
        return
      }
      this.$store.dispatch(`form/${this.name}/UPDATE_FIELD_VALUE`, {
        field: name,
        value
      })
    })
  },

  updated() {
    this.passDataToFields(this.$slots.default)
  },

  methods: {
    passDataToFields(slots) {
      if (slots && slots.length) {
        slots.forEach((slot) => {
          if (slot.tag && slot.tag.indexOf('form-field') > -1) {
            slot.componentInstance.stateName = this.name
          } else {
            if (slot && slot.componentInstance && slot.componentInstance.$slots && slot.componentInstance.$slots.default) {
              this.passDataToFields.bind(this)(slot.componentInstance.$slots.default)
            }
          }
        })
      }
    }
  }
}
</script>