import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'gatsby';
import styled from 'styled-components';
import Image from './Image';
import { addToCart } from '../state/actions';

const ProductCard = styled.article`
  display: grid;
  grid-template-rows: 4em 10em 4em 3em 2em;
  justify-content: center;
  text-align: center;
  min-width: 15em;
  max-width: 20em;
  padding: 3em;
  border: 1px solid rgba(0, 0, 0, 15%);
  border-radius: 0.3em;
  a {
    text-decoration: none;
    font-size: 0.8em;
  }
  select {
    margin: 1em;
  }
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
      <h2>
        {handle ? <Link to={`/products/${handle}`}>{title}</Link> : title}
      </h2>
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
      <button type="button" onClick={addToCartMemo}>
        Add To Cart
      </button>
    </ProductCard>
  );
};

export default Product;
