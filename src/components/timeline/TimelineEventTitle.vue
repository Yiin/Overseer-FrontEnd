<template lang="pug">
  span
    template(v-if='isBatch') {{ count }}
    |
    | {{ documentType }} {{ action }}
</template>

<script>
import pluralize from 'pluralize'
import Event from '@models/event'

export default {
  props: {
    event: {
      type: Event,
      required: true
    }
  },

  computed: {
    count() {
      return this.event.activityList.length
    },

    isBatch() {
      return this.count > 1
    },

    documentType() {
      return this.isBatch ? pluralize(this.event.documentType) : this.event.documentType
    },

    action() {
      return this.event.action
    }
  }
}
</script>