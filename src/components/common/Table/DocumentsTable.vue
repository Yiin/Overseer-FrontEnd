<template>
  <div ref="table" class="table" :class="{ 'table--simple': simple }" @dragselect-stop="dsstop">
    <!-- Table head -->
    <div class="table__head">
      <!-- Checkbox for page-wide rows toggling at once -->
      <div class="column column__checkbox column--center">
        <input @click="togglePageRows" class="checkbox checkbox--center" type="checkbox" :checked="isWholePageSelected">
      </div>
      <!-- Table columns -->
      <slot name="head"></slot>
    </div>

    <!-- Table body -->
    <div class="table__body">
      <!-- If table is empty, display message -->
      <div
        v-if="tableIsEmpty"
        class="table__row table__row--full-width"
      >
        <div class="column">
          <span>
            Hmm, it seems like there is nothing to display.
            <template v-if="hiddenEntries && !simple">
              However,
              <span @click="applyFiltersToShowAllResults" class="highlight__text">
                {{ hiddenEntries }}
              </span>
              {{ hiddenEntries === 1 ? 'entry was' : 'entries were' }} found under
              <span @click="applyFiltersToShowAllResults" class="highlight__text">
                these
              </span>
              filters.
            </template>
          </span>
        </div>
      </div>

      <!-- Else show current page rows -->
      <template
        v-else
        v-for="(row, index) in pageRows"
      >
        <div
          ref="rows"
          class="table__row"
          :class="{
            'table__row--selected': isRowSelected(row),
            'table__row--hover': isMouseDown && isItemSelected($refs.rows[index]) || (selectedRow === row),
            'table__row--open': showDetailsOf === row
          }"
          @click="toggle(row, $event)"
          @contextmenu.prevent="openContextMenu($event, row)"
          @dragselect-enter="dsenter(row)"
          @dragselect-leave="dsleave(row)"
        >
          <!-- Row checkbox which indicates if row is selected -->
          <div class="column column__checkbox column--center">
            <input class="checkbox checkbox--center" type="checkbox" :checked="isRowSelected(row)">
          </div>
          <!-- Table columns with row data -->
          <slot name="columns" :row="row"></slot>
        </div>
        <slot v-if="showDetailsOf === row" name="details" :row="row"></slot>
      </template>
    </div>

    <div v-show="isMouseDown" class="vue-drag-select-box" :style="selectionBoxStyling"></div>
  </div>
</template>

<script>
import TableMixin from '@/mixins/TableMixin'
import DragSelectMixin from '@/mixins/DragSelect'
import { Delete } from '@/modules/table/cm-actions'

