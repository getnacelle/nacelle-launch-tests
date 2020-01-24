const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  siteMetadata: {
    title: `Nacelle Launch Test: Gatsby Shopify`,
    description: `This project is powered by Nacelle, with
    Shopify for a PIM & CMS, with a Gatsby frontend.`,
    author: `Nacelle Inc. (getnacelle.com)`
  },
  plugins: [
    {
      resolve: `@nacelle/gatsby-theme-nacelle`,
      options: {
        nacelle_space_id: process.env.NACELLE_SPACE_ID,
        nacelle_graphql_token: process.env.NACELLE_GRAPHQL_TOKEN
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-nacelle-launch-test`,
        short_name: `nacelle-gatsby-shopify`,
        start_url: `/`,
        background_color: `#2846dc`,
        theme_color: `#2846dc`,
        display: `minimal-ui`,
        icon: `src/images/favicon/favicon-32x32.png`
      }
    },
    {
      resolve: `gatsby-alias-imports`,
      options: {
        aliases: {
          src: `src/`
        }
      }
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`
  ]
};
