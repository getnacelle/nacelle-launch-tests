module.exports = {
  env: {
    NACELLE_SPACE_ID: process.env.NACELLE_SPACE_ID,
    NACELLE_GRAPHQL_TOKEN: process.env.NACELLE_GRAPHQL_TOKEN
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en-US', 'es-AR'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'en-US',
    domains: [
      {
        domain: 'example.com',
        defaultLocale: 'en-US'
      },
      {
        domain: 'example.es',
        defaultLocale: 'es-AR'
      }
    ]
  }
};
