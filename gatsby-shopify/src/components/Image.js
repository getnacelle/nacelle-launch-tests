import React from 'react';

const cloudinaryCloudName = process.env.GATSBY_CLOUDINARY_CLOUD_NAME;

const Image = ({ src, title }) => {
  let imageSrc;
  const cloudinaryPrefix = 'https://res.cloudinary.com/';
  if (cloudinaryCloudName) {
    imageSrc = `${cloudinaryPrefix}${cloudinaryCloudName}/image/fetch/f_auto/w_auto/${src}`;
  } else imageSrc = src;
  return (
    <picture>
      <img src={imageSrc} alt={title} />
    </picture>
  );
};

export default Image;
