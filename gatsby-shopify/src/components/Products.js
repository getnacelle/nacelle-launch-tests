import React from 'react';
import { Product } from './Product';

const Products = ({ products }) => (
  <ul style={{ listStyleType: 'none' }}>
    {products.map(el => (
      <li key={el.handle}>
        <Product
          title={el.title}
          handle={el.handle}
          src={el.featuredMedia.src}
          variants={el.variants}
        />
      </li>
    ))}
  </ul>
);

export default Products;
