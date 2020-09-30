import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import SEO from '../components/SEO'

export default function SlicemasterPage({ data: { slicemaster } }) {
  console.log(slicemaster)
  return (
    <>
      <SEO
        title={slicemaster.name}
        image={slicemaster.image?.childImageSharp?.src}
      />
      <div className="center">
        <Img fluid={slicemaster.image.childImageSharp.fluid} />
        <h2>
          <span className="mark">{slicemaster.name}</span>
        </h2>
        <p>{slicemaster.description}</p>
      </div>
    </>
  )
}

export const strapiQuery = graphql`
  query($slug: String!) {
    slicemaster: strapiSlicemasters(slug: { eq: $slug }) {
      name
      id
      description
      image {
        childImageSharp {
          fluid(maxWidth: 1000, maxHeight: 750) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`
