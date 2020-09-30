import React from 'react'
import { graphql, Link } from 'gatsby'
import Img from 'gatsby-image'
import styled from 'styled-components'
import Pagination from '../components/Pagination'
import SEO from '../components/SEO'

const SlicemasterGridStyles = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
`
const SlicemasterStyles = styled.div`
  a {
    text-decoration: none;
  }

  .gatsby-image-wrapper {
    height: 400px;
  }

  h2 {
    transform: rotate(-2deg);
    text-align: center;
    font-size: 4rem;
    margin-bottom: -2rem;
    position: relative;
    z-index: 2;
  }

  .description {
    background: var(--yellow);
    padding: 1rem;
    margin: 2rem;
    margin-top: -6rem;
    z-index: 2
    position: relative;
    transform: rotate(1deg);
    text-align: center;
  }
`
export default function SlicemastersPage({ data, pageContext }) {
  const slicemasters = data.slicemasters.nodes

  return (
    <>
      <SEO title={`Slicemasters - Page ${pageContext.currentPage} || 1`} />
      <Pagination
        pageSize={+process.env.GATSBY_PAGE_SIZE}
        totalCount={data.slicemasters.totalCount}
        currentPage={pageContext.currentPage || 1}
        skip={pageContext.skip}
        base="/slicemasters"
      />
      <SlicemasterGridStyles>
        {slicemasters.map((person) => (
          <SlicemasterStyles key={person.id}>
            <Link to={`/slicemaster/${person.slug}`}>
              <h2>
                <span className="mark">{person.name}</span>
              </h2>
            </Link>
            <Img fluid={person.image.childImageSharp.fluid} />
            <p className="description">{person.description}</p>
          </SlicemasterStyles>
        ))}
      </SlicemasterGridStyles>
    </>
  )
}

export const strapiQuery = graphql`
  query($skip: Int = 0, $pageSize: Int = 2) {
    slicemasters: allStrapiSlicemasters(limit: $pageSize, skip: $skip) {
      totalCount
      nodes {
        name
        id
        slug
        description
        image {
          childImageSharp {
            fluid(maxWidth: 410) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
