import S from 'string'
import pluralize from 'pluralize'
import { getRepositoryName } from '@/modules/documents/helpers'

function makeHelpers(documentType) {
  const methodPluralSuffix = S(pluralize(documentType)).capitalize().s
  const methodSuffix = S(documentType).capitalize().s
  const repositoryName = getRepositoryName(documentType)

  return {
    [`canView${methodPluralSuffix}`]() {
      /**
       * We're watching values below to update this computed property
       * once any of them changes.
       */
      this.$user
      this.$store.getters[`documents/repositories/${repositoryName}/AVAILABLE_COMPANY_ITEMS`]

      return this.$authorization.accessController.canAccessPage(documentType)
    },

    [`canCreate${methodSuffix}`]() {
      this.$user

      return this.$authorization.accessController.canCreateDocument(documentType)
    }
  }
}

export default {
  computed: {
    ...makeHelpers('product'),
    ...makeHelpers('payment'),
    ...makeHelpers('client'),
    ...makeHelpers('invoice'),
    ...makeHelpers('credit'),
    ...makeHelpers('quote'),
    ...makeHelpers('expense'),
    ...makeHelpers('vendor'),
    ...makeHelpers('project'),
    ...makeHelpers('employee'),
    ...makeHelpers('role'),
    ...makeHelpers('company')
  }
}
