export default {
  data() {
    return {
      box: null,
      isMouseDown: false,
      startPoint: null,
      endPoint: null,
      selected: [],
      saveSelection: false,
      mouseDownTimeout: null
    }
  },

  computed: {
    selectionBox() {
      // Only set styling when necessary
      if (!this.isMouseDown || !this.startPoint || !this.endPoint) return {}

      const clientRect = this.$el.getBoundingClientRect()

      // Calculate position and dimensions of the selection box
      const left = Math.min(this.startPoint.x, this.endPoint.x) - clientRect.left
      const top = Math.min(this.startPoint.y, this.endPoint.y) - clientRect.top
      const width = Math.abs(this.startPoint.x - this.endPoint.x)
      const height = Math.abs(this.startPoint.y - this.endPoint.y)

      // Return the styles to be applied
      return {
        left,
        top,
        width,
        height
      }
    },

    selectionBoxStyling() {
      // Only set styling when necessary
      if (!this.isMouseDown || !this.startPoint || !this.endPoint) return {}

      const { left, top, width, height } = this.selectionBox

      // Return the styles to be applied
      return {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`
      }
    }
  },

  methods: {
    initDragSelect() {
      document.getElementsByClassName('page-content')[0].addEventListener('mousedown', this.onMouseDown)
    },

    onMouseDown(event) {
      // if clicked element is a link or inside a span container
      // do not interfere with user action
      if (['a', 'input', 'select', 'textarea', 'button'].indexOf(event.target.tagName.toLowerCase()) > -1) {
        return
      }
      const hasParentWithClass = (element, classname) => {
        if (element.className && element.className.split(' ').indexOf(classname) >= 0) {
          return true
        }
        return element.parentNode && hasParentWithClass(element.parentNode, classname)
      }
      if (hasParentWithClass(event.target, 'dropdown')) {
        return
      }

      if (this.isDragSelectDisabled) {
        return
      }
      if (window.getSelection) {
        if (window.getSelection().empty) {  // Chrome
          window.getSelection().empty()
        } else if (window.getSelection().removeAllRanges) {  // Firefox
          window.getSelection().removeAllRanges()
        }
      } else if (document.selection) {  // IE?
        document.selection.empty()
      }

      document.body.classList.add('disable-selection')

      // if (this.saveSelection) {
      this.selected = []
      // }

      // Register begin point
      this.isMouseDown = true
      this.startPoint = {
        x: event.pageX,
        y: event.pageY
      }

      // Start listening for mouse move and up events
      window.addEventListener('mousemove', this.onMouseMove)
      window.addEventListener('mouseup', this.onMouseUp)
    },

    onMouseMove(event) {
      // Update the end point position
      if (this.isMouseDown) {
        if (!this.endPoint) {
          // if distance between start point and end point is less than X px,
          // lets assume that user wanted to click stuff, not drag to select
          const X = 30
          if (Math.hypot(event.pageX - this.startPoint.x, event.pageY - this.startPoint.y) < X) {
            return
          }
        }
        this.endPoint = {
          x: event.pageX,
          y: event.pageY
        }

        if (this.$refs.rows) {
          this.$refs.rows.forEach((child) => {
            if (this.isItemSelected(child)) {
              if (this.selected.indexOf(child) < 0) {
                this.selected.push(child)
                child.dispatchEvent(new Event('dragselect-enter'))
              }
            } else {
              if (this.selected.indexOf(child) > -1) {
                this.selected = this.selected.filter((el) => el !== child)
                child.dispatchEvent(new Event('dragselect-leave'))
              }
            }
          })
        }
      }
    },

    onMouseUp(e) {
      // Clean up event listeners
      window.removeEventListener('mousemove', this.onMouseMove)
      window.removeEventListener('mouseup', this.onMouseUp)

      this.$el.dispatchEvent(new CustomEvent('dragselect-stop', {
        detail: {
          selectedRows: this.selected
        }
      }))

      document.body.classList.remove('disable-selection')

      // Reset state
      this.isMouseDown = false
      this.startPoint = null
      this.endPoint = null

      e.preventDefault()
    },

    isItemSelected(el) {
      const boxA = this.selectionBox
      const boxB = {
        top: el.offsetTop,
        left: el.offsetLeft,
        width: el.clientWidth,
        height: el.clientHeight
      }

      const result = !!((
        boxA.left <= boxB.left + boxB.width &&
        boxA.left + boxA.width >= boxB.left &&
        boxA.top <= boxB.top + boxB.height &&
        boxA.top + boxA.height >= boxB.top
      ) || (
        boxA.top <= boxB.top + boxB.height &&
        boxA.top + boxA.height >= boxB.top
      ))

      return result
    },

    onKeyDown(e) {
      // ctrl
      if (e.keyCode === 17) {
        this.saveSelection = true
      }
    },

    onKeyUp(e) {
      if (e.keyCode === 17) {
        this.saveSelection = false
      }
    }
  },

  created() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  },

  beforeDestroy() {
    // Remove event listeners
    document.getElementsByClassName('page-content')[0].removeEventListener('mousedown', this.onMouseDown)
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mouseup', this.onMouseUp)
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  }
}
