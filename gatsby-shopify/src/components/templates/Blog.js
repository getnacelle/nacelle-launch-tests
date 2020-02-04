import React from 'react';
import styled from 'styled-components';
import { BlogArticle, SEO } from 'src/components';
import Layout from 'src/components/Layout';

const InnerHtmlBlock = styled.div`
  margin: 1em 4em;
`;

const Blog = ({ pageContext }) => {
  const { title, handle, content, articles } = pageContext;
  return (
    <Layout>
      <SEO title={title} />
      {content && (
        <InnerHtmlBlock>
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </InnerHtmlBlock>
      )}
      {articles &&
        articles.map(
          el =>
            el.type.toLowerCase() === 'article' && (
              <BlogArticle item={el} page={handle} />
            )
        )}
    </Layout>
  );
};

export default Blog;
