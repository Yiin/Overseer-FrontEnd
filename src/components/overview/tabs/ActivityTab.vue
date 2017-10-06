<template>
  <div v-show="isActive" class="tab tab--dashboard">
    <template v-if="!activityLog || !activityLog.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--activity"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Here you can see all the things<br>
          that happened recently.
        </div>
      </div>
    </template>
    <div v-show="activityLog && activityLog.length" ref="activityLogList" class="list scrollable">
      <div v-for="loggedActivities in activityLog" class="list__item">
        <div class="list-item__column">
          <div class="list-item__something">
            {{ loggedActivities.date.date() | ordinal }}
          </div>
        </div>
        <div class="list-item__column">
          <div class="activity-list">
            <div v-for="activity in loggedActivities.list" class="activity-list__item">
              <div class="activity">
                <span class="activity__timestamp">
                  {{ activity | activityTime }}
                </span>
                <span class="activity__user">
                  <a href @click.prevent>
                    {{ activity.user.full_name }}
                  </a>
                </span>
                <span class="activity__summary">
                  {{ activity.action }}
                  {{ activity | documentType }}
                  <a v-if="activity.document" @click.prevent.stop="edit(activity.document)" href>
                    {{ activity | documentName }}
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!allActivityLoaded" class="list__item list__item--fixed">
        <div class="list-item__column">
          <div @click="loadMore" class="list-item__something list-item__something--clickable">
            <i class="icon-down"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { editDocument } from '@/modules/documents/actions'
import { smoothScrollToBottom } from '@/scripts'
import Tab from '@/components/common/Tabs/Tab.vue'

export default {
  extends: Tab,

  filters: {
    ordinal(n) {
      const s = ['th', 'st', 'nd', 'rd']
      const v = n % 100
      return n + (s[(v - 20) % 10] || s[v] || s[0])
    },

    activityTime(activity) {
      return moment(activity.timestamp.date).format('HH:mm')
    },

    documentType(activity) {
      return activity.document.type.replace(/-/, ' ')
    },

    documentName(activity) {
      switch (activity.document.type) {
      case 'client':
      case 'project':
      case 'task-list':
      case 'task':
      case 'product': return activity.document.data.name
      case 'vendor': return activity.document.data.company_name
      case 'invoice': return activity.document.data.invoice_number
      case 'quote': return activity.document.data.quote_number
      case 'recurring-invoice': return activity.document.data.uuid
      }
    }
  },

  props: {
    title: {
      default: 'All Activity'
    }
  },

  computed: {
    activityLog() {
      const log = []
      let lastDate = null

      this.$store.state.system.activityLog.filter((loggedActivity) => {
        return loggedActivity.document
      }).sort((a, b) => {
        if (a.timestamp.date < b.timestamp.date) {
          return 1
        } else {
          return -1
        }
      }).forEach((activity) => {
        const date = moment(activity.timestamp.date)

        if (!lastDate || !date.isSame(lastDate, 'day')) {
          log.push({
            date,
            list: [activity]
          })
        } else {
          log[log.length - 1].list.push(activity)
        }
        lastDate = date
      })
      return log
    },

    allActivityLoaded() {
      return this.$store.state.system.allActivityLoaded
    }
  },

  methods: {
    edit(document) {
      editDocument(document.data, document.type)
    },

    loadMore() {
      this.$store.dispatch('system/LOAD_MORE_ACTIVITIES').then(() => {
        setTimeout(() => {
          const el = document.getElementsByClassName('router-view')[0]
          smoothScrollToBottom(el)
        }, 1000)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// .list {
//   max-height: 474px;
// }

// .list__item--fixed {
//   position: absolute;
//   bottom: 110px;
// }
</style>

<style lang="scss">
.activity {
  font-size: 15px;
  font-weight: normal;
}

.activity__timestamp,
.activity__user {
  font-weight: bold;
}

.activity__user {
  margin-left: 10px;
  a {
    color: $color-main !important;
  }
}

.activity__summary a {
  font-weight: bold;
  color: $color-main !important;
}
</style>