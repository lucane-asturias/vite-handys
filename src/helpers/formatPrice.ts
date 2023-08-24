const formatPrice = (price: number): string => {
  const options = { minimumFractionDigits: 2, style: "currency", currency: "USD" }
  return new Intl.NumberFormat('en-US', options).format(price)
}

export default formatPrice