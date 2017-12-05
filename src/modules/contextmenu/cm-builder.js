class ContextMenuBuilder {
  constructor() {
    this.items = []
  }

  init(props) {
    this.props = props
    this.items = []
    return this
  }

  addItem(item) {
    this.items.push(item.registerBuilder(this))
    return this
  }

  addSeparator(index = null) {
    const separator = {
      component: 'cm-item',
      props: {
        isStatic: true
      },
      isSeparator: true
    }

    if (index === null) {
      this.items.push(separator)
    } else {
      this.items.splice(index, 0, separator)
    }
    return this
  }

  filteredItems() {
    return this.items.filter((item) => !item.isVisible || item.isVisible())
  }

  build() {
    const filteredItems = this.filteredItems()

    this.trimItems(filteredItems)

    return filteredItems
  }

  trimItems(items) {
    let trimmed = false

    while (!trimmed) {
      if (!items.length) {
        trimmed = true
      } else if (items[0].isSeparator) {
        items.shift()
      } else if (items[items.length - 1].isSeparator) {
        items.pop()
      } else {
        trimmed = true
      }
    }
  }
}

export default ContextMenuBuilder
