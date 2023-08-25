import { createPinia, setActivePinia } from 'pinia'
import { shallowMount } from '@vue/test-utils'
import { useProductStore } from '@/store/productStore'
import { productsMockData } from '../__mocks__/mock-data/products-data'

global.fetch = vi.fn()

function createFetchResponse(data) {
  return { json: () => new Promise((resolve) => resolve(data)) }
}

fetch.mockResolvedValue(createFetchResponse(productsMockData))

describe('Pinia - Product Store', () => {
  let productStore
  // SETUP - run prior to each unit test
  beforeEach(() => {
    setActivePinia(createPinia())

    // create an instance of the auth store
    productStore = useProductStore()
  })

  afterEach(() => vi.clearAllMocks())

  // Basics ==================
  
  test('this is the initial and default state, should\'ve this state', () => {
    expect(productStore.products).toHaveLength(0)
  })

  test('this is the initial mocked state', async () => {
    await productStore.loadProducts()
    expect(productStore.products).toStrictEqual(productsMockData)
  })

  // Getters ==================

  test('getters: getAllProducts', async () => {
    await productStore.loadProducts()
    expect(productStore.getAllProducts).toStrictEqual(productsMockData)
  })

  test('getters: findProductById', async () => {
    await productStore.loadProducts()
    const product100 = productStore.findProductById(100)
    const testProduct100 = productsMockData.find(
      product => product.id === 100
    )

    expect(product100).toStrictEqual(testProduct100)
  })
})