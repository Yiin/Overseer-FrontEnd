import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import * as Routes from './routes.js'
import Overview from '@/components/overview/Overview.vue'
import { getApiRequestName, getTableName } from '@/modules/documents/helpers'
import AuthorizationService from '@/services/authorization'

Vue.use(Router)

function makeDocumentRoutes(name, {
    component
  } = {}
) {
  const path = '/' + getApiRequestName(name)

  const routeName = getTableName(name)

  return {
    path,
    name: routeName,
    parentName: Routes.OVERVIEW,
    component,
    beforeEnter: checkIfAuthenticated,
    meta: {
      authorize() {
        return AuthorizationService.accessController.canAccessPage(name)
      }
    },
    children: [
      {
        path: `/${name}/create`,
        name: `${name}.create`,
        meta: {
          actionable: true,
          authorize() {
            return AuthorizationService.accessController.canCreateDocument(name)
          }
        }
      },
      {
        path: `/${name}/:uuid/edit`,
        name: `${name}.edit`,
        props: true,
        meta: {
          actionable: true,
          authorize({ uuid }) {
            return AuthorizationService.accessController.canEditDocument(name, uuid)
          }
        }
      },
      {
        path: `/${name}/:uuid/view`,
        name: `${name}.view`,
        props: true,
        meta: {
          actionable: true,
          authorize({ uuid }) {
            return AuthorizationService.accessController.canViewDocument(name, uuid)
          }
        }
      },
      {
        path: `/${name}/:uuid/revision/:activity`,
        name: `${name}.revision`,
        props: true,
        meta: {
          actionable: true,
          authorize({ uuid }) {
            return AuthorizationService.accessController.canViewDocument(name, uuid)
          }
        }
      }
    ]
  }
}

