<template lang="pug">
  span
    a(href='/' @click.prevent='') {{ userName }}
    |
    | {{ action }}
    |
    template(v-if='isBatch')
      a(href='/' @click.prevent='listMenu = true' ref='listMenuActivator') {{ count }}
      v-menu(
        :activator='$refs.listMenuActivator'
        v-model='listMenu'
        offset-x
        :close-on-content-click='false'
      )
        v-card
          v-list
            v-list-tile
              v-list-tile-content
                v-list-tile-title List of {{ action }} {{ documentType }}
          v-divider
          v-list(
            class='documentsList'
            :class="{ 'scrollable': documents.length > 5 }"
          )
            v-list-tile(
              v-for='document in documents'
              :key='document.uuid'
              @click='edit(document)'
            )
              v-list-tile-title {{ document.getTitle() }}
      |
      | {{ documentType }}

    template(v-else)
      | {{ documentType }}
      |
      router-link(
        :to='editDocumentLink'
      ) {{ documentTitle }}
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

  data() {
    return {
      listMenu: false
    }
  },

  computed: {
    userName() {
      return this.event.user ? this.event.user.getTitle() : 'System'
    },

    count() {
      return this.event.activityList.length
    },

    isBatch() {
      return this.count > 1
    },

    documentType() {
      return this.isBatch ? pluralize(this.event.documentType) : this.event.documentType
    },

    documents() {
      return this.event.activityList.map((activity) => activity.document.data)
    },

    document() {
      return this.documents[0]
    },

    documentUuid() {
      return this.document.uuid
    },

    documentTitle() {
      return this.document.getTitle()
    },

    action() {
      return this.event.action
    },

    editDocumentLink() {
      return {
        name: `${this.event.documentType}.edit`,
        params: { uuid: this.documentUuid, action: true }
      }
    }
  },
  methods: {
    edit(document) {
      this.listMenu = false

      this.$router.push({
        name: `${this.event.documentType}.edit`,
        params: { uuid: document.uuid, action: true }
      })
    }
  }
}
</script>