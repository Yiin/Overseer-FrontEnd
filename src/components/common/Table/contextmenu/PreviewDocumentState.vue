<template lang="pug">
  v-list-tile(avatar)
    v-list-tile-content(class='limitWidth', :title='title')
      v-list-tile-title {{ action }} by {{ item.activity.user.fullName }}
      v-list-tile-sub-title {{ date }} at {{ time }}
</template>

<script>
import S from 'string'

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },

  computed: {
    title() {
      return `${this.action} by ${this.item.activity.user.fullName} on ${this.date} at ${this.time}`
    },

    action() {
      return S(this.item.activity.action).capitalize().s
    },

    date() {
      return this.item.activity.timestamp.format('MMM D, YYYY')
    },

    time() {
      return this.item.activity.timestamp.format('h:mma')
    }
  }
}
</script>

<style>
.limitWidth {
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>