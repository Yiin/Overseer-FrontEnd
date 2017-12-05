<template lang="pug">
  .sidebar__nav
    navigation-link(:name="routes.overview")
      i.sidebar-icon.sidebar-icon--overview
      span {{ $t('common.overview') }}

    .sidebar__nav-link.sidebar__nav-link--disabled
      i.sidebar-icon.sidebar-icon--appointments
      span Appointments

    navigation-link(:name="routes.products" v-if="canViewProducts")
      i.sidebar-icon.sidebar-icon--products
      span {{ $t('common.products') }}

    navigation-link(:name="routes.clients" v-if="canViewClients")
      i.sidebar-icon.sidebar-icon--clients
      span {{ $t('common.clients') }}

    template(v-if='category1')
      hr
      .sidebar__nav-category Category 1

    navigation-link(:name="routes.invoices" v-if="canViewInvoices")
      i.sidebar-icon.sidebar-icon--invoices
      span {{ $t('common.invoices') }}

    navigation-link(:name="routes.payments" v-if="canViewPayments")
      i.sidebar-icon.sidebar-icon--payments
      span {{ $t('common.payments') }}

    navigation-link(:name="routes.credits" v-if="canViewCredits")
      i.sidebar-icon.sidebar-icon--credits
      span {{ $t('common.credits') }}

    template(v-if='category2')
      hr
      .sidebar__nav-category Category 2

    navigation-link(:name="routes.quotes" v-if="canViewQuotes")
      i.sidebar-icon.sidebar-icon--quotes
      span {{ $t('common.quotes') }}

    navigation-link(:name="routes.expenses" v-if="canViewExpenses")
      i.sidebar-icon.sidebar-icon--expenses
      span {{ $t('common.expenses') }}

    navigation-link(:name="routes.vendors" v-if="canViewVendors")
      i.sidebar-icon.sidebar-icon--vendors
      span {{ $t('common.vendors') }}

    navigation-link(:name="routes.personnel" v-if="canViewEmployees")
      i.sidebar-icon.sidebar-icon--personnel
      span {{ $t('common.personnel') }}

    navigation-link(:name="routes.currency")
      i.sidebar-icon.sidebar-icon--currency
      span Currency

    hr
    .sidebar__nav-category Category 3

    navigation-link(:name="routes.projects" v-if="canViewProjects")
      i.sidebar-icon.sidebar-icon--projects
      span {{ $t('common.projects') }}

    .sidebar__nav-link.sidebar__nav-link--disabled
      i.sidebar-icon.sidebar-icon--reports
      span {{ $t('common.reports') }}

    navigation-link(name='settings')
      i.sidebar-icon.sidebar-icon--settings
      span {{ $t('common.settings') }}
</template>

<script>
import * as Routes from '@/router/routes'
import NavigationLink from './SidebarNavigationLink.vue'
import AuthorizationHelpersMixin from '@/mixins/authorization/helpers'

export default {
  mixins: [
    AuthorizationHelpersMixin
  ],

  components: {
    NavigationLink
  },

  computed: {
    routes() {
      return {
        overview: Routes.OVERVIEW,
        products: Routes.LIST_PRODUCTS,
        clients: Routes.LIST_CLIENTS,
        invoices: Routes.LIST_INVOICES,
        payments: Routes.LIST_PAYMENTS,
        expenses: Routes.LIST_EXPENSES,
        credits: Routes.LIST_CREDITS,
        quotes: Routes.LIST_QUOTES,
        vendors: Routes.LIST_VENDORS,
        projects: Routes.LIST_PROJECTS,
        currency: Routes.CURRENCY,
        personnel: 'personnel'
      }
    },

    category1() {
      return this.canViewInvoices ||
             this.canViewCredits ||
             this.canViewPayments
    },

    category2() {
      return this.canViewQuotes ||
             this.canViewExpenses ||
             this.canViewVendors ||
             this.canViewEmployees
    }
  }
}
</script>