import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductDetail from '@/views/ProductDetail.vue'

describe('ProductDetail.vue component', () => {
  var formatPrice = vi.fn(num => num)

  let wrapper
  // SETUP - run prior to each unit test
  beforeEach(() => {
    setActivePinia(createPinia())

    wrapper = shallowMount(ProductDetail, {
      props: { id: '101' },
      global: { components: { 'router-link': RouterLinkStub }}
    })
  })

  test('should match snapshot', () => {
    console.log(wrapper.html())
  })

})