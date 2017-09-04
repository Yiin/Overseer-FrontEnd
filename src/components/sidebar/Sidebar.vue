<template>
  <div class="sidebar">
    <div class="sidebar__content">
      <div class="profile-area">
        <img class="profile-picture" src="https://media.licdn.com/mpr/mpr/shrinknp_200_200/AAEAAQAAAAAAAANPAAAAJGNlYzQzNzZiLTcwZDgtNDcxMC04ZmE0LWUyNDhkY2I4ZWEyMg.jpg">
        <div class="profile-name">
          Stanislovas Janonis
          <span class="caret"></span>
        </div>
        <div v-show="0" class="profile-options">
          <div class="profile-option">
            Log Out
          </div>
        </div>
      </div>
      <div class="sidebar__nav">
        <nav-link :name="routes.overview">
          <i class="icon-sidebar-overview"></i>
          {{ $t('common.overview') }}
        </nav-link>
        <nav-link :name="routes.products" :preload="true">
          <i class="icon-sidebar-products"></i>
          {{ $t('common.products') }}
        </nav-link>
        <nav-link :name="routes.clients" :preload="true">
          <i class="icon-sidebar-clients"></i>
          {{ $t('common.clients') }}
        </nav-link>
        <nav-link :name="routes.invoices" :preload="true">
          <i class="icon-sidebar-invoices"></i>
          {{ $t('common.invoices') }}
        </nav-link>
        <nav-link :name="routes.recurring" :preload="true">
          <i class="icon-sidebar-recurring"></i>
          {{ $t('common.recurring') }}
        </nav-link>
        <hr>
        <div class="sidebar__nav-category">
          Category 1
        </div>
        <nav-link :name="routes.payments" :preload="true">
          <i class="icon-sidebar-payments"></i>
          {{ $t('common.payments') }}
        </nav-link>
        <nav-link :name="routes.expenses" :preload="true">
          <i class="icon-sidebar-expenses"></i>
          {{ $t('common.expenses') }}
        </nav-link>
        <nav-link :name="routes.credits" :preload="true">
          <i class="icon-sidebar-credits"></i>
          {{ $t('common.credits') }}
        </nav-link>
        <hr>
        <div class="sidebar__nav-category">
          Category 2
        </div>
        <nav-link :name="routes.quotes" :preload="true">
          <i class="icon-sidebar-quotes"></i>
          {{ $t('common.quotes') }}
        </nav-link>
        <nav-link :name="routes.vendors" :preload="true">
          <i class="icon-sidebar-vendors"></i>
          {{ $t('common.vendors') }}
        </nav-link>
        <hr>
        <div class="sidebar__nav-category">
          Category 3
        </div>
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
        vendors: Routes.LIST_VENDORS
      }
    }
  }
}
</script>

<style lang="scss" src="./style.scss"></style>