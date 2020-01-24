import React from 'react';
import styled from 'styled-components';
import Product from './Product';

const ProductGrid = styled.ul`
  display: grid;
  list-style-type: none;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 1em;
  grid-row-gap: 1em;
`;

const Container = styled.div`
  margin: 2em auto;
`;

const Products = ({ products }) => (
  <Container>
    <ProductGrid>
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
    </ProductGrid>
  </Container>
);

export default Products;
