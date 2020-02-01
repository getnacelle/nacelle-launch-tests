import React from 'react';

const Description = ({ content }) => {
  if (content) {
    if (content.includes('</')) {
      return <p dangerouslySetInnerHTML={{ __html: content }} />;
    }
    return <p>{content}</p>;
  }
  return null;
};

export default Description;
