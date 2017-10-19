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
            <template v-if="hiddenEntries.length && !simple">
              However,
              <span @click="applyFiltersToShowAllResults" class="highlight__text">
                {{ hiddenEntries }}
              </span>
              entries were found under
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
            'table__row--hover': isMouseDown && isItemSelected($refs.rows[index]),
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

    <!--
        Context Menu
    -->
    <div ref="contextMenu"
        v-if="contextMenu.isOpen"
        v-clickaway="closeContextMenu"
        :style="{ top: contextMenu.position.top, left: contextMenu.position.left }"
        class="context-menu"
        @contextmenu.prevent
    >
        <div @click="closeContextMenu" class="context-menu-close"></div>

        <!--
          Loop through list of context menu actions and render them based on
          action's type and properties
        -->
        <div v-for="action in contextMenuActions"
             v-if="!action.visible || action.visible(data.name, $store, contextMenu.selectedRow)"
             :class="[
               {
                  separator: action.isSeparator,
                  static: action.isStatic
               },
               action.class
             ]"
             class="context-menu__list-item"
             @click="handleContextMenuAction(action)"
        >
          <!-- Icon of the action -->
          <i v-if="action.icon" :class="action.icon"></i>

          <!-- Displays how many rows are selected -->
          <template v-if="action.isStatic && action.isSelectedRowsCounter">
            <i18n path="table.selected_rows">
              <span class="highlight">{{ selectedRows }}</span>
            </i18n>
          </template>

          <!-- Displays document name on which we opened context menu -->
          <template v-if="action.isStatic && action.isSelectedDocumentName">
            <i18n path="table.selected_document">
              <span>{{ $t('common.' + action.documentType) }}</span>
              <span class="highlight">{{ action.documentName(contextMenu.selectedRow) }}</span>
            </i18n>
          </template>

          <!-- Displays action title, if it has one -->
          <template v-if="action.title">
            {{ $t(action.title) }}
          </template>
        </div>
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

    selectedRows() {
      let selectedRows = this.data.selection.length

      if (this.contextMenu.selectedRow) {
        if (this.data.selection.find((row) => this.contextMenu.selectedRow.uuid === row.uuid)) {
          selectedRows++
        }
      }
      return selectedRows
    },

    /**
     * Are all rows in current page selected?
     * @return {Boolean}
     */
    isWholePageSelected() {
      return this.pageRows.length && this.pageRows.every((row) => this.isRowSelected(row))
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
      return this.$store.state.table[this.data.name].items.filter((item) => {
        return !this.pageRows.find((row) => row.uuid === item.uuid)
      }).length
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
        if (e.keyCode === 46) {
          Delete.handler(this.data.name, this.$store)
        }
      })
    },

    initContextMenu() {
      document.getElementsByClassName('page-content')[0].addEventListener('contextmenu', (e) => {
        e.preventDefault()

        this.openContextMenu(e)
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
      if (false && this.simple) { // eslint-disable-line
        return
      }
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
    },

    /**
     * Check if row is selected
     * @param  {object}  row Row to check
     * @return {Boolean}     Is row selected
     */
    isRowSelected(row) {
      if (false && this.simple) { // eslint-disable-line
        return false
      }
      return this.data.selection.indexOf(row) > -1 || this.contextMenu.selectedRow === row
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
      this.contextMenu.isOpen = true
      if (row) {
        this.contextMenu.selectedRow = row
      }

      this.$nextTick(() => this.setContextMenuPosition(event.y, event.x))
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
    },

    closeContextMenu() {
      this.contextMenu.isOpen = false
      this.contextMenu.selectedRow = undefined
    },

    handleContextMenuAction(action) {
      if (typeof action.handler === 'undefined') {
        return
      }
      action.handler(this.data.name, this.$store, this.contextMenu.selectedRow, this)

      this.$nextTick(() => {
        this.closeContextMenu()
      })
    }
  }
}
</script>

<style lang="scss">
.context-menu {
  background: $color-white;
  box-shadow: $box-shadow-context-menu;
  position: absolute;
  width: 320px;
  z-index: 10;
  padding: 6px 0 17px;
  border-radius: 3px;
}

.context-menu__list-item {
  font-size: 16px;
  cursor: default;
  user-select: none;
  padding: 0 30px 0 26px;
  color: $color-main-dark;

  &:not(.static) {
    height: 35px;
    line-height: 35px;
    cursor: pointer;
    &:hover {
      background-color: #f5f5f5;
      &::before {
        content: '';
        position: absolute;
        width: 70px;
        height: 2px;
        background: rgba(255, 255, 255, 0.8);
        bottom: 13px;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }
  }

  &.heading {
    height: 37px;
    line-height: 37px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 42px;
  }

  &.separator {
    padding: 0;
    border-top: 1px solid #e0e0e0;
    width: 100%;
    margin: 5px auto;
  }

  i {
    margin-right: 18px;
    display: inline-block;
    width: 16px;
    color: #808080;
  }

  .highlight {
    color: $color-main;
    font-weight: $font-weight-semibold;
  }
}

.context-menu-close {
  position: absolute;
  padding: 15px;
  top: 6px;
  right: 6px;
  cursor: pointer;
  z-index: 1;
}

.context-menu-close:hover {
  opacity: 0.8;
}

.context-menu-close::before {
  content: "";
  position: absolute;
  background: url(../../../assets/icons/cross.svg) no-repeat;
  background-size: contain;
  width: 12px;
  height: 12px;
  top: 9px;
  right: 9px;
}
</style>