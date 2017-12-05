<template lang='pug'>
  span
    i(
      v-if="simple"
      :class="icon"
    )

    v-icon(
      v-else-if="material"
    ) {{ icon.name }}

    i(
      v-else-if="custom"
      :class="[icon.class]"
    ) {{ icon.name }}
</template>

<script>
export default {
  props: {
    icon: {
      required: true
    }
  },

  computed: {
    simple() {
      return typeof this.icon === 'string'
    },

    material() {
      return this.icon.type === 'material'
    },

    custom() {
      return 'class' in this.icon
    }
  }
}
</script>