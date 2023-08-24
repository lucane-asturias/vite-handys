<script lang="ts" setup>
  import { computed, defineAsyncComponent } from 'vue'
	import { useProductStore } from '@/store/productStore'
  import formatPrice from '@/helpers/formatPrice'

  const AppE404 = defineAsyncComponent(() => import('@/views/E404.vue'))

  const props = defineProps<{ id: string }>() // route segment id

  const productStore = useProductStore()
  const product = computed(() => productStore.findProductById(props.id) ?? null)
</script>
<template>
	<div class="mt-5" v-if="product">
		<p class="text-3xl font-bold">{{ product.title }}</p>
		<hr class="h-px my-2">
		<div class="alert p-4 rounded-lg border-1 border-emerald-700">
			Price: {{ formatPrice(product.price) }}
		</div>
    <router-link :to="{ name: 'catalog' }" class="mt-4 inline-block rounded py-2 px-3 bg-emerald-600 text-white hover:bg-emerald-700">
    	Back to catalog
      </router-link>
	</div>
	<app-e-404 class="mt-5" v-else />
</template>

<style lang="css" scoped>
.alert {
  background-color: #d1e7dd;
  color: #0a362;
  border-color: #a3cfbb
}
</style>