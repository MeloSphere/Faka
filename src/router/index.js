import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/order/:id',
    name: 'Order',
    component: () => import('../views/Order.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 