<template>
	<div class="mt-5">
		<div class="max-w-6xl grid grid-cols-2 sm:grid-cols-3 mx-auto pl-14" v-if="products">
			<div class="sm:w-2/3 my-3" v-for="pr in products" :key="pr.id">
        <!-- Card -->
				<div class="break-words border bg-white border border-gray-300 rounded-lg shadow">
          <!-- Card Body -->
					<div class="p-6">
            <div class="text-lg font-semibold" v-text="pr.title" />
						<div>{{ formatPrice(pr.price) }}</div>
						<router-link :to="{ name: 'product', params: { id: pr.id } }" class="text-sm text-blue-500 hover:text-blue-800 underline">
              Read more
            </router-link>
            <hr class="h-px my-2">
            <!-- Actions -->
						<button v-if="cartStore.inCart(pr.id)" @click="cartStore.removeCart(pr.id)" type="button" 
              class="bg-red-600 text-white hover:bg-red-700 mt-2 text-sm py-1 px-3 rounded">
							Remove
						</button>
						<button v-else @click="cartStore.addCart(pr.id)" type="button" 
              class="bg-green-500 text-white hover:bg-green-600 mt-2 text-sm py-1 px-3 rounded">
							Add to cart
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useProductStore } from '@/store/productStore'
  import { useCartStore } from '@/store/cartStore'
  import formatPrice from '@/helpers/formatPrice'

  const productStore = useProductStore()
  const cartStore = useCartStore()

  const products = computed(() => productStore.getAllProducts)
</script>