import React from 'react';

import { Image } from '@nacelle/react-components';
import * as styles from './HeroBanner.styles';

const IMAGE_FORMATS = ['webp', 'jpg'];

const HeroBanner = ({ fields }) => {
  const image = fields?.featuredMedia?.fields;

  return (
    image && (
      <div css={styles.block}>
        <Image
          src={image?.file?.url}
          width={1800}
          css={styles.image}
          format={IMAGE_FORMATS}
        />
        <h1 css={styles.bannerTitle}>{fields.title}</h1>
        <h2 css={styles.bannerSubtitle}>{fields.subtitle}</h2>
      </div>
    )
  );
};

export default HeroBanner;
