<template lang="pug">
  .context-menu__list-item(
    v-if='isVisible'
    :class='itemClasses'
    @click='select'
  )
    //- Render item
    slot
      //- Icon of the item
      context-menu-item-icon(
        v-if='item.props.icon'
        :icon='item.props.icon'
      )
      | {{ item.props.title }}
</template>

<script>
import ContextMenuItemMixin from './context-menu-item-mixin'

export default {
  mixins: [
    ContextMenuItemMixin
  ]
}
</script>