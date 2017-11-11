<template lang="pug">
  .timeline(class='scrollable')
    .timelineItem(v-for='(events, date) in timeline')
      .year {{ date }}
      .events
        .event(
          v-for='event in events'
          :class=`[\`event--c-\${event.colorIndex}\`, {
            "event--top-of-the-day": event.topOfTheDay,
            "event--bottom-of-the-day": event.bottomOfTheDay
          }]`
        )
          .eventDate {{ event.timestamp.format('MMM D') }}
          .eventIcon
            i.sidebar-icon(:class='[`sidebar-icon--${event.documentType}s`]')
          .eventTitle
            event-title(:event='event')
          .eventContent
            event-summary(:event='event')
          .eventMeta {{ event.timestamp.format('h:mma') }}
</template>

<script>
import EventTitle from '@/components/timeline/EventTitle.vue'
import EventSummary from '@/components/timeline/EventSummary.vue'
import Event from '@/modules/documents/models/event'
import { editDocument } from '@/modules/documents/actions'

export default {
  components: {
    EventTitle,
    EventSummary
  },

  props: {
    activityList: {
      required: true
    }
  },

  computed: {
    timeline() {
      const items = {}

      let prevEvent = null

      this.activityList.sort((a, b) => {
        return b.id - a.id
      }).forEach((activity, index, arr) => {
        const key = activity.timestamp.format('MMMM, YYYY')

        if (!(key in items)) {
          items[key] = []
        }

        const event = this.makeEvent(activity, prevEvent)

        if (event) {
          if (!prevEvent || !event.timestamp.isSame(prevEvent.timestamp, 'day')) {
            if (prevEvent) {
              prevEvent.bottomOfTheDay = true
            }
            event.topOfTheDay = true
          }
          if (index + 1 === arr.length) {
            event.bottomOfTheDay = true
          }

          items[key].push(event)

          prevEvent = event
        }
      })

      return items
    }
  },

  methods: {
    makeEvent(activity, lastEvent) {
      if (lastEvent && lastEvent.timestamp.unix() === activity.timestamp.unix() &&
          lastEvent.action === activity.action &&
          lastEvent.documentType === activity.document.type
      ) {
        lastEvent.activityList.push(activity)
        return false
      } else {
        return Event.create(activity)
      }
    },

    editDocument
  }
}
</script>

<style lang="scss" src="./styles/timeline.scss"></style>