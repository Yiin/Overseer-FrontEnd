import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import * as Routes from './routes.js'
import Overview from '@/components/overview/Overview.vue'
import Profile from '@/pages/profile/Index.vue'
import { getApiRequestName, getTableName } from '@/modules/documents/helpers'

Vue.use(Router)

function makeDocumentRoutes(name, {
    component
  } = {}
) {
  const path = '/' + getApiRequestName(name)

  return {
    path,
    name: getTableName(name),
    parentName: Routes.OVERVIEW,
    component,
    beforeEnter: checkIfAuthenticated,
    children: [
      {
        path: `/${name}/create`,
        name: `${name}.create`,
        meta: {
          actionable: true
        }
      },
      {
        path: `/${name}/:uuid/edit`,
        name: `${name}.edit`,
        props: true,
        meta: {
          actionable: true
        }
      },
      {
        path: `/${name}/:uuid/revision/:activity`,
        name: `${name}.revision`,
        props: true,
        meta: {
          actionable: true
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
     * Basic routes
     */
    {
      path: '/',
      name: 'index',
      redirect: {
        name: Routes.OVERVIEW
      }
    },
    {
      path: '/me',
      name: 'me',
      component: Profile,
      beforeEnter: checkIfAuthenticated
    },
    {
      path: '/profile/:who',
      name: 'profile',
      props: true,
      component: Profile,
      beforeEnter: checkIfAuthenticated
    },
    {
      path: '/overview',
      name: Routes.OVERVIEW,
      component: Overview,
      beforeEnter: checkIfAuthenticated
    },
    {
      path: '/appointments',
      name: 'appointments'
    },
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
     * CRM
     *
     * Projects
     */
    makeDocumentRoutes('project', {
      component(resolve) {
        require(['@/components/crm/project/List.vue'], resolve)
      }
    }),

    /**
     * Client
     */
    makeDocumentRoutes('client', {
      component(resolve) {
        require(['@/components/documents/client/List.vue'], resolve)
      }
    }),

    /**
     * Product
     */
    makeDocumentRoutes('product', {
      component(resolve) {
        require(['@/components/documents/product/List.vue'], resolve)
      }
    }),

    /**
     * Invoice
     */
    makeDocumentRoutes('invoice', {
      component(resolve) {
        require(['@/components/documents/invoice/List.vue'], resolve)
      }
    }),

    /**
     * Payment
     */
    makeDocumentRoutes('payment', {
      component(resolve) {
        require(['@/components/documents/payment/List.vue'], resolve)
      }
    }),

    /**
     * Recurring invoice
     */
    makeDocumentRoutes('recurring-invoice', {
      component(resolve) {
        require(['@/components/documents/recurring-invoice/List.vue'], resolve)
      }
    }),

    /**
     * Credit
     */
    makeDocumentRoutes('credit', {
      component(resolve) {
        require(['@/components/documents/credit/List.vue'], resolve)
      }
    }),

    /**
     * Quote
     */
    makeDocumentRoutes('quote', {
      component(resolve) {
        require(['@/components/documents/quote/List.vue'], resolve)
      }
    }),

    /**
     * Expense
     */
    makeDocumentRoutes('expense', {
      component(resolve) {
        require(['@/components/documents/expense/List.vue'], resolve)
      }
    }),

    /**
     * Vendor
     */
    makeDocumentRoutes('vendor', {
      component(resolve) {
        require(['@/components/documents/vendor/List.vue'], resolve)
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
  case 'revision':
    require('@/modules/documents/actions').reviewDocumentState(to.params.uuid, documentType, {
      activity: to.params.activity
    })
    break
  }
}

router.beforeEach((to, from, next) => {
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
