import { defineStore } from 'pinia'
import type { Product } from '@/interfaces'
const BASE_URL = 'http://faceprog.ru/reactcourseapi/products'

export const useProductStore = defineStore('productStore', {
	state: () => ({
		products: []
	}) as Products[],
	actions: {
		setProducts(products: Product) {
			this.products = products
		},
		async loadProducts() {
			const response = await fetch(`${BASE_URL}/all.php`)
			const products = await response.json() as Product[]

			this.setProducts(products)
		}
	},
	getters: {
		getAllProducts: state => state.products,
		findProductById: state => (id: string) => 
      state.products?.find(product => product.id === Number(id))
	},
})