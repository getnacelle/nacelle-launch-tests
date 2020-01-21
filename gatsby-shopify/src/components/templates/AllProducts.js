import React from 'react';
import { Product } from '../Product';

const AllProducts = ({ pageContext }) => {
  const { products } = pageContext;
  return (
    <>
      <h1>All Products</h1>
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
    </>
  );
};

export default AllProducts;
