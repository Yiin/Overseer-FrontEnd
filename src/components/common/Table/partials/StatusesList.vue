<template>
  <div @click="toggleList"
       v-clickaway="closeList"
       class="status statuses-list"
       :class="[
         { 'statuses-list--open': isOpen },
         'status--' + documentStatusName.className
       ]">
    <div class="current-status">
      {{ documentStatusName.name }}
    </div>
    <div v-show="isOpen" class="status__list">
      <div v-for="status in availableStatuses" @click="tryToSetStatus(status)" class="status__item"><!--  :class="[ 'status--' + status ]"> -->
        {{ status.name }}
      </div>
    </div>
  </div>
</template>

<script>
import DocumentStatuses from '@/modules/documents/statuses'

export default {
  name: 'statuses-list',

  props: {
    type: {
      type: String,
      required: true
    },
    document: {
      required: true
    }
  },

  data() {
    return {
      isOpen: false
    }
  },

  computed: {
    statuses() {
      const statuses = []

      for (let status in DocumentStatuses[this.type]) {
        if (DocumentStatuses[this.type][status].visible) {
          statuses.push(DocumentStatuses[this.type][status])
        }
      }

      for (let status in DocumentStatuses.generic) {
        if (DocumentStatuses.generic[status].visible) {
          statuses.push(DocumentStatuses.generic[status])
        }
      }

      return statuses
    },

    availableStatuses() {
      return this.statuses.filter((status) => status.name !== this.documentStatusName.name)
    },

    documentStatusName() {
      let documentStatus = {}

      for (let status in DocumentStatuses[this.type]) {
        if (DocumentStatuses[this.type][status].visible &&
            DocumentStatuses[this.type][status].meetsCondition(this.document) && (
              typeof documentStatus.priority === 'undefined' ||
              documentStatus.priority <= DocumentStatuses[this.type][status].priority
            )
        ) {
          documentStatus.priority = DocumentStatuses[this.type][status].priority
          documentStatus.name = DocumentStatuses[this.type][status].name
          documentStatus.className = status
        }
      }

      for (let status in DocumentStatuses.generic) {
        if (DocumentStatuses.generic[status].visible &&
            DocumentStatuses.generic[status].meetsCondition(this.document)) {
          documentStatus.name = DocumentStatuses.generic[status].name
          documentStatus.className = status
        }
      }
      return documentStatus
    }
  },

  methods: {
    toggleList() {
      this.isOpen = !this.isOpen
    },

    closeList() {
      this.isOpen = false
    },

    tryToSetStatus(status) {
      let state = status.apply(this.document, status.isGeneric ? this.type : undefined)

      this.tryToResolveConflicts(state, status)
    },

    tryToResolveConflicts(state, status) {
      // conflicts resolved
      if (!state) {
        return
      }

      // if there is a list of conflicts, open resolution window
      // for user to see possible solutions
      if (state.conflicts.length) {
        this.openConflictsResolutionWindow(state, status)
      } else {
        // there are no conflicts, so we just try solve main issue if there is one
        if (state.solve) {
          state = state.solve()

          // we need to display solution info to the user
          if (state && state.solution) {
            this.openConflictsResolutionWindow(state, status)
          }
        }
      }
    },

    openConflictsResolutionWindow(state, status) {
      this.$store.dispatch('popup/SHOW_POPUP', {
        template: 'status-conflicts-resolution-window',
        data: {
          document: this.document,
          status,
          conflictState: state
        }
      })
    }
  }
}
</script>

<style lang="scss">
.status__list {
    color: $color-main-dark;
    background: $color-white;
    z-index: 1;
    position: absolute;
    width: 100%;
    font-size: 13px;
    left: 0;
    box-shadow: $box-shadow;
}

.statuses-list {
    position: relative;
    cursor: pointer;
    text-align: left;
    padding-left: 12px;
    padding-right: 28px;

    &--open {
      box-shadow: $box-shadow;
    }
    &::before {
        position: absolute;
        top: 10px;
        right: 10px;
        content: '';
        border-top: 4px solid;
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
    }
}

.status__item:hover {
    background: #f0f0f0;
}

.status__item {
    padding: 1px 0;
    font-weight: normal;
    text-align: left;
    padding-left: 12px;
    text-transform: capitalize;
}
</style>