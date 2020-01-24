import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { HeroImage, Products } from 'src/components';
import Layout from './Layout';

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
`;

const BlogArticle = styled.article`
  width: 70%;
  max-width: 800px;
  margin: 1em;
  padding: 1em;
  border: 1px solid rgba(0, 0, 0, 20%);
  border-radius: 3px;
  a {
    text-decoration: none;
  }
`;

const CollectionItem = ({ item, page }) => {
  const { title, handle } = item;
  const src = item.featuredMedia ? item.featuredMedia.src : null;
  if (page === 'shop') {
    return (
      <article>
        {src && <HeroImage src={src} alt={title} title={title} />}
      </article>
    );
  }
  if (page === 'blog') {
    return (
      <FlexCenter>
        <BlogArticle>
          <h2>{handle && <Link to={`/${page}/${handle}`}>{title}</Link>}</h2>
          {src && <HeroImage src={src} alt={title} />}
        </BlogArticle>
      </FlexCenter>
    );
  }
  if (page === 'homepage') {
    return (
      <article>
        {src && <HeroImage src={src} alt={title} title={title} />}
      </article>
    );
  }
  return (
    <BlogArticle>
      <h2>{handle && <Link to={`/${page}/${handle}`}>{title}</Link>}</h2>
      {src && <HeroImage src={src} alt={title} />}
    </BlogArticle>
  );
};

const ContentPage = ({ pageContext }) => {
  const { handle, content, collection, products } = pageContext;
  return (
    <Layout>
      {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
      {collection.map(
        (el, idx) =>
          el.type.toLowerCase() === 'article' && (
            <CollectionItem
              item={el}
              page={handle}
              key={`${el.title}-${idx}`}
            />
          )
      )}
      {products && <Products products={products} />}
    </Layout>
  );
};

export default ContentPage;
