const path = require('path');

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  // Fetch all products
  const products = await graphql(`
    {
      nacelle {
        getProducts {
          items {
            title
            handle
            description
            createdAt
            featuredMedia {
              src
            }
            variants {
              id
              title
              price
              selectedOptions {
                name
                value
              }
              featuredMedia {
                src
              }
            }
          }
        }
      }
    }
  `);
  products.data.nacelle.getProducts.items.forEach(item => {
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

  // Fetch all collections
  const collections = await graphql(`
    {
      nacelle {
        getCollections {
          items {
            title
            handle
            featuredMedia {
              src
            }
            productLists {
              handles
            }
          }
        }
      }
    }
  `);
  collections.data.nacelle.getCollections.items.forEach(item => {
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
      allProducts = products.data.nacelle.getProducts.items;
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

  // Fetch all content (blogs, articles)
  const content = await graphql(`
    {
      nacelle {
        getContent {
          items {
            type
            handle
            title
            content
            createdAt
            featuredMedia {
              src
            }
            articleLists {
              handles
            }
          }
        }
      }
    }
  `);
  const allContent = content.data.nacelle.getContent.items;
  const contentCollections = content.data.nacelle.getContent.items.filter(
    // Only return content that has a non-null articleList array
    el => el.articleLists
  );
  contentCollections.forEach(contentCollection => {
    const { type, handle, title, featuredMedia } = contentCollection;
    const [articleList] = contentCollection.articleLists;
    const contentInCollection = allContent.filter(el =>
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
        products: ['shop', 'homepage'].includes(handle)
          ? products.data.nacelle.getProducts.items
          : null
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
          imageSrc: el.featuredMedia ? el.featuredMedia.src : null
        }
      })
    );
  });
};
