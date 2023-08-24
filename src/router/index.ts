import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// dynamically load component when its needed
const ProductList = () => import('@/views/ProductList.vue')
const ProductDetail = () => import('@/views/ProductDetail.vue')
const Checkout = () => import('@/views/Checkout.vue')
const Cart = () => import('@/views/Cart.vue')
const AppE404 = () => import('@/views/E404.vue')

export const routes: Array<RouteRecordRaw> = [
  {
    name: 'catalog',
    path: '/',
    component: ProductList
  },
  {
    name: 'cart',
    path: '/cart',
    component: Cart
  },
  {
    name: 'product',
    path: '/product/:id',
    component: ProductDetail,
    props: (route) => {
      return { id: route.params.id }
    }
  },
  {
    name: 'checkout',
    path: '/order',
    component: Checkout
  },
  {
    path: '/:any(.*)',
    component: AppE404
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // scroll to top when navigating to a new route
    return { top: 0 }
  }
})
export default router
