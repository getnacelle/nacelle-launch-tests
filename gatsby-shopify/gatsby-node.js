const path = require('path');
const {
  PRODUCT_QUERY,
  COLLECTIONS_QUERY,
  CONTENT_QUERY
} = require('./src/queries');

async function paginatedArray({ query, queryName, graphql }) {
  try {
    let results = await graphql(query);
    const arr = results.data.nacelle[queryName].items;
    while (results.data.nacelle[queryName].nextToken) {
      try {
        results = await graphql(query, {
          after: results.data.nacelle[queryName].nextToken
        });
        arr.push(...results.data.nacelle[queryName].items);
      } catch (err) {
        throw new Error(err);
      }
    }
    return arr;
  } catch (err) {
    throw new Error(err);
  }
}

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  // Build pages for products
  const products = await paginatedArray({
    query: PRODUCT_QUERY,
    queryName: 'getProducts',
    graphql
  });
  products.forEach(item => {
    const { title, handle, description, variants } = item;
    let src;
    if (item.featuredMedia) {
      src = item.featuredMedia.src;
    }
    createPage({
      // Build a page for each product
      path: `/products/${handle}`,
      component: path.resolve('./src/components/templates/ProductDetail.js'),
      context: {
        title,
        handle,
        description,
        imageSrc: src,
        variants
      }
    });
  });

  // Build pages for collections
  const collections = await paginatedArray({
    query: COLLECTIONS_QUERY,
    queryName: 'getCollections',
    graphql
  });
  collections.forEach(item => {
    const { title, handle } = item;
    let src;
    let handles;
    let allProducts;
    let productsInCollection;
    if (item.featuredMedia) {
      src = item.featuredMedia.src;
    }
    if (item.productLists) {
      const [handlesArray] = item.productLists;
      handles = handlesArray ? handlesArray.handles : [];
      allProducts = products;
      productsInCollection = allProducts.filter(product =>
        handles.includes(product.handle)
      );
    }
    createPage({
      // Build a page for each collection
      path: `/collections/${handle}`,
      component: path.resolve('./src/components/templates/Collection.js'),
      context: {
        title,
        imageSrc: src,
        handles,
        products: productsInCollection
      }
    });
  });

  // Build pages for all content (blogs, articles)
  const content = await paginatedArray({
    query: CONTENT_QUERY,
    queryName: 'getContent',
    graphql
  });
  const contentCollections = content.filter(
    // Only return content that has a non-null articleList array
    el => el.articleLists
  );
  contentCollections.forEach(contentCollection => {
    const { type, handle, title, featuredMedia } = contentCollection;
    const [articleList] = contentCollection.articleLists;
    const contentInCollection = content.filter(el =>
      articleList.handles.includes(el.handle)
    );
    createPage({
      // Build a page for each content collection
      path: `/${handle.toLowerCase() === 'homepage' ? '' : handle}`,
      component: path.resolve(
        './src/components/templates/ContentCollection.js'
      ),
      context: {
        title,
        handle,
        type,
        content: contentCollection.content,
        imageSrc: featuredMedia ? featuredMedia.src : null,
        collection: contentInCollection,
        products: ['shop', 'homepage'].includes(handle) ? products : null
      }
    });
    contentInCollection.forEach(el =>
      createPage({
        // Build a page for each piece of content in a content collection
        path: `/${handle}/${el.handle}`,
        component: path.resolve('./src/components/templates/Content.js'),
        context: {
          title: el.title,
          handle: el.handle,
          type: el.type,
          content: el.content,
          excerpt: el.excerpt,
          imageSrc: el.featuredMedia ? el.featuredMedia.src : null
        }
      })
    );
  });
};
