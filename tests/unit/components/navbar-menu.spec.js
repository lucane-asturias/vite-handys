import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import NavbarMenu from '@/components/NavbarMenu.vue'

describe('NavbarMenu.vue component', () => {

  let wrapper
  // SETUP - run prior to each unit test
  beforeEach(() => {
    setActivePinia(createPinia())

    wrapper = shallowMount(NavbarMenu, {
      global: { components: { 'router-link': RouterLinkStub }}
    })
  })

  test('should match snapshot', () => expect(wrapper.html()).toMatchSnapshot())

  test('should iterate three router-link menus', () => {
    expect(wrapper.findAllComponents(RouterLinkStub).length).toBe(3)
  })

  test.each`
    index | route         | expectedObj
    ${0}  | ${'catalog'}  | ${{ name: 'catalog' }}
    ${1}  | ${'cart'}     | ${{ name: 'cart' }}
    ${2}  | ${'checkout'} | ${{ name: 'checkout' }}
  `(
    'menu items should navigate to their respective route: $route', 
    ({ index, expectedObj }) => {
      expect(wrapper.findAllComponents(RouterLinkStub).at(index).props().to)
      .toMatchObject(expectedObj)
    }
  )
  
  test('default values for computed properties should be 0', () => {
    expect(wrapper.vm.cartsTotal).toBe(0)
    expect(wrapper.vm.cartsLength).toBe(0)
    expect(wrapper.text()).toContain('In Cart: 0')
    expect(wrapper.text()).toContain('Total: $0.00')
  })

})