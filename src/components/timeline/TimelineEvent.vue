<template lang="pug">
  .event(:class='eventClasses')
    .eventDate {{ event.timestamp.format('MMM D') }}
    .eventIcon
      i.sidebar-icon(:class='iconClass')
    .eventTitle
      timeline-event-title(:event='event')
    .eventContent
      timeline-event-summary(:event='event')
    .eventMeta {{ event.timestamp.format('h:mma') }}
</template>

<script>
import TimelineEventTitle from './TimelineEventTitle.vue'
import TimelineEventSummary from './TimelineEventSummary.vue'
import { editDocument } from '@/modules/documents/actions'
import Event from '@/modules/documents/models/event'

export default {
  components: {
    TimelineEventTitle,
    TimelineEventSummary
  },

  props: {
    event: {
      type: Event,
      required: true
    }
  },

  computed: {
    eventClasses() {
      return [
        `event--c-${this.event.colorIndex}`, {
          'event--top-of-the-day': this.event.topOfTheDay,
          'event--bottom-of-the-day': this.event.bottomOfTheDay
        }
      ]
    },

    iconClass() {
      switch (this.event.documentType) {
      case 'employee': return ['sidebar-icon--personnel']
      }
      return [`sidebar-icon--${this.event.documentType}s`]
    }
  },

  methods: {
    editDocument(...args) {
      return editDocument(...args)
    }
  }
}
</script>