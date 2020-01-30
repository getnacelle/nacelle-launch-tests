// Fetch data from Nacelle's Hail Frequency API

const COLLECTIONS_QUERY = `
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
`;

const CONTENT_QUERY = `
    {
    nacelle {
      getContent {
        items {
          type
          handle
          title
          content
          excerpt
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
`;

const PRODUCT_QUERY = `
  query($after: String) {
    nacelle {
      getProducts(first: 500, after: $after) {
        nextToken
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
`;

module.exports = {
  PRODUCT_QUERY,
  COLLECTIONS_QUERY,
  CONTENT_QUERY
};
