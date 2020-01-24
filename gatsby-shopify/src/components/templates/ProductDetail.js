import React from 'react';
import Product from '../Product';
import Layout from './Layout';

const ProductDetail = ({ pageContext }) => {
  const { title, handle, imageSrc, variants } = pageContext;
  return (
    <Layout>
      <Product
        title={title}
        handle={handle}
        src={imageSrc}
        variants={variants}
      />
    </Layout>
  );
};

export default ProductDetail;
