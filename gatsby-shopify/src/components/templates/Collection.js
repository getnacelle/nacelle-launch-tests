import React from 'react';
import { HeroImage, Products, SEO } from 'src/components';
import Layout from 'src/components/Layout';

const Collection = ({ pageContext }) => {
  const { title, imageSrc, products } = pageContext;
  return (
    <Layout>
      <SEO title={title} />
      <HeroImage src={imageSrc} title={title} />
      <Products products={products} />
    </Layout>
  );
};

export default Collection;
