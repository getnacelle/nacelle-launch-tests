import React, { Fragment } from 'react';

import $nacelle from 'services/nacelle';
import ContentSections from 'components/ContentSections';

export default function Shop({ page }) {
  return (
    <Fragment>{page && <ContentSections sections={page.sections} />}</Fragment>
  );
}

export async function getStaticProps({ locale }) {
  try {
    const page = await $nacelle.data.page({ handle: 'shop', locale });
    return {
      props: { page }
    };
  } catch (err) {
    console.error(`Error fetching products on shop page:\n${err}`);
  }
}
