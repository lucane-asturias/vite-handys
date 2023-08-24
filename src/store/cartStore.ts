import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useProductStore } from '@/store/productStore'
import type { Product, Cart, CartToken } from '@/interfaces'
const BASE_URL = 'http://faceprog.ru/reactcourseapi/cart/'

export const useCartStore = defineStore('cartStore', () => {

  // State Properties ============================

	const carts = ref<Cart[] | null>([])
	const token = ref<string | null>(null)

	// Actions ============================

  function setCart(cart: Cart, tkn: string) {
    carts.value = cart
    token.value = tkn
  }

	async function loadCart() {
		const oldToken = localStorage.getItem('CART__TOKEN') || null
		const response = await fetch(`${BASE_URL}load.php?token=${oldToken}`)
    // if token does not exists, the api generates one
		const { cart, token: tkn, needUpdate } = await response.json() as CartToken

		if (needUpdate) localStorage.setItem('CART__TOKEN', tkn)

    const formattedCart = cart.map(c => ({ id: c.id, qnt: c.cnt }))

		setCart(formattedCart, tkn)
	}

  async function addCart(id: number) {
		if (!inCart(id)) {
			const response = await fetch(
        `${BASE_URL}add.php?token=${token.value}&id=${id}`
      )

			const result: boolean = await response.json()

			if (result) {
        carts.value?.push({ id, qnt: 1 })
      }
		}
  }
	
  async function removeCart(id: number) {
		if (inCart(id)) {
			const response = await fetch(
        `${BASE_URL}remove.php?token=${token.value}&id=${id}`
      )
			const result = await response.json()

			if (result && carts.value) {
				carts.value = carts.value.filter(cart => cart.id != id)
			}
		}
  }

  function setQnt({ id, qnt }: { id: number, qnt: number }) {
		if (inCart(id)) {
			const cartDetail: Product = cartsDetailed().find(cart => cart.id == id)
			const validQnt = Math.min(Math.max(qnt, 1), cartDetail.rest)

      carts.value ? carts.value.find(cart => cart.id == id).qnt = validQnt : null
		}
	}

  // Getters ============================

  function inCart(id: number) {
    return carts.value?.some(cart => cart.id === id)
  }

  function cartsDetailed(): Product[] {
    const productStore = useProductStore()
    // ✨ Get all carts associated with a product by it's id 
    return carts.value?.map(cart => {
      let product = productStore.findProductById(cart.id)
      return { ...product, qnt: cart.qnt }
    })
  }

  const cartsLength = computed(() => carts.value?.length)

  const cartsTotal = computed<number>(() => {
    if (cartsDetailed().length > 0) {
      return cartsDetailed().reduce((t, pr) => t + pr.price * pr.qnt, 0)
    }
    return 0
  })

  return { 
    carts, token, loadCart, 
    addCart, removeCart, setQnt, inCart,
    cartsDetailed, cartsLength, cartsTotal
  }

})
