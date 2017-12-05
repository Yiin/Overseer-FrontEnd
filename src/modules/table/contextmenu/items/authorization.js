import i18n from '@/i18n'
import TableContextMenuBuilder from '@/modules/table/contextmenu/builder'
import ContextMenuItem from '@/modules/contextmenu/cm-item'

export const ASSIGN_USER = new ContextMenuItem({
  component: 'cm-item-list',
  title: i18n.t('actions.assign_user'),
  icon: {
    type: 'material',
    name: 'user'
  }
})
.setHandler(function () {
  const builder = new TableContextMenuBuilder()
  const list = builder.init({
    tableStateName: this.builder.getTableStateName()
  })

  list.addItem(AUTHORIZE_DOCUMENT)

  return list.build()
})

export const AUTHORIZE_DOCUMENT = new ContextMenuItem({
  component: 'cm-item-authorize-document'
})
