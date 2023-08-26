import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import ProductDetail from '@/views/ProductDetail.vue'

import { productsMockData } from '../__mocks__/mock-data/products-data'
import { useProductStore } from '@/store/productStore'

describe('ProductDetail.vue component', () => {
  var formatPrice = vi.fn(num => num)
  var mockRouter = { push: vi.fn() }

  let wrapper
  let productStore
  // SETUP - run prior to each unit test
  beforeEach(() => {
    setActivePinia(createPinia())

    productStore = useProductStore()

    wrapper = shallowMount(ProductDetail, {
      props: { id: '101' },
      global: { 
        components: { 'router-link': RouterLinkStub },
        plugins: [createTestingPinia({
          initialState: {
            productStore: { products: productsMockData }
          }
        })]
      },
    })
  })

  afterEach(() => wrapper.unmount())

  test('should match snapshot', () => expect(wrapper.html()).toMatchSnapshot())

  test('should render product info correctly', () => {
    expect(wrapper.find('p').text()).toBe('Samsung AAZ8')
    expect(wrapper.find('.alert').text()).toBe('Price: $22,000.00')
  })

  test('to prop should push to catalog page whenever router-link is clicked', () => {
    const expectedObj = { name: 'catalog' }
    expect(wrapper.findComponent(RouterLinkStub).props().to).toMatchObject(expectedObj)
  })

})