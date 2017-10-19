import { smoothScrollToBottom } from '@/scripts'

export default (formName) => {
  return {
    methods: {
      updateContact(index, field, value) {
        this.$store.commit(`form/${formName}/SET_CONTACT_FIELD`, {
          index,
          field,
          value
        })
      },

      addNewContact() {
        this.$store.dispatch(`form/${formName}/ADD_NEW_CONTACT`)

        this.$nextTick(() => smoothScrollToBottom(this.$refs.contactsList))
      },

      removeContact(index) {
        this.$store.dispatch(`form/${formName}/REMOVE_CONTACT`, index)
      }
    }
  }
}
