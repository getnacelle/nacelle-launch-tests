import React from 'react';
import { HeroImage, Products } from 'src/components';
import Layout from 'src/components/Layout';

const Collection = ({ pageContext }) => {
  const { title, imageSrc, products } = pageContext;
  return (
    <Layout>
      <HeroImage src={imageSrc} title={title} />
      <Products products={products} />
    </Layout>
  );
};

export default Collection;
