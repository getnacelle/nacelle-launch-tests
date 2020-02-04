import React from 'react';
import styled from 'styled-components';
import {
  Layout,
  BannerImage,
  Products,
  PageNavButtons,
  Landing,
  SEO
} from 'src/components';

const InnerHtmlBlock = styled.div`
  margin: 1em 4em;
`;

const Article = ({ item, page, recentArrivals }) => {
  const { title } = item;
  const src = item.featuredMedia ? item.featuredMedia.src : null;
  if (page === 'shop') {
    return (
      <article>
        {src && <BannerImage src={src} alt={title} title={title} />}
      </article>
    );
  }
  if (page === 'homepage') {
    return <Landing item={item} recentArrivals={recentArrivals} />;
  }
  return null;
};

const ContentPage = ({ pageContext, path }) => {
  const {
    title,
    handle,
    content,
    articles,
    products,
    recentArrivals,
    currentPage,
    numPages
  } = pageContext;
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
          (el, idx) =>
            el.type.toLowerCase() === 'article' && (
              <Article
                item={el}
                page={handle}
                key={`${el.title}-${idx}`}
                recentArrivals={recentArrivals}
              />
            )
        )}
      {products && handle === 'shop' && <Products products={products} />}
      <PageNavButtons
        path={path}
        handle={handle}
        currentPage={currentPage}
        numPages={numPages}
      />
    </Layout>
  );
};

export default ContentPage;
