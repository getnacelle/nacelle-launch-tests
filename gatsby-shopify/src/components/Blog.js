import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import HeroImage from './HeroImage';

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
`;

const BlogArticle = styled.article`
  width: 90%;
  max-width: 800px;
  margin: 1em;
  padding: 1em;
  border: 1px solid rgba(0, 0, 0, 20%);
  border-radius: 3px;
  a {
    text-decoration: none;
  }
  p {
    margin-top: 1em;
  }
  h2 {
    margin-top: 1em;
    a {
      color: #212736;
    }
  }
`;

const Blog = ({ item, page }) => {
  const { title, handle, excerpt } = item;
  const src = item.featuredMedia ? item.featuredMedia.src : null;
  return (
    <FlexCenter>
      <BlogArticle>
        {src && <HeroImage src={src} alt={title} />}
        <h2>{handle && <Link to={`/${page}/${handle}`}>{title}</Link>}</h2>
        {excerpt && <p>{excerpt}</p>}
        {handle && <Link to={`/${page}/${handle}`}>Read More</Link>}
      </BlogArticle>
    </FlexCenter>
  );
};

export default Blog;
