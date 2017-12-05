<template lang="pug">
  cm-item(
    v-bind='$attrs'
    v-on='$listeners'
    :item='item'
  )
    v-list-tile(avatar)
      v-list-tile-content(class='limitWidth', :title='title')
        v-list-tile-title {{ action }} by {{ who }}
        v-list-tile-sub-title {{ date }} at {{ time }}
</template>

<script>
import S from 'string'
import ContextMenuItemMixin from '@/components/contextmenu/context-menu-item-mixin'

export default {
  mixins: [
    ContextMenuItemMixin
  ],

  computed: {
    title() {
      return `${this.action} by ${this.who} on ${this.date} at ${this.time}`
    },

    activity() {
      return this.item.props.activity
    },

    action() {
      return S(this.activity.action).capitalize().s
    },

    who() {
      return this.activity.user
        ? this.activity.user.getFullName()
        : 'System'
    },

    date() {
      return this.activity.timestamp.format('MMM D, YYYY')
    },

    time() {
      return this.activity.timestamp.format('h:mma')
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