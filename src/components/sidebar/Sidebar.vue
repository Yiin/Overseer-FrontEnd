<template>
  <div class="sidebar">
    <div class="sidebar__content">
      <div class="logo">
        <span>Over</span><span>seer</span>
      </div>
      <div class="sidebar__nav">
        <nav-link :name="routes.overview">
          <i class="icon-sidebar-overview"></i>
          {{ $t('common.overview') }}
        </nav-link>
        <nav-link name="appointments">
          <i class="icon-sidebar-vendors"></i>
          Appointments
        </nav-link>
        <nav-link :name="routes.products">
          <i class="icon-sidebar-products"></i>
          {{ $t('common.products') }}
        </nav-link>
        <nav-link :name="routes.clients">
          <i class="icon-sidebar-clients"></i>
          {{ $t('common.clients') }}
        </nav-link>
        <hr>
        <div class="sidebar__nav-category">
          Category 1
        </div>
        <nav-link :name="routes.invoices">
          <i class="icon-sidebar-invoices"></i>
          {{ $t('common.invoices') }}
        </nav-link>
        <nav-link :name="routes.recurring">
          <i class="icon-sidebar-recurring"></i>
          {{ $t('common.recurring') }}
        </nav-link>
        <nav-link :name="routes.payments">
          <i class="icon-sidebar-payments"></i>
          {{ $t('common.payments') }}
        </nav-link>
        <nav-link :name="routes.credits">
          <i class="icon-sidebar-credits"></i>
          {{ $t('common.credits') }}
        </nav-link>
        <hr>
        <div class="sidebar__nav-category">
          Category 2
        </div>
        <nav-link :name="routes.quotes">
          <i class="icon-sidebar-quotes"></i>
          {{ $t('common.quotes') }}
        </nav-link>
        <nav-link :name="routes.expenses">
          <i class="icon-sidebar-expenses"></i>
          {{ $t('common.expenses') }}
        </nav-link>
        <nav-link :name="routes.vendors">
          <i class="icon-sidebar-vendors"></i>
          {{ $t('common.vendors') }}
        </nav-link>
        <nav-link name="personnel">
          <i class="icon-sidebar-clients"></i>
          Personnel
        </nav-link>
        <nav-link name="finances">
          <i class="icon-sidebar-credits"></i>
          Finances
        </nav-link>
        <hr>
        <div class="sidebar__nav-category">
          Category 3
        </div>
        <nav-link :name="routes.projects">
          <i class="icon-sidebar-projects"></i>
          {{ $t('common.projects') }}
        </nav-link>
        <div class="sidebar__nav-link">
          <i class="icon-sidebar-reports"></i>
          {{ $t('common.reports') }}
        </div>
        <div class="sidebar__nav-link">
          <i class="icon-sidebar-settings"></i>
          {{ $t('common.settings') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavLink from './NavLink.vue'
import * as Routes from '@/router/routes'

export default {
  components: {
    'nav-link': NavLink
  },

  computed: {
    routes() {
      return {
        overview: Routes.OVERVIEW,
        products: Routes.LIST_PRODUCTS,
        clients: Routes.LIST_CLIENTS,
        invoices: Routes.LIST_INVOICES,
        recurring: Routes.LIST_RECURRING_INVOICES,
        payments: Routes.LIST_PAYMENTS,
        expenses: Routes.LIST_EXPENSES,
        credits: Routes.LIST_CREDITS,
        quotes: Routes.LIST_QUOTES,
        vendors: Routes.LIST_VENDORS,
        projects: Routes.LIST_PROJECTS
      }
    }
  }
}
</script>

<style lang="scss" src="./style.scss"></style>