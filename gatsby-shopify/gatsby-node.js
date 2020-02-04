const path = require('path');
const {
  PRODUCT_QUERY,
  COLLECTIONS_QUERY,
  CONTENT_QUERY,
  LINK_LISTS_QUERY
} = require('./src/queries');

async function paginatedArray({ query, queryName, graphql, first = 500 } = {}) {
  try {
    const supportedQueries = ['getProducts', 'getCollections', 'getContent'];

    if (supportedQueries.includes(queryName) === false) {
      throw new Error(`The paginatedArray only works for 
      'getProducts', 'getCollections', and 'getContent' queries.`);
    } else {
      let results = await graphql(query, { first });
      const { items, nextToken } = results.data.nacelle[queryName];
      const nextTokenArr = [nextToken];

      while (results.data.nacelle[queryName].nextToken) {
        try {
          results = await graphql(query, {
            first,
            after: results.data.nacelle[queryName].nextToken
          });
          items.push(...results.data.nacelle[queryName].items);
          nextTokenArr.push(results.data.nacelle[queryName].nextToken);
        } catch (err) {
          throw new Error(err);
        }
      }

      return [items, nextTokenArr];
    }
  } catch (err) {
    throw new Error(err);
  }
}

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  // Fetch and log the main-menu Link List
  const linkListsQuery = await graphql(LINK_LISTS_QUERY);

  const linkList = linkListsQuery.data.nacelle.getSpace.linklists
    .find(el => el.handle === 'main-menu')
    .links.filter(el => el.type.toLowerCase() !== 'external');

  linkList.splice(0, 0, { title: 'Homepage', to: '/', type: 'Page' });
  console.log('\nNacelle Link List:');
  linkList.forEach(el => console.log(`- ${JSON.stringify(el)}`));

  // Build pages for products
  console.log('\n\nBuilding products...');
  const [products, productsNextTokenArr] = await paginatedArray({
    query: PRODUCT_QUERY,
    queryName: 'getProducts',
    graphql
  });

  products.sort((a, b) => (b.createdAt > a.createdAt ? -1 : 1));

  const productsPerPage = 24;
  let productsCount = 0;

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
    productsCount += 1;
  });

  if (productsCount) {
    console.log(`\nCreated ${productsCount} product pages ✔️ \n`);
  }

  // Build pages for collections
  console.log('\n\nBuilding collections...');
  const [collections] = await paginatedArray({
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
    if (
      linkList
        .filter(el => el.type.toLowerCase() === 'collection')
        .map(el => el.to)
        .includes(collectionPath)
    ) {
      console.log(
        `\nCreating 'Collections' page: /collections/${handle} \nfor: ${handle}`
      );
      if (productsInCollection.length > productsPerPage) {
        // Paginate collections page if needed
        const numPages = Math.ceil(
          productsInCollection.length / productsPerPage
        );
        Array.from({ length: numPages }).forEach((_, idx) => {
          createPage({
            path: idx === 0 ? collectionPath : `${collectionPath}/${idx + 1}`,
            component: path.resolve('./src/components/templates/Collection.js'),
            context: {
              title,
              handle,
              handles,
              imageSrc: src,
              products: productsInCollection.slice(
                idx * productsPerPage,
                idx * productsPerPage + productsPerPage
              ),
              numPages,
              currentPage: idx + 1
            }
          });
        });
      } else {
        createPage({
          // Build a page for each collection
          path: collectionPath,
          component: path.resolve('./src/components/templates/Collection.js'),
          context: {
            title,
            handle,
            handles,
            imageSrc: src,
            products: productsInCollection
          }
        });
      }
    }
  });

  // Build pages for all content (pages, blogs, articles)
  console.log('\n\nBuilding content...');
  const [content] = await paginatedArray({
    query: CONTENT_QUERY,
    queryName: 'getContent',
    graphql
  });

  const pages = content.filter(el => el.type.toLowerCase() === 'page');
  const blogs = content.filter(el => el.type.toLowerCase() === 'blog');
  const articles = content.filter(el => el.type.toLowerCase() === 'article');

  if (pages.find(el => el.handle.toLowerCase() === 'homepage') === undefined) {
    // Add an entry for the Homepage page if it's not in the index
    pages.splice(0, 0, { handle: 'homepage', type: 'page', title: 'Homepage' });
  }

  pages.forEach(page => {
    const [pageBlog] = blogs.filter(blog => blog.handle === page.handle);
    if (pageBlog) {
      const { handle, title, featuredMedia, tags, publishDate } = pageBlog;
      const [articleList] = pageBlog.articleLists || [{ handles: [] }];
      const articlesInBlog = articles
        .filter(article => articleList.handles.includes(article.handle))
        .sort((a, b) => (b.publishDate > a.publishDate ? -1 : 1));
      const pagePath = `/${handle.toLowerCase() === 'homepage' ? '' : handle}`;

      if (
        linkList
          .filter(el => el.type.toLowerCase() === 'page')
          .map(el => el.to)
          .includes(pagePath)
      ) {
        console.log(
          `\nCreating 'Page' page: /${
            handle.toLowerCase() === 'homepage' ? '' : handle
          } \nfor: ${handle}`
        );
        if (handle === 'shop') {
          // Paginate shop page
          const numPages = Math.ceil(products.length / productsPerPage);
          Array.from({ length: numPages }).forEach((_, idx) => {
            createPage({
              path: idx === 0 ? pagePath : `${pagePath}/${idx + 1}`,
              component: path.resolve('./src/components/templates/Content.js'),
              context: {
                title,
                handle,
                tags,
                publishDate,
                content: pageBlog.content,
                imageSrc: featuredMedia ? featuredMedia.src : null,
                articles: articlesInBlog,
                products: products.slice(
                  idx * productsPerPage,
                  idx * productsPerPage + productsPerPage
                ),
                numPages,
                currentPage: idx + 1,
                first: productsPerPage,
                after: productsNextTokenArr[idx]
              }
            });
          });
        } else {
          createPage({
            path: pagePath,
            component: path.resolve('./src/components/templates/Content.js'),
            context: {
              title,
              handle,
              tags,
              publishDate,
              content: pageBlog.content,
              imageSrc: featuredMedia ? featuredMedia.src : null,
              articles: articlesInBlog,
              recentArrivals: products.slice(0, 4)
            }
          });
        }
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

      if (
        linkList
          .filter(el => el.type.toLowerCase() === 'blog')
          .map(el => el.to)
          .includes(blogPath)
      ) {
        console.log(
          `\nCreating 'Blog' page: /blog${
            handle.toLowerCase() === 'blog' ? '' : `/${handle}`
          } \nfor: ${handle}`
        );
        createPage({
          path: blogPath,
          component: path.resolve('./src/components/templates/Blog.js'),
          context: {
            title,
            handle,
            content: blog.content,
            articles: articlesInBlog,
            imageSrc: featuredMedia ? featuredMedia.src : null
          }
        });

        articlesInBlog.forEach(article => {
          console.log(
            `\nCreating 'Article' page: /${handle}/${article.handle} \nfor: ${handle}`
          );
          createPage({
            path: `/${handle}/${article.handle}`,
            component: path.resolve('./src/components/templates/Blog.js'),
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
  console.log(`\nFinished building pages from Nacelle data 🚀\n`);
};
