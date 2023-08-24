<script setup>
  import { onMounted } from 'vue'
  import BasicLayout from '@/layout/BasicLayout.vue'
  
  import { useCartStore } from '@/store/cartStore'
  import { useProductStore } from '@/store/productStore'

  const productStore = useProductStore()
  const cartStore = useCartStore()

  onMounted(async () => {
    await productStore.loadProducts()
    await cartStore.loadCart()
  })
</script>

<template>
  <basic-layout>
    <router-view />
  </basic-layout>
</template>