export default {
  name: 'documents-table',

  mixins: [
    TableMixin,
    DragSelectMixin
  ],

  props: {
    data: {
      type: Object
    },
    contextMenuActions: {
      type: Array
    },
    simple: {
      type: Boolean,
      default: false
    },
    documents: {
      type: Array
    }
  },

  data() {
    return {
      showDetailsOf: undefined,
      contextMenu: {
        isOpen: false,
        selectedRow: undefined,
        position: {
          top: 0,
          left: 0
        }
      }
    }
  },

  computed: {
    /**
     * Get rows of current page
     * @return {Array} List of rows
     */
    pageRows() {
      return this.data ? this.data.pageList : []
    },

    /**
     * Check if table is empty
     * @return {Boolean}
     */
    tableIsEmpty() {
      return this.pageRows.length === 0
    },

    /**
     * Are all rows in current page selected?
     * @return {Boolean}
     */
    isWholePageSelected() {
      return this.pageRows.length && this.pageRows.every((row) => this.isRowSelected(row))
    },

    selectedRow() {
      return this.$store.state.table[this.data.name].selectedRow
    },

    /**
     * Disable drag select menu while context menu is open
     */
    isDragSelectDisabled() {
      return this.contextMenu.isOpen
    },

    /**
     * Hidden enttries count
     */
    hiddenEntries() {
      if (!this.data) {
        return []
      }
      return this.availableItems.filter((item) => {
        return !this.pageRows.find((row) => row.uuid === item.uuid)
      }).length
    }
  },

  watch: {
    '$store.state.contextmenu.isOpen': function (isOpen) {
      if (!isOpen) {
        const selectedRow = this.selectedRow

        if (this.contextMenu.selectedRow === selectedRow) {
          this.contextMenu.selectedRow = null
          this.$store.dispatch(`table/${this.data.name}/TOGGLE_ROW_OFF`, selectedRow)
        }
        this.$store.commit(`table/${this.data.name}/SET_SELECTED_ROW`, null)
      }
    }
  },

  mounted() {
    this.initDragSelect() // TableMixin
    this.initContextMenu()
    this.listenForHotkeys()

    this.$on('toggle-details', (row) => {
      if (this.showDetailsOf === row) {
        this.showDetailsOf = undefined
        return
      }
      this.showDetailsOf = row
    })
  },

  methods: {
    listenForHotkeys() {
      window.addEventListener('keydown', (e) => {
        switch (e.keyCode) {
        case 46:
          Delete.handler(this.data.name)
          break
        }
      })
    },

    initContextMenu() {
      const pageContentEl = document.getElementsByClassName('page-content')[0]

      pageContentEl.addEventListener('contextmenu', (e) => {
        e.preventDefault()

        if (e.target === pageContentEl) {
          this.openContextMenu(e)
        }
      })
    },

    /**
     * Some documents may not be visible, because required filters are not set.
     * Apply these filters automatically for user.
     */
    applyFiltersToShowAllResults() {
      this.$emit('apply-filters-to-show-hidden-results')
    },

    /**
     * Select or unselect all rows in current page at once
     * @return {void}
     */
    togglePageRows() {
      if (false && this.simple) { // eslint-disable-line
        return
      }
      if (this.isWholePageSelected) {
        this.pageRows.forEach((row) => this.toggle(row))
      } else {
        this.pageRows.filter((row) => !this.isRowSelected(row)).forEach((row) => this.toggle(row))
      }
    },

    /**
     * Toggle row selection
     * @param  {object} row Row to toggle
     * @param  {object} event
     * @return {void}
     */
    toggle(row, event = null) {
      if (event) {
        if (['a'].indexOf(event.target.nodeName.toLowerCase()) > -1) {
          return
        }
        if (event.target.classList.contains('--do-not-toggle-row')) {
          return
        }
        if (typeof window.getSelection !== 'undefined') {
          if (window.getSelection().toString()) {
            return
          }
        } else if (typeof document.selection !== 'undefined' && document.selection.type === 'Text') {
          if (document.selection.createRange().text) {
            return
          }
        }
      }
      this.$store.dispatch(`table/${this.data.name}/TOGGLE_ROW`, row)

      if (this.lastSelectedRow) {
        if (event && event.shiftKey) {
          const fromIndex = this.filteredItems.indexOf(this.lastSelectedRow)
          const toIndex = this.filteredItems.indexOf(row)

          if (fromIndex > -1 && toIndex > -1) {
            for (let i = Math.min(fromIndex, toIndex); i <= Math.max(fromIndex, toIndex); ++i) {
              this.$store.dispatch(`table/${this.data.name}/TOGGLE_ROW_ON`, this.filteredItems[i])
            }
          }
        }
      }
      this.lastSelectedRow = row
    },

    /**
     * Check if row is selected
     * @param  {object}  row Row to check
     * @return {Boolean}     Is row selected
     */
    isRowSelected(row) {
      return this.data.selection.findIndex((selectedRow) => row.uuid === selectedRow.uuid) > -1 || (this.contextMenu.selectedRow && this.contextMenu.selectedRow.uuid === row.uuid)
    },

    /**
     * Drag to select
     *
     * dsenter() is called when selection box hovers over the row.
     * dsleave() is called when selection box leaves row
     */
    dsenter(row) {
      if (false && this.simple) { // eslint-disable-line
        return
      }
      this.$store.dispatch(`table/${this.data.name}/TOGGLE_ROW`, row)
    },

    dsleave(row) {
      if (false && this.simple) { // eslint-disable-line
        return
      }
      this.$store.dispatch(`table/${this.data.name}/TOGGLE_ROW_OFF`, row)
    },

    dsstop({ detail: selectedRows }) { // eslint-disable-line
      //
    },

    /**
     * Context menu
     */
    openContextMenu(event, row = undefined) {
      if (!this.contextMenuActions || this.contextMenuActions.length === 0) {
        return
      }

      /**
       * There are 2 places where we keep reference of clicked row.
       * 1) this.contextMenu.selecterRow is set to seleted row, if that row wasnt selected before
       * 2) state.selectedRow is set to selected row regardless if row was selected before
       *
       * We do that, so we can remove currently selected row from selection list
       * when context menu is closed, if that row wasnt selected before.
       */
      if (!this.isRowSelected(row)) {
        this.contextMenu.selectedRow = row
      } else {
        this.contextMenu.selectedRow = null
      }
      this.$store.commit(`table/${this.data.name}/SET_SELECTED_ROW`, row || null)

      if (row) {
        this.$store.dispatch(`table/${this.data.name}/TOGGLE_ROW_ON`, row)
      }

      this.$store.dispatch('contextmenu/OPEN', {
        position: {
          left: event.x,
          top: event.y
        },
        scope: this.data.name,
        items: this.contextMenuActions
      })
    },

    setContextMenuPosition(top, left) {
      if (!this.$refs.contextMenu) {
        return
      }
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

      const offset = this.getElementPosition(this.$refs.table)
      const largestHeight = window.innerHeight - this.$refs.contextMenu.offsetHeight - 25 + scrollTop
      const largestWidth = window.innerWidth - this.$refs.contextMenu.offsetWidth - 25 + scrollLeft

      top += scrollTop
      left += scrollLeft

      if (top > largestHeight) top = largestHeight
      if (left > largestWidth) left = largestWidth

      top -= offset.top
      left -= offset.left

      this.contextMenu.position.top = top + 'px'
      this.contextMenu.position.left = left + 'px'
    },

    getElementPosition(elem) {
      if (!elem) {
        return
      }
      const box = elem.getBoundingClientRect()

      const body = document.body
      const docEl = document.documentElement

      const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop
      const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft

      const clientTop = docEl.clientTop || body.clientTop || 0
      const clientLeft = docEl.clientLeft || body.clientLeft || 0

      const top = box.top + scrollTop - clientTop
      const left = box.left + scrollLeft - clientLeft

      return { top: Math.round(top), left: Math.round(left) }
    }
  }
}
</script>