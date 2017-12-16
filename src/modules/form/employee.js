import FormState from './base/state'
import FormMutations from './base/mutations'
import FormActions from './base/actions'
import Employee from '@models/employee'

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
      assign_all_countries: false,
      assigned_countries: [],
      assign_all_clients: false,
      assigned_clients: [],
      assigned_roles: []
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
        'assign_all_countries',
        'assigned_countries',
        'assign_all_clients',
        'assigned_clients',
        'assigned_roles'
      ]
    ]
  }),
  mutations: FormMutations(),
  actions: FormActions({
    model: Employee,
    repository: 'documents/repositories/employee'
  })
}
