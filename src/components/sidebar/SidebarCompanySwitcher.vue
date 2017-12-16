<template lang="pug">
    .sidebar__companySwitcher
      .companySwitcher

        sidebar-company(
          v-for='company in companies'
          :key='company.uuid'
          :company='company'
          @click.native='selectCompany(company)'
        ) {{ company.name }}

        sidebar-company(
          v-if='canCreateCompany'
          @click.native='createCompany'
          new-company
        )
</template>

<script>
import SidebarCompany from './SidebarCompany.vue'
import { createDocument } from '@/modules/documents/actions'
import Company from '@models/company'
import AuthorizationHelpers from '@/mixins/authorization/helpers'

export default {
  mixins: [
    AuthorizationHelpers
  ],

  components: {
    SidebarCompany
  },

  data() {
    return {
      newCompanyDialog: false,
      companyForm: {
        name: '',
        email: ''
      }
    }
  },

  computed: {
    companies() {
      return this.$store.getters['documents/repositories/company/AVAILABLE_ITEMS']
        .filter((company) => company.uuid !== this.$user.company.uuid)
    }
  },

  methods: {
    selectCompany(company) {
      this.$store.commit('auth/SET_CURRENT_COMPANY', company)
      this.$emit('select', company)
    },

    createCompany() {
      createDocument('company').then((company) => {
        this.selectCompany(Company.create(company))
      })
      this.$emit('select')
    }
  }
}
</script>