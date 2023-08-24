import { routes } from '@/router'

describe('Router Tests', () => {
  test('the router should have this configuration', () => {

    expect(routes).toMatchObject([
      { name: 'catalog', path: '/', component: expect.any(Function) },
      { name: 'cart', path: '/cart', component: expect.any(Function) },
      { 
        name: 'product', 
        path: '/product/:id', 
        component: expect.any(Function),
        props: expect.any(Function)
      },
      { name: 'checkout', path: '/order', component: expect.any(Function) },
      { path: '/:any(.*)', component: expect.any(Function) }
    ])
  })

  test.each`
    name
    ${'catalog'}  
    ${'cart'}  
    ${'product'}
    ${'checkout'}
  `(
    'should have this router name: $name', ({ name }) => {
      const routeObj = routes.find(route => route.name === name)
      expect(routeObj.name).toBe(name)
    }
  )

  test('product router should return the segment id as a prop', () => {
    const routeSegment = { params: { id: '123Testing' } }

    const productRouter = routes.find(route => route.name === 'product')

    expect(productRouter.props(routeSegment)).toEqual({ id: routeSegment.params.id })
  })
})