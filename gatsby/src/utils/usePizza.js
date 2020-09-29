import { useState, useContext } from 'react'
import OrderContext from '../components/OrderContext'
import formatMoney from './formatMoney'
import calculateOrderTotal from './calculateOrderTotal'
import attachNamesAndPrices from './attachNamesAndPrices'
export default function usePizza({ pizzas, values }) {
  // 1. Create some state to hold our order
  //We got rid of this line because we moved useState to the provider
  //const [order, setOrder] = useState([])
  // Now we access both our state an our updater functions via context
  const [order, setOrder] = useContext(OrderContext)
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(false)
  // 2. Make a function to add things to order
  function addToOrder(orderedPizza) {
    setOrder([...order, orderedPizza])
  }
  // 3. Make a function to remove things from order
  function removeFromOrder(index) {
    setOrder([
      // everything before the item we want to remove
      ...order.slice(0, index),
      // everything after the item we want to remove
      ...order.slice(index + 1),
    ])
  }

  // this is the function that is run when someone submits the form
  async function submitOrder(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    // gather all the data
    const body = {
      order: attachNamesAndPrices(order, pizzas),
      total: formatMoney(calculateOrderTotal(order, pizzas)),
      name: values.name,
      email: values.email,
      mapleSyrup: values.mapleSyrup,
    }

    // 4. Send data to a serverless function on checkout
    const res = await fetch(
      `${process.env.GATSBY_SERVERLESS_BASE}/placeOrder`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )
    const text = JSON.parse(await res.text())

    // check if everything worked
    if (res.status >= 400 && res.status < 600) {
      setLoading(false)
      setError(text.message)
    } else {
      // it worked
      setLoading(false)
      setMessage('Success! Come on down for your pizza')
    }
  }
  return {
    order,
    addToOrder,
    removeFromOrder,
    error,
    loading,
    message,
    submitOrder,
  }
}
