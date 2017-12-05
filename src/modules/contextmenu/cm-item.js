import store from '@/store'
import _ from 'lodash'

class ContextMenuItem {
  constructor(props) {
    this.props = props || {}
    this.component = this.props.component || 'cm-item'
    this.visibilityFilters = []
  }

  get $user() {
    return store.state.auth.user
  }

  setComponent(component) {
    this.component = component
    return this
  }

  addFilter(filter) {
    this.visibilityFilters.push(filter)
    return this
  }

  /**
   * Set handler which is called when user clicks
   * the item
   */
  setHandler(handler) {
    this.handler = handler
    return this
  }

  /**
   * Register context menu builder that this item belongs to
   */
  registerBuilder(builder) {
    this.builder = builder
    return this
  }

  /**
   * Return copy of this item
   */
  extend(props) {
    const clone = this.clone()

    Object.assign(clone.props, props)

    return clone
  }

  /**
   * Item is visible, if every single one of its
   * visibility filters returns truth-y value
   *
   * @return {Boolean} Is item visible?
   */
  isVisible() {
    return !this.visibilityFilters.find((shouldBeVisible) => !shouldBeVisible.bind(this)())
  }

  handle() {
    if (this.handler) {
      return this.handler.bind(this)()
    }
  }

  /**
   * Clone the item, so we can assign custom titles/icons
   * or whatever without modifying original instance
   */
  clone() {
    return _.cloneDeep(this)
  }
}

export default ContextMenuItem
