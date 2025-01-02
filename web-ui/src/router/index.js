import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '../stores/session'
import Layout from '../components/Layout.vue'
import Timings from '../pages/Timings.vue'
import Login from '../pages/Login.vue'
import Clients from '../pages/Clients.vue'
import ClientProjects from '../pages/ClientProjects.vue'

const routes = [
  // Default route
  {
    path: '/',
    redirect: '/login',
  },
  // Login Sayfası
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  // Layout ile diğer sayfalar
  {
    path: '/',
    component: Layout,
    redirect: '/timings',
    children: [
      {
        path: 'timings',
        name: 'Timings',
        component: Timings,
      },
      {
        path: 'clients',
        name: 'clients',
        component: Clients,
      },
      {
        path: 'clientProjects',
        name: 'clientProjects',
        component: ClientProjects,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard: Login yapılmadan korumalı rotalara erişimi engelle
router.beforeEach((to, from, next) => {
  const sessionStore = useSessionStore()

  if (to.path === '/login' && sessionStore.token) {
    // Eğer login'e gidiyorsa ve zaten oturum açılmışsa yönlendir
    next('/timings')
  } else if (to.path !== '/login' && !sessionStore.token) {
    // Eğer oturum açılmamışsa ve korunan bir rotaya gidiyorsa login'e yönlendir
    next('/login')
  } else {
    next() // Aksi takdirde devam et
  }
})

export default router
