import React from 'react';
import { Product } from '../Product';

const Collection = ({ pageContext }) => {
  const { title, imageSrc, handles, allProducts } = pageContext;
  const products = allProducts.filter(product =>
    handles.includes(product.handle)
  );
  return (
    <div style={{ position: 'relative' }}>
      <h1>{title}</h1>
      <img src={imageSrc} alt={title} style={{ width: '30em' }} />
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
    </div>
  );
};

export default Collection;
