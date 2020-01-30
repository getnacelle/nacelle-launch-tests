import React from 'react';
import { BannerImage, Products, Landing, Blog, SEO } from 'src/components';
import Layout from 'src/components/Layout';

const CollectionItem = ({ item, page, recentArrivals }) => {
  const { title } = item;
  const src = item.featuredMedia ? item.featuredMedia.src : null;
  if (page === 'shop') {
    return (
      <article>
        {src && <BannerImage src={src} alt={title} title={title} />}
      </article>
    );
  }
  if (page === 'blog') {
    return <Blog item={item} page={page} />;
  }
  if (page === 'homepage') {
    return <Landing item={item} recentArrivals={recentArrivals} />;
  }
  return null;
};

const ContentPage = ({ pageContext }) => {
  const { title, handle, content, collection, products } = pageContext;
  let recentArrivals;
  if (handle === 'homepage' && products !== null) {
    const getLatestArrivalTimes = limit =>
      products
        .map(el => el.createdAt)
        .sort()
        .slice(0, limit);
    const fourMostRecentTimes = getLatestArrivalTimes(4);
    recentArrivals = products.filter(el =>
      fourMostRecentTimes.includes(el.createdAt)
    );
  }
  return (
    <Layout>
      <SEO title={title} />
      {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
      {collection.map(
        (el, idx) =>
          el.type.toLowerCase() === 'article' && (
            <CollectionItem
              item={el}
              page={handle}
              key={`${el.title}-${idx}`}
              recentArrivals={recentArrivals}
            />
          )
      )}
      {products && handle !== 'homepage' && <Products products={products} />}
    </Layout>
  );
};

export default ContentPage;
