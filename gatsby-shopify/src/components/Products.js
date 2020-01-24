import React from 'react';
import styled from 'styled-components';
import Product from './Product';

const ProductGrid = styled.ul`
  display: grid;
  min-width: 70%;
  list-style-type: none;
  grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));
  grid-column-gap: 1em;
  grid-row-gap: 1em;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2em;
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
