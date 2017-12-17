import { getRepositoryName } from '@/modules/documents/helpers'

export default {
  computed: {
    $repository() {
      return (type) => {
        const repositoryName = getRepositoryName(type)

        return {
          aaItems: this.$store.getters[`documents/repositories/${repositoryName}/AA_ITEMS`],
          aaCompanyItems: this.$store.getters[`documents/repositories/${repositoryName}/AA_COMPANY_ITEMS`],
          availableItems: this.$store.getters[`documents/repositories/${repositoryName}/AVAILABLE_ITEMS`],
          availableCompanyItems: this.$store.getters[`documents/repositories/${repositoryName}/AVAILABLE_COMPANY_ITEMS`],
          activeItems: this.$store.getters[`documents/repositories/${repositoryName}/ACTIVE_ITEMS`],
          activeCompanyItems: this.$store.getters[`documents/repositories/${repositoryName}/ACTIVE_COMPANY_ITEMS`],

          // methods
          find: (uuid) => {
            return this.$store.getters[`documents/repositories/${repositoryName}/FIND_ITEM_BY_KEY`](uuid)
          }
        }
      }
    }
  }
}
