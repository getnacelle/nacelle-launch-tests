import React from 'react';

const cloudinaryCloudName = process.env.GATSBY_CLOUDINARY_CLOUD_NAME;

const roundedUpToNearest50px = x => {
  if (x >= 50) {
    return +x + 49 - ((+x + 49) % 50);
  }
  // Return a blank string if less than 50px
  return '';
};

const cloudinarySrc = ({ src, width, height, crop } = {}) => {
  const cloudinaryPrefix = 'https://res.cloudinary.com/';
  const baseString = `${cloudinaryPrefix}${cloudinaryCloudName}/image/fetch/f_auto`;
  const getDimensionsString = () => {
    if (!width && !height) {
      return 'w_auto';
    }
    if (width && !height) {
      return `w_${width}`;
    }
    if (width && height) {
      return `w_${width},h_${height}`;
    }
    return null;
  };
  const getCropString = () => (crop ? `,c_${crop}` : '');
  const dimensionsString = getDimensionsString(width, height);
  const cropString = getCropString(crop);
  return `${baseString}/${dimensionsString}${cropString},dpr_auto/${src}`;
};

const Source = ({ src, minWidth, maxWidth, crop, aspectRatio }) => {
  const width = roundedUpToNearest50px(maxWidth);
  const height = aspectRatio
    ? roundedUpToNearest50px((width / aspectRatio[0]) * aspectRatio[1])
    : null;
  if (minWidth && maxWidth) {
    return (
      <source
        media={`(min-width: ${minWidth}px) and (max-width: ${maxWidth}px)`}
        srcSet={cloudinarySrc({ src, width, height, crop })}
      />
    );
  }
  if (!minWidth && maxWidth) {
    return (
      <source
        media={`(max-width: ${maxWidth}px)`}
        srcSet={cloudinarySrc({ src, width, height, crop })}
      />
    );
  }
  if (minWidth && !maxWidth) {
    return (
      <source
        media={`(min-width: ${minWidth}px)`}
        srcSet={cloudinarySrc({ src, width, height, crop })}
      />
    );
  }
};

const Image = ({ src, alt, title, hero }) => {
  const crop = hero ? 'lfill' : '';
  const aspectRatio = hero ? [3, 4] : null;
  const imageSrc = cloudinaryCloudName ? cloudinarySrc({ src }) : src;
  const sizes = [
    { maxWidth: 768 },
    { minWidth: 769, maxWidth: 1023 },
    { minWidth: 1023, maxWidth: 1215 },
    { minWidth: 1216, maxWidth: 1407 },
    { minWidth: 1408 }
  ];
  return (
    <picture>
      {cloudinaryCloudName &&
        sizes.map(el => (
          <Source
            src={src}
            crop={crop}
            minWidth={el.minWidth}
            maxWidth={el.maxWidth}
            aspectRatio={aspectRatio}
            key={`${el.minWidth}-${el.maxWidth}`}
          />
        ))}
      <img src={imageSrc} alt={alt || title} sizes="100vw" />
    </picture>
  );
};

export default Image;
