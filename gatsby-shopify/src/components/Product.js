import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'gatsby';
import { addToCart } from '../state/actions';

export const Product = ({ title, handle, src, variants }) => {
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
    <article
      style={{
        width: '15em',
        borderBottom: '1px solid black',
        padding: '3em 0'
      }}
    >
      <h1>
        {handle ? <Link to={`/products/${handle}`}>{title}</Link> : title}
      </h1>
      {src && <img src={src} alt={title} style={{ width: '15em' }} />}
      {hasMultipleVariants && (
        <div>
          <select name="choice" onBlur={handleChange} onChange={handleChange}>
            {variants.map((el, idx) => (
              <option value={idx} key={el.id}>
                {el.title}
              </option>
            ))}
          </select>
        </div>
      )}
      <p>$ {Number(selectedVariant.price).toFixed(2)}</p>
      <button type="button" onClick={addToCartMemo}>
        Add To Cart
      </button>
    </article>
  );
};
