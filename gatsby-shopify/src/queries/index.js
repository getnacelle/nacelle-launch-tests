// Fetch data from Nacelle's Hail Frequency API

const COLLECTIONS_QUERY = `
  query($first: Int, $after: String) {
    nacelle {
      getCollections(first: $first, after: $after) {
        nextToken
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
  query($first: Int, $after: String) {
    nacelle {
      getContent(first: $first, after: $after) {
        nextToken
        items {
          type
          handle
          title
          content
          excerpt
          createdAt
          tags
          publishDate
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
  query($first: Int, $after: String) {
    nacelle {
      getProducts(first: $first, after: $after) {
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

const LINK_LISTS_QUERY = `
  {
    nacelle {
      getSpace {
        linklists {
          handle
          links {
            title
            to
            type
          }
        }
      }
    }
  }
`;

module.exports = {
  PRODUCT_QUERY,
  COLLECTIONS_QUERY,
  CONTENT_QUERY,
  LINK_LISTS_QUERY
};
