import React from 'react'
import { ItemsGrid, ItemStyles } from '../styles/Grids'

export default function ItemGrid({ items }) {
  return (
    <ItemsGrid>
      {items.map((item) => (
        <ItemStyles key={item._id}>
          <p>
            <span className="mark">{item.name}</span>
          </p>
          <img
            width="500"
            height="400"
            src={`${process.env.GATSBY_STRAPI_UPLOADS_ENDPOINT}${item.image.url}`}
            alt={item.name}
            style={{
              width: 225,
              height: 180,
              objectFit: 'cover',
              backgroundSize: 'cover,',
            }}
          />
        </ItemStyles>
      ))}
    </ItemsGrid>
  )
}

