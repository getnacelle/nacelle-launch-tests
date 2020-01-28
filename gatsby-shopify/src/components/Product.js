import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Image from './Image';
import { addToCart } from '../state/cart-actions';

const ProductCard = styled.article`
  display: grid;
  grid-template-rows: 4em 1fr 4em 3em 2em;
  grid-column-gap: 2em;
  justify-content: center;
  text-align: center;
  min-width: 20%;
  padding: 2em;
  border: 1px solid rgba(0, 0, 0, 15%);
  border-radius: 0.3em;
  color: #212736;
  a {
    text-decoration: none;
    font-size: 0.8em;
  }
  select {
    margin: 1em;
  }
`;

const ButtonContainer = styled.div`
  margin: 1em 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 3em;
`;

const CartButton = styled.button`
  border: 1px solid rgba(0, 0, 0, 10%);
  width: 12em;
  border-radius: 5px;
  padding: 0.25em 2em;
  background-color: #212736;
  color: white;
  cursor: pointer;
`;

const Product = ({ title, handle, src, variants }) => {
  const dispatch = useDispatch();
  const hasMultipleVariants = variants.length > 1;
  const [selectedVariant, selectVariant] = useState(variants[0]);
  const handleChange = e => selectVariant(variants[e.target.value]);
  const addToCartMemo = useCallback(
    () =>
      dispatch(
        addToCart({
          title,
          handle,
          src,
          variant: selectedVariant
        })
      ),
    [dispatch, handle, selectedVariant, src, title]
  );
  return (
    <ProductCard>
      <h2>{title}</h2>
      {src && <Image src={src} alt={title} />}
      {hasMultipleVariants ? (
        <div>
          <select name="choice" onBlur={handleChange} onChange={handleChange}>
            {variants.map((el, idx) => (
              <option value={idx} key={el.id}>
                {el.title}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div />
      )}
      <p>$ {Number(selectedVariant.price).toFixed(2)}</p>
      <ButtonContainer>
        <CartButton type="button" onClick={addToCartMemo}>
          Add To Cart
        </CartButton>
      </ButtonContainer>
    </ProductCard>
  );
};

export default Product;
