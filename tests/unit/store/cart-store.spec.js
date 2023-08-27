import { createPinia, setActivePinia } from 'pinia'
import { useCartStore } from '@/store/cartStore'
import { useProductStore } from '@/store/productStore'
import { productsMockData } from '../__mocks__/mock-data/products-data'

global.fetch = vi.fn()

const createFetchResponse = (data) => {
  return { json: () => new Promise((resolve) => resolve(data)) }
}

describe('Pinia - Cart Store', () => {
  const mockedCartData = { id: 100, qnt: 1 }

  // track call history from localStorage
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
  const getItemSpy = vi.spyOn(Storage.prototype, 'getItem')

  let cartStore
  let productStore
  // SETUP - run prior to each unit test
  beforeEach(() => {
    fetch.mockResolvedValue(createFetchResponse({
      cart: [{
        id: 105,
        cnt: null
      }],
      token: "this-is-a-test",
      needUpdate: true
    }))

    setActivePinia(createPinia())

    cartStore = useCartStore()
    productStore = useProductStore()
  })

  afterEach(() => {
    global.fetch.mockReset()
    vi.clearAllMocks()
    localStorage.clear()
    getItemSpy.mockClear()
    setItemSpy.mockClear()
  })

  const setupCartAndProductStores = async () => {
    // 1. Load items in cart
    await cartStore.loadCart()
    // 2. Seed product store - mock result with mock data
    fetch.mockResolvedValue(createFetchResponse(productsMockData))
    await productStore.loadProducts()
    expect(productStore.products).toStrictEqual(productsMockData)
    // 3. Add one product in cart
    fetch.mockResolvedValue(createFetchResponse(true))
    await cartStore.addCart(mockedCartData.id)
  }

  const findCartById = (id) => cartStore.carts.find(cart => cart.id === id)

  // Basics ==================
  
  test('this is the initial and default state, should\'ve this state', () => {
    expect(cartStore.carts).toHaveLength(0)
    expect(cartStore.carts).toStrictEqual([])
    expect(cartStore.token).toBe(null)
  })

  test('this is the initial mocked state', async () => {
    await cartStore.loadCart()

    expect(getItemSpy).toHaveBeenCalled()
    expect(setItemSpy).toHaveBeenCalled()

    const cartObj = { cart: expect.any(Array) }

    expect(localStorage.getItem('CART__TOKEN')).toBe('this-is-a-test')
    expect(cartStore.carts).toStrictEqual([{ id: 105, qnt: null }])
    expect(cartStore.token).toBe('this-is-a-test')
  })

  // Actions ==================

  test('action: addCart', async () => {
    await cartStore.loadCart()
    // mock resolve: whether adding was successful or not
    fetch.mockResolvedValue(createFetchResponse(true))

    await cartStore.addCart(mockedCartData.id)

    expect(cartStore.carts.find(
      cart => cart.id === mockedCartData.id
    )).toStrictEqual({ 
      id: mockedCartData.id, 
      qnt: mockedCartData.qnt 
    })

    expect(cartStore.carts).toStrictEqual([
      { id: 105, qnt: null }, 
      mockedCartData
    ])
  })

  test('action: removeCart', async () => {
    await cartStore.loadCart()
    // mock resolve: whether the removal succeeded or failed
    fetch.mockResolvedValue(createFetchResponse(true))

    await cartStore.removeCart(105)

    expect(cartStore.carts).toHaveLength(0)
    expect(cartStore.carts.find(cart => cart.id === 105)).toBeUndefined()    
  })

  test('action: setQnt', async () => {
    await setupCartAndProductStores()

    expect(cartStore.carts).toStrictEqual([
      { id: 105, qnt: null, }, 
      mockedCartData
    ])

    // 1. Set product quantity
    expect(findCartById(mockedCartData.id)).toStrictEqual({ 
      id: mockedCartData.id, qnt: mockedCartData.qnt 
    })

    cartStore.setQnt({ id: mockedCartData.id, qnt: mockedCartData.qnt + 1 })

    expect(findCartById(mockedCartData.id)).toStrictEqual({
      id: mockedCartData.id, qnt: mockedCartData.qnt + 1 
    })

    // 2. Check if product quantity in cart does not exceed stock maximum
    cartStore.setQnt({ id: mockedCartData.id, qnt: mockedCartData.qnt + 11 })    
    expect(findCartById(mockedCartData.id).qnt).toBe(10)
    expect(Math.min(Math.max(13, 1), 10)).toBe(10)

    // 3. Check if product quantity in cart does not go beyong stock minimum
    cartStore.setQnt({ id: mockedCartData.id, qnt: mockedCartData.qnt - 999 })    
    expect(findCartById(mockedCartData.id).qnt).toBe(1)
    expect(Math.min(Math.max(-999, 1), 10)).toBe(1)
  })

  // Getters ==================

  test('getter: inCart', async () => {
    await cartStore.loadCart()
    let inCart = cartStore.inCart(105)
    expect(inCart).toBeTruthy()

    inCart = cartStore.inCart(999)
    expect(inCart).toBeFalsy()
  })

  test('getter: cartsDetailed', async () => {
    await setupCartAndProductStores()

    // Return product with details about a specific product
    const detailedMock = cartStore.cartsDetailed()

    const productInCartByMockedId = productsMockData.find(cart => cart.id === mockedCartData.id)

    expect(detailedMock).toEqual([
      { id: 105, title: 'Huawei XZ', price: 15000, rest: 8, qnt: null },
      { ...productInCartByMockedId, qnt: 1 }
    ])
  })

  test('getter: cartsTotal', async () => {
    await setupCartAndProductStores()

    cartStore.setQnt({ id: mockedCartData.id, qnt: mockedCartData.qnt + 55 })
    await cartStore.addCart(103)

    expect(cartStore.carts).toStrictEqual([
      { id: 105, qnt: null }, { id: 100, qnt: 10 }, { id: 103, qnt: 1 }
    ])
    
    const total = cartStore.cartsTotal

    expect(total).toBe(125000)
    expect(5000 * 1 + 12000 * 10).toBe(125000)
  })
})
