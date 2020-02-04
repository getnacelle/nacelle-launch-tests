import React from 'react';
import styled from 'styled-components';
import Product from './Product';

const ProductGrid = styled.ul`
  display: grid;
  list-style-type: none;
  grid-template-columns: repeat(auto-fit, minmax(22em, 1fr));
  margin-left: 0;
  grid-row-gap: 2em;
  justify-items: center;
  justify-content: center;
  li {
    margin: 0 auto;
    padding: 0;
    max-width: 80%;
  }
  a {
    text-decoration: none;
    cursor: default;
  }
  @media screen and (min-width: 1023px) {
    min-width: 70%;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2em;
  margin-bottom: 2em;
`;

const Products = ({ products }) => (
  <Container>
    <ProductGrid>
      {products.map(el => (
        <li key={el.handle}>
          <Product
            title={el.title}
            handle={el.handle}
            src={el.featuredMedia ? el.featuredMedia.src : null}
            variants={el.variants}
          />
        </li>
      ))}
    </ProductGrid>
  </Container>
);
export default Products;