const router = new Router({
  mode: 'history',
  routes: [
    /**
     * Authentication
     */
    {
      path: '/login',
      name: Routes.LOGIN,
      beforeEnter: checkIfGuest
    },
    {
      path: '/register',
      name: Routes.REGISTER,
      beforeEnter: checkIfGuest
    },
    {
      path: '/demo',
      name: 'demo',
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
     * Redirect index to overview
     */
    {
      path: '/',
      name: 'index',
      redirect: {
        name: Routes.OVERVIEW
      }
    },

    /**
     * Settings page
     */
    {
      path: '/settings',
      name: 'settings',
      component(resolve) {
        require(['@/pages/settings/Index.vue'], resolve)
      },
      beforeEnter: checkIfAuthenticated
    },

    /**
     * Authenticated user profile page
     */
    {
      path: '/me',
      name: 'me',
      component(resolve) {
        require(['@/pages/profile/Index.vue'], resolve)
      },
      beforeEnter: checkIfAuthenticated
    },

    /**
     * Some other user profile page
     */
    {
      path: '/profile/:who/:slug',
      name: 'profile',
      props: true,
      component(resolve) {
        require(['@/pages/profile/Index.vue'], resolve)
      },
      beforeEnter: checkIfAuthenticated
    },

    /**
     * Overview
     */
    {
      path: '/overview',
      name: Routes.OVERVIEW,
      component: Overview,
      beforeEnter: checkIfAuthenticated
    },

    /**
     * Appointments page
     */
    {
      path: '/appointments',
      name: 'appointments'
    },

    /**
     * Personnel page
     */
    {
      path: '/personnel',
      name: 'personnel',
      component: function (resolve) {
        require(['@/pages/personnel/Index.vue'], resolve)
      },
      beforeEnter: checkIfAuthenticated
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
      beforeEnter: checkIfAuthenticated
    },

    /**
     * Company form
     */
    {
      path: '/create-company',
      name: 'company.create',
      parentName: Routes.OVERVIEW,
      component: Overview,
      beforeEnter: checkIfAuthenticated,
      meta: {
        actionable: true
      }
    },

    /**
     * CRM
     *
     * Projects
     */
    makeDocumentRoutes('project', {
      component(resolve) {
        require(['@/pages/projects/Index.vue'], resolve)
      }
    }),

    /**
     * Client
     */
    makeDocumentRoutes('client', {
      component(resolve) {
        require(['@/pages/clients/Index.vue'], resolve)
      }
    }),

    /**
     * Product
     */
    makeDocumentRoutes('product', {
      component(resolve) {
        require(['@/pages/products/Index.vue'], resolve)
      }
    }),

    /**
     * Invoice
     */
    makeDocumentRoutes('invoice', {
      component(resolve) {
        require(['@/pages/invoices/Index.vue'], resolve)
      }
    }),

    /**
     * Payment
     */
    makeDocumentRoutes('payment', {
      component(resolve) {
        require(['@/pages/payments/Index.vue'], resolve)
      }
    }),

    /**
     * Recurring invoice
     */
    // makeDocumentRoutes('recurring-invoice', {
    //   component(resolve) {
    //     require(['@/pages/recurring-invoices/Index.vue'], resolve)
    //   }
    // }),

    /**
     * Credit
     */
    makeDocumentRoutes('credit', {
      component(resolve) {
        require(['@/pages/credits/Index.vue'], resolve)
      }
    }),

    /**
     * Quote
     */
    makeDocumentRoutes('quote', {
      component(resolve) {
        require(['@/pages/quotes/Index.vue'], resolve)
      }
    }),

    /**
     * Expense
     */
    makeDocumentRoutes('expense', {
      component(resolve) {
        require(['@/pages/expenses/Index.vue'], resolve)
      }
    }),

    /**
     * Vendor
     */
    makeDocumentRoutes('vendor', {
      component(resolve) {
        require(['@/pages/vendors/Index.vue'], resolve)
      }
    }),

    /**
     * Employee
     */
    makeDocumentRoutes('employee', {
      component(resolve) {
        require(['@/pages/personnel/Index.vue'], resolve)
      }
    }),

    /**
     * 404
     */
    {
      path: '*',
      name: 'NOT_FOUND',
      component: function (resolve) {
        require(['@/pages/error/404.vue'], resolve)
      },
      beforeEnter: (to, from, next) => {
        router.app.$options.store.commit('HIDE_SIDEBAR', true)
        next()
      }
    }
  ]
})

function documentAction(to) {
  const [ documentType, action ] = to.name.split('.')

  switch (action) {
  case 'create':
    // do nothing
    setTimeout(() => {
      window.history.replaceState(null, document.title, router.currentRoute.meta.goBack)
    }, 100)
    break
  case 'edit':
    require('@/modules/documents/actions').editDocument(to.params.uuid, documentType)
    break
  case 'view':
    require('@/modules/documents/actions').viewDocument(to.params.uuid, documentType)
    break
  case 'revision':
    require('@/modules/documents/actions').reviewDocumentState(to.params.uuid, documentType, {
      activity: to.params.activity
    })
    break
  }
}

router.beforeEach((to, from, next) => {
  /**
   * Check if user is authorized to access this route
   */
  if (to.meta && typeof to.meta.authorize === 'function') {
    if (!to.meta.authorize(to.params)) {
      /**
       * Redirect to dashboard if he came directly to this url
       */
      if (!from.name) {
        next('/')
      }
      /**
       * Else simply ignore request for this route and do nothing
       */
      return
    }
  }

  /**
   * Check if route is actionable.
   *
   * Actionable routes triggers additiona action
   * e.g. opens a modal.
   */
  if (from.meta.actionable) {
    if (from.meta.previous) {
      if (to.fullPath !== from.meta.previous) {
        next(from.meta.previous)
      } else {
        next()
      }
    }
  } else if (to.meta.actionable) {
    if (from.name) {
      from.meta.goBack = from.fullPath
      window.history.replaceState(null, document.title, to.fullPath)

      if (to.params.action) {
        documentAction(to)
      }
    } else {
      to.meta.previous = to.matched[0].path
      next()
    }
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  if (to.meta.actionable) {
    if (!from.name) {
      documentAction(to)
    }
  }
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

function checkIfAuthenticated(to, from, next) {
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
