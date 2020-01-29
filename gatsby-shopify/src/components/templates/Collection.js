import React from 'react';
import { BannerImage, Products, SEO } from 'src/components';
import Layout from 'src/components/Layout';

const Collection = ({ pageContext }) => {
  const { title, imageSrc, products } = pageContext;
  return (
    <Layout>
      <SEO title={title} />
      <BannerImage src={imageSrc} title={title} />
      <Products products={products} />
    </Layout>
  );
};

export default Collection;
