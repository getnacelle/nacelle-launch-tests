import React, { Fragment } from 'react';

import $nacelle from 'services/nacelle.js';
import useCollection from 'hooks/useCollection';
import ContentSections from 'components/ContentSections';
import ProductGallery from 'components/ProductGallery';

const Collection = ({ collection, page }) => {
  const products = useCollection(collection);

  return (
    <Fragment>
      {page && <ContentSections sections={page.sections} />}
      <ProductGallery products={products} />
    </Fragment>
  );
};

export default Collection;

export async function getStaticPaths() {
  try {
    const collections = await $nacelle.data.allCollections();
    return {
      paths: collections.map((collection) => {
        const { handle } = collection;
        return { params: { handle } };
      }),
      fallback: false
    };
  } catch (err) {
    console.error(`Error fetching collections on collection PLP:\n${err}`);
  }
}

export async function getStaticProps({ params, locale }) {
  let collection, page;

  try {
    collection = await $nacelle.data.collection({
      handle: params.handle
    });
  } catch (err) {
    console.warn(`Can't find collection with handle '${params.handle}'`);
  }

  try {
    page = await $nacelle.data.page({
      handle: params.handle,
      locale
    });
  } catch (err) {
    console.warn(`Can't find page with handle '${params.handle}'`);
  }

  return {
    props: { collection, page: page || null } // will be passed to the page component as props
  };
}
