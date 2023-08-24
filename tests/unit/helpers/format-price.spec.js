import formatPrice from '@/helpers/formatPrice'

describe('Dolar Format - helper price function', () => {
  
  test.each`
    integer  | expectedResult
    ${1}     | ${'$1.00'}
    ${10}    | ${'$10.00'}
    ${100}   | ${'$100.00'}
    ${1000}  | ${'$1,000.00'}
    ${10000} | ${'$10,000.00'}
  `(
    '$integer should return a string formatted in dolar: $expectedResult', 
    ({ integer, expectedResult }) => {
      expect(formatPrice(integer)).toBeTypeOf('string')
      expect(formatPrice(integer)).toBe(expectedResult)
    }
  )

})