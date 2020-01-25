import React from 'react';
import styled from 'styled-components';
import Product from './Product';

const ProductGrid = styled.ul`
  display: grid;
  list-style-type: none;
  grid-template-columns: repeat(auto-fit, minmax(20em, 1fr));
  grid-column-gap: 1em;
  grid-row-gap: 1em;
  margin: 0;
  @media screen and (min-width: 1023px) {
    min-width: 70%;
  }
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
