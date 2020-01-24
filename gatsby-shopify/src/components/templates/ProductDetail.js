import React from 'react';
import Layout from 'src/components/Layout';
import Product from '../Product';

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
