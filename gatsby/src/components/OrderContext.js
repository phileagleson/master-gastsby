import React, { useState } from 'react'

// Create a order context
const OrderContext = React.createContext()

export function OrderProvider({ children }) {
  // we need to add state here
  const [order, setOrder] = useState([])
  return (
    <OrderContext.Provider value={[order, setOrder]}>
      {children}
    </OrderContext.Provider>
  )
}

export default OrderContext
