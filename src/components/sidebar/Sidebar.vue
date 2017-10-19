<template>
  <div class="sidebar">
    <div class="sidebar__content">
      <div class="logo">
        <span>Over</span><span>seer</span>
      </div>
      <div class="sidebar__nav">
        <nav-link :name="routes.overview">
          <i class="sidebar-icon sidebar-icon--overview"></i>
          <span>{{ $t('common.overview') }}</span>
        </nav-link>
        <div class="sidebar__nav-link sidebar__nav-link--disabled">
          <i class="sidebar-icon sidebar-icon--appointments"></i>
          <span>Appointments</span>
        </div>
        <nav-link :name="routes.products">
          <i class="sidebar-icon sidebar-icon--products"></i>
          <span>{{ $t('common.products') }}</span>
        </nav-link>
        <nav-link :name="routes.clients">
          <i class="sidebar-icon sidebar-icon--clients"></i>
          <span>{{ $t('common.clients') }}</span>
        </nav-link>
        <hr>
        <div class="sidebar__nav-category">
          Category 1
        </div>
        <nav-link :name="routes.invoices">
          <i class="sidebar-icon sidebar-icon--invoices"></i>
          <span>{{ $t('common.invoices') }}</span>
        </nav-link>
        <nav-link :name="routes.payments">
          <i class="sidebar-icon sidebar-icon--payments"></i>
          <span>{{ $t('common.payments') }}</span>
        </nav-link>
        <nav-link :name="routes.credits">
          <i class="sidebar-icon sidebar-icon--credits"></i>
          <span>{{ $t('common.credits') }}</span>
        </nav-link>
        <hr>
        <div class="sidebar__nav-category">
          Category 2
        </div>
        <nav-link :name="routes.quotes">
          <i class="sidebar-icon sidebar-icon--quotes"></i>
          <span>{{ $t('common.quotes') }}</span>
        </nav-link>
        <nav-link :name="routes.expenses">
          <i class="sidebar-icon sidebar-icon--expenses"></i>
          <span>{{ $t('common.expenses') }}</span>
        </nav-link>
        <nav-link :name="routes.vendors">
          <i class="sidebar-icon sidebar-icon--vendors"></i>
          <span>{{ $t('common.vendors') }}</span>
        </nav-link>
        <div class="sidebar__nav-link sidebar__nav-link--disabled">
          <i class="sidebar-icon sidebar-icon--personel"></i>
          <span>Personnel</span>
        </div>
        <nav-link :name="routes.currency">
          <i class="sidebar-icon sidebar-icon--currency"></i>
          <span>Currency</span>
        </nav-link>
        <hr>
        <div class="sidebar__nav-category">
          Category 3
        </div>
        <nav-link :name="routes.projects">
          <i class="sidebar-icon sidebar-icon--projects"></i>
          <span>{{ $t('common.projects') }}</span>
        </nav-link>
        <div class="sidebar__nav-link sidebar__nav-link--disabled">
          <i class="sidebar-icon sidebar-icon--reports"></i>
          <span>{{ $t('common.reports') }}</span>
        </div>
        <div class="sidebar__nav-link">
          <i class="sidebar-icon sidebar-icon--settings"></i>
          <span>{{ $t('common.settings') }}</span>
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
        projects: Routes.LIST_PROJECTS,
        currency: Routes.CURRENCY
      }
    }
  }
}
</script>

<style lang="scss" src="./style.scss"></style>