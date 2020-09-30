import React, { useState } from 'react'
import SEO from '../components/SEO'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import useForm from '../utils/useForm'
import calculatePizzaPrice from '../utils/calculatePizzaPrice'
import formatMoney from '../utils/formatMoney'
import OrderStyles from '../styles/OrderStyles'
import MenuItemStyles from '../styles/MenuItemStyles'
import usePizza from '../utils/usePizza'
import calculateOrderTotal from '../utils/calculateOrderTotal'
import PizzaOrder from '../components/PizzaOrder'

export default function OrderPage({ data }) {
  const pizzas = data.pizzas.nodes
  const { values, updateValue } = useForm({
    email: '',
    name: '',
    mapleSyrup: '',
  })
  const {
    order,
    addToOrder,
    removeFromOrder,
    error,
    loading,
    message,
    submitOrder,
  } = usePizza({
    pizzas,
    values: values,
  })
  if (message) {
    return <p>{message}</p>
  }
  return (
    <>
      <SEO title="Order a Pizza!" />
      <OrderStyles onSubmit={submitOrder}>
        <fieldset disabled={loading}>
          <legend>Your Info</legend>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={updateValue}
            id="name"
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={updateValue}
            id="email"
          />
          <input
            type="mapleSyrup"
            name="mapleSyrup"
            value={values.mapleSyrup}
            onChange={updateValue}
            id="email"
            className="mapleSyrup"
          />
        </fieldset>
        <fieldset className="menu" disabled={loading}>
          <legend>Menu</legend>
          {pizzas.map((pizza) => (
            <MenuItemStyles key={pizza.id}>
              <Img
                fluid={pizza.image?.childImageSharp?.fluid}
                width="50"
                height="50"
                alt={pizza.name}
              />
              <div>
                <h2>{pizza.name}</h2>
              </div>
              <div>
                {['S', 'M', 'L'].map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() =>
                      addToOrder({
                        id: pizza.id,
                        size,
                      })
                    }
                  >
                    {size} {formatMoney(calculatePizzaPrice(pizza.price, size))}
                  </button>
                ))}
              </div>
            </MenuItemStyles>
          ))}
        </fieldset>
        <fieldset className="order" disabled={loading}>
          <legend>Order</legend>
          <PizzaOrder
            order={order}
            removeFromOrder={removeFromOrder}
            pizzas={pizzas}
          />
        </fieldset>
        <fieldset>
          <h3>
            Your Total is {formatMoney(calculateOrderTotal(order, pizzas))}
          </h3>
          <div>{error ? <p>Error: {error} </p> : ''}</div>
          <button type="submit" disabled={loading}>
            {loading ? 'Placing Order...' : 'Order Ahead'}
          </button>
        </fieldset>
      </OrderStyles>
    </>
  )
}

export const strapiQuery = graphql`
  query OrderPizzaQuery {
    pizzas: allStrapiPizzas {
      nodes {
        name
        id
        slug
        price
        image {
          childImageSharp {
            fluid(maxWidth: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
