import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import(/* webpackChunkName: "index" */'../views/IndexView.vue'),
      meta: {
        authenticated: false,
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */'../views/AboutView.vue'),
    },
    {
      path: '/todo',
      name: 'todo',
      component: () => import(/* webpackChunkName: "todo" */'../views/TodoView.vue'),
      meta: {
        authenticated: true,
      }
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import(/* webpackChunkName: "logout" */'../views/LogoutView.vue'),
    }
  ]
})

export default router
