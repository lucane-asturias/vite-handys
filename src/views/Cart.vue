<script setup>
	import { computed } from 'vue'
  import { useCartStore } from '@/store/cartStore'
  import formatPrice from '@/helpers/formatPrice'

  const cartStore = useCartStore()

  const products = computed(() => cartStore.cartsDetailed() ?? null)
</script>

<template>
  <div class="mt-5">
    <div class="overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-1 border-gray-200">
          <tr>
            <th class="px-6 py-3 border-r-2">Product name</th>
            <th class="px-6 py-3 border-r-2">Price</th>
            <th class="px-6 py-3 border-r-2">Qnt</th>
            <th class="px-6 py-3 border-r-2">Total</th>
            <th class="px-6 py-3 border-r-2">Actions</th>
          </tr>
        </thead>
        <tbody v-if="products" class="border-1 border-gray-200">
          <tr v-for="pr in products" :key="pr.id" class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-r-2">
              {{ pr.title.trim() }}
            </td>
            <td class="px-6 py-4 border-r-2">
              {{ formatPrice(pr.price) }}
            </td>
            <td class="px-6 py-4 border-r-2">
              {{ pr.qnt }}
            </td>
            <td class="px-6 py-4 border-r-2">
              {{ formatPrice(pr.price * pr.qnt) }}
            </td>
            <td class="px-6 py-4 border-r-2">
              <button class="bg-yellow-400 hover:bg-yellow-500 py-2.5 px-3 ml-2 rounded font-bold text-slate-800" 
                @click="cartStore.setQnt({ id: pr.id, qnt: pr.qnt - 1 })">-1</button>
              <button class="bg-green-500 hover:bg-green-600 py-2.5 px-3 ml-2 rounded font-bold text-slate-200" 
                @click="cartStore.setQnt({ id: pr.id, qnt: pr.qnt + 1 })">+1</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
		<router-link :to="{ name: 'checkout' }" class="mt-3 inline-block rounded py-2 px-3 bg-emerald-600 text-white hover:bg-emerald-700">
      Checkout
    </router-link>
	</div>
</template>