module.exports = {
  env: {
    NACELLE_SPACE_ID: process.env.NACELLE_SPACE_ID,
    NACELLE_GRAPHQL_TOKEN: process.env.NACELLE_GRAPHQL_TOKEN
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: JSON.parse(process.env.LOCALES), // ['en-US', 'es-US']

    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: process.env.DEFAULT_LOCALE, // 'en-US'

    domains: [
      {
        domain: process.env.VERCEL_DOMAIN, // 'thinx.com'
        defaultLocale: process.env.DEFAULT_LOCALE // 'en-US'
      }
    ]
  }
};
