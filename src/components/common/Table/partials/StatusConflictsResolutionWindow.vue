<template>
  <div>
    <div class="popup__header">
      Status Conflicts Resolution
    </div>

    <div class="popup__body">
      <div v-if="errors.length">
        <h4>In order to change document's status to {{ statusWeAreTryingToApply }}, following conflicts must be resolved</h4>
        <ul>
          <li v-for="error in errors">
            <template v-if="error.message">
              {{ error.message }}
            </template>
            <button v-if="error.solve" @click="solveError(error)">
              Resolve
            </button>
            <template v-if="error.availableOptions">
              Suggestions:
              <ul>
                <li v-for="suggestion in error.availableOptions">
                  {{ suggestion.message }}
                </li>
              </ul>
            </template>
          </li>
        </ul>
      </div>
      <template v-else>
        <div v-if="warnings.length">
          <h3>Warning</h3>
          <ul>
            <li v-for="warning in warnings">
              <template v-if="warning.message">
                {{ warning.message }}
              </template>
              <p>
                <template v-if="warning.tip">
                  Tip:
                  {{ warning.tip }}
                </template>
              </p>
              <template v-if="warning.availableOptions">
                Suggestions:
                <ul>
                  <li v-for="suggestion in warning.availableOptions">
                    {{ suggestion.message }}
                  </li>
                </ul>
              </template>
            </li>
          </ul>
        </div>
        <div v-if="solution">
          <h3> </h3>
          In order to change document's status to {{ statusWeAreTryingToApply }}, {{ solution.message }}
        </div>
        <button v-if="warnings.length" @click="solve">I understand, continue</button>
        <button v-if="solution" @click="solve">Apply solution</button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'status-conflicts-resolution-window',

  props: {
    data: {
      default: {}
    }
  },

  data() {
    return {
      conflictState: this.data.conflictState
    }
  },

  computed: {
    warnings() {
      return this.conflictState.conflicts ? this.conflictState.conflicts.filter((conflict) => conflict.type === 'warning') : []
    },

    errors() {
      return this.conflictState.conflicts ? this.conflictState.conflicts.filter((conflict) => conflict.type === 'error') : []
    },

    solution() {
      return this.conflictState.solution
    },

    statusWeAreTryingToApply() {
      return this.data.status.name
    }
  },

  methods: {
    solveError(error) {
      if (error.solve) {
        let conflictState = error.solve()

        if (conflictState) {
          this.conflictState = conflictState
        } else {
          this.$store.dispatch('popup/CLOSE_POPUP')
        }
      }
    },

    solve() {
      if (this.solution) {
        this.$store.dispatch('popup/CLOSE_POPUP')
        this.solution.solve()
      } else {
        Promise.resolve(this.resolveWarnings()).then((finalConflictState) => {
          if (finalConflictState && finalConflictState.solve) {
            finalConflictState.solve()
          }

          if (this.conflictState && this.conflictState.solve) {
            // solve final conflicts
            this.conflictState = this.conflictState.solve(this.data.document)
          }
          // close the popup, we're done
          this.$store.dispatch('popup/CLOSE_POPUP')
        })
      }
    },

    // resolve warning one by one, and merge found conflicts
    resolveWarnings(index = 0, conflicts = [], solutions = []) {
      if (index === this.warnings.length) {
        return {
          conflicts,
          solve() {
            solutions.forEach((solve) => {
              solve()
            })
          }
        }
      }
      const warning = this.warnings[index]

      // if warning has an action, that needs to be taken
      if (warning.solve) {
        // try to solve it
        const conflictState = warning.solve()

        if (!conflictState) {
          return this.resolveWarnings(index + 1, conflicts, solutions)
        }

        // if there were any conflicts
        if (conflictState.conflicts && conflictState.conflicts.length) {
          conflicts = conflicts.concat(conflictState.conflicts)
        }
        if (conflictState.solve) {
          solutions.push(conflictState.solve)
        }
        if (typeof conflictState.then === 'function') {
          return conflictState.then(() => {
            this.resolveWarnings(index + 1, conflicts, solutions)
          })
        }
      }
      return this.resolveWarnings(index + 1, conflicts, solutions)
    }
  }
}
</script>