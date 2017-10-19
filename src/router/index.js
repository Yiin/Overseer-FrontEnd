import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import * as Routes from './routes.js'
import Overview from '@/components/overview/Overview.vue'

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
      // component: function (resolve) {
      //   require(['@/components/login/Login.vue'], resolve)
      // },
      beforeEnter: checkIfGuest
    },
    {
      path: '/register',
      name: Routes.REGISTER,
      // component: function (resolve) {
      //   require(['@/components/register/Register.vue'], resolve)
      // },
      beforeEnter: checkIfGuest
    },
    {
      path: '/demo',
      name: Routes.REGISTER,
      beforeEnter(to, from, next) {
        next('/overview')
      }
    },
    {
      path: '/logout',
      name: Routes.LOGOUT,
      beforeEnter(to, from, next) {
        store.dispatch('auth/LOGOUT', { redirect: false })
        next('/login')
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
      component: Overview,
      beforeEnter: checkIfLoggedIn
    },
    {
      path: '/appointments',
      name: 'appointments'
    },
    {
      path: '/personnel',
      name: 'personnel'
    },
    {
      path: '/finances',
      name: 'finances'
    },
    {
      path: '/currency',
      name: Routes.CURRENCY,
      component: function (resolve) {
        require(['@/pages/currency/Index.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },

    /**
     * CRM
     *
     * Projects
     */
    {
      path: '/projects',
      name: Routes.LIST_PROJECTS,
      parentName: Routes.OVERVIEW,
      component(resolve) {
        require(['@/components/crm/project/List.vue'], resolve)
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
        require(['@/components/documents/client/List.vue'], resolve)
      },
      beforeEnter: (...params) => {
        checkIfLoggedIn(...params)
      }
    },
    // {
    //   path: '/clients/:uuid',
    //   name: Routes.VIEW_CLIENT,
    //   parentName: Routes.LIST_CLIENTS,
    //   beforeEnter: (to, from, next) => {
    //     // store.dispatch('modal/OPEN', {
    //     //   to.params.uuid

    //     // })
    //   }
    // },
    {
      path: '/client/:id/edit',
      name: Routes.EDIT_CLIENT,
      parentName: Routes.LIST_CLIENTS,
      component: function (resolve) {
        require(['@/components/documents/client/Edit.vue'], resolve)
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
        require(['@/components/documents/product/List.vue'], resolve)
      },
      beforeEnter: (...params) => {
        checkIfLoggedIn(...params)
      }
    },
    // {
    //   path: '/product/:id',
    //   name: Routes.VIEW_PRODUCT,
    //   parentName: Routes.LIST_PRODUCTS,
    //   component: function (resolve) {
    //     require(['@/components/documents/product/View.vue'], resolve)
    //   },
    //   beforeEnter: checkIfLoggedIn
    // },
    {
      path: '/product/:id/edit',
      name: Routes.EDIT_PRODUCT,
      parentName: Routes.LIST_PRODUCTS,
      component: function (resolve) {
        require(['@/components/documents/product/Edit.vue'], resolve)
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
        require(['@/components/documents/invoice/List.vue'], resolve)
      },
      beforeEnter: (...params) => {
        checkIfLoggedIn(...params)
      }
    },
    // {
    //   path: '/invoice/:id',
    //   name: Routes.VIEW_INVOICE,
    //   parentName: Routes.LIST_INVOICES,
    //   component: function (resolve) {
    //     require(['@/components/documents/invoice/View.vue'], resolve)
    //   },
    //   beforeEnter: checkIfLoggedIn
    // },
    {
      path: '/invoice/:id/edit',
      name: Routes.EDIT_INVOICE,
      parentName: Routes.LIST_INVOICES,
      component: function (resolve) {
        require(['@/components/documents/invoice/Edit.vue'], resolve)
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
        require(['@/components/documents/payment/List.vue'], resolve)
      },
      beforeEnter: (...params) => {
        checkIfLoggedIn(...params)
      }
    },
    // {
    //   path: '/payment/:id',
    //   name: Routes.VIEW_PAYMENT,
    //   parentName: Routes.LIST_PAYMENTS,
    //   component: function (resolve) {
    //     require(['@/components/documents/payment/View.vue'], resolve)
    //   },
    //   beforeEnter: checkIfLoggedIn
    // },
    {
      path: '/payment/:id/edit',
      name: Routes.EDIT_PAYMENT,
      parentName: Routes.LIST_PAYMENTS,
      component: function (resolve) {
        require(['@/components/documents/payment/Edit.vue'], resolve)
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
        require(['@/components/documents/recurring-invoice/List.vue'], resolve)
      },
      beforeEnter: (...params) => {
        checkIfLoggedIn(...params)
      }
    },
    // {
    //   path: '/recurring-invoice/:id',
    //   name: Routes.VIEW_RECURRING_INVOICE,
    //   parentName: Routes.LIST_RECURRING_INVOICES,
    //   component: function (resolve) {
    //     require(['@/components/documents/recurring-invoice/View.vue'], resolve)
    //   },
    //   beforeEnter: checkIfLoggedIn
    // },
    {
      path: '/recurring-invoice/:id/edit',
      name: Routes.EDIT_RECURRING_INVOICE,
      parentName: Routes.LIST_RECURRING_INVOICES,
      component: function (resolve) {
        require(['@/components/documents/recurring-invoice/Edit.vue'], resolve)
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
        require(['@/components/documents/credit/List.vue'], resolve)
      },
      beforeEnter: (...params) => {
        checkIfLoggedIn(...params)
      }
    },
    // {
    //   path: '/credit/:id',
    //   name: Routes.VIEW_CREDIT,
    //   parentName: Routes.LIST_CREDITS,
    //   component: function (resolve) {
    //     require(['@/components/documents/credit/View.vue'], resolve)
    //   },
    //   beforeEnter: checkIfLoggedIn
    // },
    {
      path: '/credit/:id/edit',
      name: Routes.EDIT_CREDIT,
      parentName: Routes.LIST_CREDITS,
      component: function (resolve) {
        require(['@/components/documents/credit/Edit.vue'], resolve)
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
        require(['@/components/documents/quote/List.vue'], resolve)
      },
      beforeEnter: (...params) => {
        checkIfLoggedIn(...params)
      }
    },
    // {
    //   path: '/quote/:id',
    //   name: Routes.VIEW_QUOTE,
    //   parentName: Routes.LIST_QUOTES,
    //   component: function (resolve) {
    //     require(['@/components/documents/quote/View.vue'], resolve)
    //   },
    //   beforeEnter: checkIfLoggedIn
    // },
    {
      path: '/quote/:id/edit',
      name: Routes.EDIT_QUOTE,
      parentName: Routes.LIST_QUOTES,
      component: function (resolve) {
        require(['@/components/documents/quote/Edit.vue'], resolve)
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
        require(['@/components/documents/expense/List.vue'], resolve)
      },
      beforeEnter: (...params) => {
        checkIfLoggedIn(...params)
      }
    },
    // {
    //   path: '/expense/:id',
    //   name: Routes.VIEW_EXPENSE,
    //   parentName: Routes.LIST_EXPENSES,
    //   component: function (resolve) {
    //     require(['@/components/documents/expense/View.vue'], resolve)
    //   },
    //   beforeEnter: checkIfLoggedIn
    // },
    {
      path: '/expense/:id/edit',
      name: Routes.EDIT_EXPENSE,
      parentName: Routes.LIST_EXPENSES,
      component: function (resolve) {
        require(['@/components/documents/expense/Edit.vue'], resolve)
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
        require(['@/components/documents/vendor/List.vue'], resolve)
      },
      beforeEnter: (...params) => {
        checkIfLoggedIn(...params)
      }
    },
    // {
    //   path: '/vendor/:id',
    //   name: Routes.VIEW_VENDOR,
    //   parentName: Routes.LIST_VENDORS,
    //   component: function (resolve) {
    //     require(['@/components/documents/vendor/View.vue'], resolve)
    //   },
    //   beforeEnter: checkIfLoggedIn
    // },
    {
      path: '/vendor/:id/edit',
      name: Routes.EDIT_VENDOR,
      parentName: Routes.LIST_VENDORS,
      component: function (resolve) {
        require(['@/components/documents/vendor/Edit.vue'], resolve)
      },
      beforeEnter: checkIfLoggedIn
    },
    {
      path: '*',
      name: 'NOT_FOUND',
      redirect: {
        name: Routes.OVERVIEW
      }
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

export default router
