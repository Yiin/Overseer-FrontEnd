import Vue from 'vue'
import Router from 'vue-router'
import * as Routes from './routes.js'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    /**
     * Authentication
     */
    {
      path: '/login',
      name: Routes.LOGIN,
      component: function (resolve) {
        require(['@/components/login/Login.vue'], resolve)
      },
      beforeEnter: checkIfGuest
    },
    {
      path: '/register',
      name: Routes.REGISTER,
      component: function (resolve) {
        require(['@/components/register/Register.vue'], resolve)
      },
      beforeEnter: checkIfGuest
    },
    {
      path: '/logout',
      name: Routes.LOGOUT,
      beforeEnter(to, from, next) {
        Vue.auth.logout()
        next('/')
      }
    },

    /**
     * Basic routes
     */
    {
      path: '/',
      redirect: {
        name: Routes.OVERVIEW
      }
    },
    {
      path: '/overview',
      name: Routes.OVERVIEW,
      component: function (resolve) {
        require(['@/components/overview/Overview.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },

    /**
     * Client
     */
    {
      path: '/clients',
      name: Routes.LIST_CLIENTS,
      parentName: Routes.OVERVIEW,
      component: function (resolve) {
        require(['@/components/entities/client/List.vue'], resolve)
      },
      beforeEnter: (...params) => {
        checkIfLoggedIn(...params)
        preloadList(...params)
      }
    },
    {
      path: '/client/:id',
      name: Routes.VIEW_CLIENT,
      parentName: Routes.LIST_CLIENTS,
      component: function (resolve) {
        require(['@/components/entities/client/View.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },
    {
      path: '/client/:id/edit',
      name: Routes.EDIT_CLIENT,
      parentName: Routes.LIST_CLIENTS,
      component: function (resolve) {
        require(['@/components/entities/client/Edit.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },

    /**
     * Product
     */
    {
      path: '/products',
      name: Routes.LIST_PRODUCTS,
      parentName: Routes.OVERVIEW,
      component: function (resolve) {
        require(['@/components/entities/product/List.vue'], resolve)
      },
      beforeEnter: (...params) => {
        checkIfLoggedIn(...params)
        preloadList(...params)
      }
    },
    {
      path: '/product/:id',
      name: Routes.VIEW_PRODUCT,
      parentName: Routes.LIST_PRODUCTS,
      component: function (resolve) {
        require(['@/components/entities/product/View.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },
    {
      path: '/product/:id/edit',
      name: Routes.EDIT_PRODUCT,
      parentName: Routes.LIST_PRODUCTS,
      component: function (resolve) {
        require(['@/components/entities/product/Edit.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },

    /**
     * Invoice
     */
    {
      path: '/invoices',
      name: Routes.LIST_INVOICES,
      parentName: Routes.OVERVIEW,
      component: function (resolve) {
        require(['@/components/entities/invoice/List.vue'], resolve)
      },
      beforeEnter: (...params) => {
        checkIfLoggedIn(...params)
        preloadList(...params)
      }
    },
    {
      path: '/invoice/:id',
      name: Routes.VIEW_INVOICE,
      parentName: Routes.LIST_INVOICES,
      component: function (resolve) {
        require(['@/components/entities/invoice/View.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },
    {
      path: '/invoice/:id/edit',
      name: Routes.EDIT_INVOICE,
      parentName: Routes.LIST_INVOICES,
      component: function (resolve) {
        require(['@/components/entities/invoice/Edit.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },

    /**
     * Payment
     */
    {
      path: '/payments',
      name: Routes.LIST_PAYMENTS,
      parentName: Routes.OVERVIEW,
      component: function (resolve) {
        require(['@/components/entities/payment/List.vue'], resolve)
      },
      beforeEnter: (...params) => {
        checkIfLoggedIn(...params)
        preloadList(...params)
      }
    },
    {
      path: '/payment/:id',
      name: Routes.VIEW_PAYMENT,
      parentName: Routes.LIST_PAYMENTS,
      component: function (resolve) {
        require(['@/components/entities/payment/View.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },
    {
      path: '/payment/:id/edit',
      name: Routes.EDIT_PAYMENT,
      parentName: Routes.LIST_PAYMENTS,
      component: function (resolve) {
        require(['@/components/entities/payment/Edit.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },

    /**
     * Recurring invoice
     */
    {
      path: '/recurring-invoices',
      name: Routes.LIST_RECURRING_INVOICES,
      parentName: Routes.OVERVIEW,
      component: function (resolve) {
        require(['@/components/entities/recurring-invoice/List.vue'], resolve)
      },
      beforeEnter: (...params) => {
        checkIfLoggedIn(...params)
        preloadList(...params)
      }
    },
    {
      path: '/recurring-invoice/:id',
      name: Routes.VIEW_RECURRING_INVOICE,
      parentName: Routes.LIST_RECURRING_INVOICES,
      component: function (resolve) {
        require(['@/components/entities/recurring-invoice/View.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },
    {
      path: '/recurring-invoice/:id/edit',
      name: Routes.EDIT_RECURRING_INVOICE,
      parentName: Routes.LIST_RECURRING_INVOICES,
      component: function (resolve) {
        require(['@/components/entities/recurring-invoice/Edit.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },

    /**
     * Credit
     */
    {
      path: '/credits',
      name: Routes.LIST_CREDITS,
      parentName: Routes.OVERVIEW,
      component: function (resolve) {
        require(['@/components/entities/credit/List.vue'], resolve)
      },
      beforeEnter: (...params) => {
        checkIfLoggedIn(...params)
        preloadList(...params)
      }
    },
    {
      path: '/credit/:id',
      name: Routes.VIEW_CREDIT,
      parentName: Routes.LIST_CREDITS,
      component: function (resolve) {
        require(['@/components/entities/credit/View.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },
    {
      path: '/credit/:id/edit',
      name: Routes.EDIT_CREDIT,
      parentName: Routes.LIST_CREDITS,
      component: function (resolve) {
        require(['@/components/entities/credit/Edit.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },

    /**
     * Quote
     */
    {
      path: '/quotes',
      name: Routes.LIST_QUOTES,
      parentName: Routes.OVERVIEW,
      component: function (resolve) {
        require(['@/components/entities/quote/List.vue'], resolve)
      },
      beforeEnter: (...params) => {
        checkIfLoggedIn(...params)
        preloadList(...params)
      }
    },
    {
      path: '/quote/:id',
      name: Routes.VIEW_QUOTE,
      parentName: Routes.LIST_QUOTES,
      component: function (resolve) {
        require(['@/components/entities/quote/View.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },
    {
      path: '/quote/:id/edit',
      name: Routes.EDIT_QUOTE,
      parentName: Routes.LIST_QUOTES,
      component: function (resolve) {
        require(['@/components/entities/quote/Edit.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },

    /**
     * Expense
     */
    {
      path: '/expenses',
      name: Routes.LIST_EXPENSES,
      parentName: Routes.OVERVIEW,
      component: function (resolve) {
        require(['@/components/entities/expense/List.vue'], resolve)
      },
      beforeEnter: (...params) => {
        checkIfLoggedIn(...params)
        preloadList(...params)
      }
    },
    {
      path: '/expense/:id',
      name: Routes.VIEW_EXPENSE,
      parentName: Routes.LIST_EXPENSES,
      component: function (resolve) {
        require(['@/components/entities/expense/View.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },
    {
      path: '/expense/:id/edit',
      name: Routes.EDIT_EXPENSE,
      parentName: Routes.LIST_EXPENSES,
      component: function (resolve) {
        require(['@/components/entities/expense/Edit.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },

    /**
     * Vendor
     */
    {
      path: '/vendors',
      name: Routes.LIST_VENDORS,
      parentName: Routes.OVERVIEW,
      component: function (resolve) {
        require(['@/components/entities/vendor/List.vue'], resolve)
      },
      beforeEnter: (...params) => {
        checkIfLoggedIn(...params)
        preloadList(...params)
      }
    },
    {
      path: '/vendor/:id',
      name: Routes.VIEW_VENDOR,
      parentName: Routes.LIST_VENDORS,
      component: function (resolve) {
        require(['@/components/entities/vendor/View.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },
    {
      path: '/vendor/:id/edit',
      name: Routes.EDIT_VENDOR,
      parentName: Routes.LIST_VENDORS,
      component: function (resolve) {
        require(['@/components/entities/vendor/Edit.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    }
  ]
})

function checkIfGuest(to, from, next) {
  const auth = router.app.$options.store.state.auth

  if (auth.isLoggedIn) {
    next({
      path: '/'
    })
  } else {
    next()
  }
}

function checkIfLoggedIn(to, from, next) {
  // work-around to get to the Vuex store (as of Vue 2.0)
  const auth = router.app.$options.store.state.auth

  if (!auth.isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

function preloadList(to) {
  const store = router.app.$options.store
  if (!store.state.lists[to.name].loading) {
    store.dispatch('preloadData', {name: to.name})
  }
}

export default router
