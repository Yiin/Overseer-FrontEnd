import FormState from './base/state'
import FormMutations from './base/mutations'
import FormActions from './base/actions'
import Employee from '@/modules/documents/models/employee'

export default {
  namespaced: true,

  state: FormState('employee', {
    fields: {
      uuid: '',

      // Details
      first_name: '',
      last_name: '',
      job_title: '',
      email: '',
      phone: '',
      account: false,
      password: '',
      selectedCountries: [],
      assignedClients: []
    },

    tabs: [
      [
        'first_name',
        'last_name',
        'job_title',
        'email',
        'phone',
        'account',
        'password'
      ],
      [
        'selectedCountries',
        'assignedClients'
      ]
    ]
  }),
  mutations: FormMutations(),
  actions: FormActions({
    model: Employee,
    repository: 'documents/repositories/employee'
  })
}
