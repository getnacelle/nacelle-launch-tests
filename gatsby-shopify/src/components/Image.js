import React from 'react';

const cloudinaryCloudName = process.env.GATSBY_CLOUDINARY_CLOUD_NAME;

const roundedUpToNearest50px = x => {
  if (x >= 50) {
    return +x + 49 - ((+x + 49) % 50);
  }
  // Return a blank string if less than 50px
  return '';
};

const cloudinarySrcString = ({ src, width, height, crop } = {}) => {
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

const SourceCloudinary = ({ src, minWidth, maxWidth, crop, aspectRatio }) => {
  const width = roundedUpToNearest50px(maxWidth);
  const height = aspectRatio
    ? roundedUpToNearest50px((width / aspectRatio[0]) * aspectRatio[1])
    : null;
  if (minWidth && maxWidth) {
    return (
      <source
        media={`(min-width: ${minWidth}px) and (max-width: ${maxWidth}px)`}
        srcSet={cloudinarySrcString({ src, width, height, crop })}
      />
    );
  }
  if (!minWidth && maxWidth) {
    return (
      <source
        media={`(max-width: ${maxWidth}px)`}
        srcSet={cloudinarySrcString({ src, width, height, crop })}
      />
    );
  }
  if (minWidth && !maxWidth) {
    return (
      <source
        media={`(min-width: ${minWidth}px)`}
        srcSet={cloudinarySrcString({ src, width, height, crop })}
      />
    );
  }
};

const Image = ({ src, alt, title, fill, origin }) => {
  const crop = fill ? 'lfill' : '';
  const aspectRatio = fill ? [3, 4] : null;
  const imageSrc = cloudinaryCloudName ? cloudinarySrcString({ src }) : src;
  const sizes = [
    { maxWidth: 768 },
    { minWidth: 769, maxWidth: 1023 },
    { minWidth: 1023, maxWidth: 1215 },
    { minWidth: 1216, maxWidth: 1407 },
    { minWidth: 1408 }
  ];
  if (src) {
    if (origin === 'cloudinary') {
      return (
        <picture>
          {cloudinaryCloudName &&
            sizes.map(el => (
              <SourceCloudinary
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
    }
  }
  return null;
};

Image.defaultProps = {
  origin: 'cloudinary',
  fill: false
};

export default Image;
