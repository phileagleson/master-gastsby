import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import styled from 'styled-components'
import SEO from '../components/SEO'

const PizzaGridStyles = styled.div`
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
`

export default function SinglePizzaPage({ data: { pizza } }) {
  return (
    <>
      <SEO
        image={pizza.image?.childImageSharp?.fluid?.src}
        title={pizza.name}
      />
      <PizzaGridStyles>
        <Img fluid={pizza.image.childImageSharp.fluid} />
        <div>
          <h2 className="mark">{pizza.name}</h2>
          <ul>
            {pizza.toppings.map((topping) => (
              <li key={topping.id}>{topping.name}</li>
            ))}
          </ul>
        </div>
      </PizzaGridStyles>
    </>
  )
}

// need dynamic pizza based on slug
export const strapiQuery = graphql`
  query($slug: String!) {
    pizza: strapiPizzas(slug: { eq: $slug }) {
      name
      id
      image {
        childImageSharp {
          fluid(maxWidth: 800) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      toppings {
        name
        id
        vegetarian
      }
    }
  }
`
