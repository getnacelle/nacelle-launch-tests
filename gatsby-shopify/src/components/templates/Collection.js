import React from 'react';
import { BannerImage, Products, PageNavButtons, SEO } from 'src/components';
import Layout from 'src/components/Layout';

const Collection = ({ pageContext, path }) => {
  const {
    title,
    imageSrc,
    products,
    handle,
    currentPage,
    numPages
  } = pageContext;
  return (
    <Layout>
      <SEO title={title} />
      <BannerImage src={imageSrc} title={title} fill />
      <Products products={products} />
      <PageNavButtons
        path={path}
        handle={handle}
        currentPage={currentPage}
        numPages={numPages}
      />
    </Layout>
  );
};

export default Collection;
