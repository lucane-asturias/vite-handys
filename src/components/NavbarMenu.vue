<script setup>
  import { computed, reactive } from 'vue'
  import { useCartStore } from '@/store/cartStore'
  import { useProductStore } from '@/store/productStore'
  import formatPrice from '@/helpers/formatPrice'

  const productStore = useProductStore()
  const cartStore = useCartStore()

  const cartsLength = computed(() => cartStore.cartsLength)
  const cartsTotal = computed(() => cartStore.cartsTotal)
  
  const menu = reactive([
    { route: 'catalog', text: 'Products' },
    { route: 'cart', text: 'Cart' },
    { route: 'checkout', text: 'Order' }
  ])
</script>

<template>
  <header id="header" class="bg-slate-100 shadow drop-shadow-lg">
    <nav class="container mx-auto flex flex-row justify-start items-center p-8 px-2">
      <!-- Primary Navigation Menu -->
      <div v-for="item in menu" :key="item.route">
        <menu class="flex flex-row text-md mr-5">
          <router-link :to="{ name: item.route }" exact-active-class="text-blue-500">
            <span class="self-center text-md md:text-xl font-semibold" v-text="item.text" />
          </router-link>
        </menu>
      </div>
      <!-- Second Navigation Menu  -->
      <div class="flex flex-row ml-auto">
        <menu class="flex flex-row">
          <div class="mr-3">In Cart: {{ cartsLength }}</div>
          <div>Total: {{ formatPrice(cartsTotal) }}</div>
        </menu>
      </div>
    </nav>
  </header>
</template>