const path = require('path');
const {
  PRODUCT_QUERY,
  COLLECTIONS_QUERY,
  CONTENT_QUERY,
  LINK_LISTS_QUERY
} = require('./src/queries');

async function paginatedArray({ query, queryName, graphql }) {
  try {
    const supportedQueries = ['getProducts', 'getCollections', 'getContent'];
    if (supportedQueries.includes(queryName) === false) {
      throw new Error(`The paginatedArray only works for 
      'getProducts', 'getCollections', and 'getContent' queries.`);
    } else {
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
    }
  } catch (err) {
    throw new Error(err);
  }
}

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const linkListsQuery = await graphql(LINK_LISTS_QUERY);

  const uniqueLinks = new Set('/');
  linkListsQuery.data.nacelle.getSpace.linklists.forEach(linkList =>
    linkList.links.forEach(
      link => link.type !== 'External' && uniqueLinks.add(link.to)
    )
  );
  const links = [...uniqueLinks];
  console.log('\nNacelle Link List:');
  links.forEach(el => console.log(`- ${el}`));

  // Build pages for products
  console.log('\n\nBuilding products...\n');
  const products = await paginatedArray({
    query: PRODUCT_QUERY,
    queryName: 'getProducts',
    graphql
  });
  products.forEach(product => {
    const { title, handle, description, variants } = product;
    let src;
    if (product.featuredMedia) {
      src = product.featuredMedia.src;
    }
    createPage({
      // Build a page for each product
      path: `/products/${handle}`,
      component: path.resolve('./src/components/templates/ProductDetail.js'),
      context: {
        title,
        handle,
        variants,
        description,
        imageSrc: src
      }
    });
  });

  // Build pages for collections
  console.log('\nBuilding collections...\n');
  const collections = await paginatedArray({
    query: COLLECTIONS_QUERY,
    queryName: 'getCollections',
    graphql
  });
  collections.forEach(collection => {
    const { title, handle } = collection;
    let src;
    let handles;
    let allProducts;
    let productsInCollection;
    if (collection.featuredMedia) {
      src = collection.featuredMedia.src;
    }
    if (collection.productLists) {
      const [handlesArray] = collection.productLists;
      handles = handlesArray ? handlesArray.handles : [];
      allProducts = products;
      productsInCollection = allProducts.filter(product =>
        handles.includes(product.handle)
      );
    }
    const collectionPath = `/collections/${handle}`;
    if (links.includes(collectionPath)) {
      console.log(
        `\nCreating 'Collections' page: /collections/${handle} \nfor: ${handle}`
      );
      createPage({
        // Build a page for each collection
        path: collectionPath,
        component: path.resolve('./src/components/templates/Collection.js'),
        context: {
          title,
          handles,
          imageSrc: src,
          products: productsInCollection
        }
      });
    }
  });

  // Build pages for all content (pages, blogs, articles)
  console.log('\nBuilding content...\n');
  const content = await paginatedArray({
    query: CONTENT_QUERY,
    queryName: 'getContent',
    graphql
  });
  const pages = content.filter(el => el.type === 'page');
  const blogs = content.filter(el => el.type === 'blog');
  const articles = content.filter(el => el.type === 'article');
  pages.forEach(page => {
    const [pageBlog] = blogs.filter(blog => blog.handle === page.handle);
    if (pageBlog) {
      const { handle, title, featuredMedia, tags, publishDate } = pageBlog;
      const [articleList] = pageBlog.articleLists || [{ handles: [] }];
      const articlesInBlog = articles
        .filter(article => articleList.handles.includes(article.handle))
        .sort((a, b) => (b.publishDate > a.publishDate ? -1 : 1));
      const pageBlogPath = `/${
        handle.toLowerCase() === 'homepage' ? '' : handle
      }`;
      if (links.includes(pageBlogPath)) {
        console.log(
          `\nCreating 'Page' page: /${
            handle.toLowerCase() === 'homepage' ? '' : handle
          } \nfor: ${handle}`
        );
        createPage({
          path: pageBlogPath,
          component: path.resolve('./src/components/templates/Content.js'),
          context: {
            title,
            handle,
            tags,
            publishDate,
            content: pageBlog.content,
            imageSrc: featuredMedia ? featuredMedia.src : null,
            collection: articlesInBlog,
            products: ['shop', 'homepage'].includes(handle) ? products : null
          }
        });
        articlesInBlog.forEach(article => {
          console.log(
            `\nCreating 'Article' page: /${handle}/${article.handle} \nfor: ${handle}`
          );
          createPage({
            path: `/${handle}/${article.handle}`,
            component: path.resolve('./src/components/templates/Content.js'),
            context: {
              title: article.title,
              handle: article.handle,
              type: article.type,
              content: article.content,
              excerpt: article.excerpt,
              publishDate: article.publishDate,
              imageSrc: article.featuredMedia ? article.featuredMedia.src : null
            }
          });
        });
      }
    }
  });

  blogs.forEach(blog => {
    if (blog.articleLists) {
      const { handle, title, featuredMedia } = blog;
      const [articleList] = blog.articleLists;
      const articlesInBlog = articles.filter(article =>
        articleList.handles.includes(article.handle)
      );
      const blogPath = `/blog${
        handle.toLowerCase() === 'blog' ? '' : `/${handle}`
      }`;
      if (links.includes(blogPath)) {
        console.log(
          `\nCreating 'Blog' page: /blog${
            handle.toLowerCase() === 'blog' ? '' : `/${handle}`
          } \nfor: ${handle}`
        );
        createPage({
          path: blogPath,
          component: path.resolve('./src/components/templates/Content.js'),
          context: {
            title,
            handle,
            content: blog.content,
            imageSrc: featuredMedia ? featuredMedia.src : null,
            collection: articlesInBlog,
            products: ['shop', 'homepage'].includes(handle) ? products : null
          }
        });
        articlesInBlog.forEach(article => {
          console.log(
            `\nCreating 'Article' page: /${handle}/${article.handle} \nfor: ${handle}`
          );
          createPage({
            path: `/${handle}/${article.handle}`,
            component: path.resolve('./src/components/templates/Content.js'),
            context: {
              title: article.title,
              handle: article.handle,
              type: article.type,
              content: article.content,
              excerpt: article.excerpt,
              imageSrc: article.featuredMedia ? article.featuredMedia.src : null
            }
          });
        });
      }
    }
  });
};
