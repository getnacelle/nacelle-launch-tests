import React, { useState } from 'react';
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

const LoadButton = styled.button`
  border: 1px solid rgba(0, 0, 0, 10%);
  width: 14em;
  height: 3em;
  border-radius: 5px;
  padding: 0.25em 2em;
  background-color: #0a2a7b;
  color: white;
  cursor: pointer;
`;

const Products = ({ products }) => {
  const itemsPerPage = 24;
  const [indexStart, setIndexStart] = useState(0);
  const isMoreToLoad = products.length - indexStart > itemsPerPage;
  function loadNextPage() {
    setIndexStart(indexStart + itemsPerPage);
  }
  return (
    <Container>
      <ProductGrid>
        {products.slice(0, itemsPerPage + indexStart).map(el => (
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
      {isMoreToLoad && (
        <LoadButton type="button" onClick={() => loadNextPage()}>
          Load More
        </LoadButton>
      )}
    </Container>
  );
};

export default Products;
