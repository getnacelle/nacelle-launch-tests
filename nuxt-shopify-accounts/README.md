# Accounts
###### Utilizing Shopify Storefront API and Multipass
---

### Summary
We want a simple solution to handling customer accounts that doesn't involve maintaining code in Shopify's Theme. This example should give us all of the basic account functionality that we need.

##### Account Page Actions:

**example structure:**
```tree
├── Page
│   └── resource
│       └── ACTION
```
```tree
├── Account Page
│   ├── customer                        # requires customerAccessToken
│   │   ├── READ 
│   │   └── UPDATE
│   ├── orders                          # requires customerAccessToken
│   │   └── READ
│   └── addresses                       # requires customerAccessToken
│       ├── READ
│       ├── UPDATE
│       ├── CREATE
│       └── DELETE
├── Login Page
│   └── customerAccessToken
│       └── CREATE                      # create customerAccessToken w/ email and password
├── Register Page
│   └── customer
│       └── CREATE                      # create customer account w/ email and password 
├── Recover Password Page
│   └── resetToken
│       └── CREATE                      # sends password recovery email to customer
└── Reset Password Page
    └── customer
        └── UPDATE                      # updates customer password with resetToken from recovery email
```

### Prerequisites
* Must be on the [Shopify Plus](https://www.shopify.com/plus/enterprise-ecommerce) plan and have [Multipass](https://help.shopify.com/en/api/reference/plus/multipass) enabled.

### Setup
1. add a few items to our `.env` file:
```sh
SHOPIFY_MULTIPASS_SECRET="15b40af008bfad7b5dfbf36c389abf70"
MYSHOPIFY_DOMAIN="nacelle-accounts.myshopify.com"
SHOPIFY_GRAPHQL_TOKEN="789bfb8d1376a93439b27953b60ac357"
SHOPIFY_CUSTOM_DOMAIN="nacelle.commercejam.com"
```
2. We'll need to expose these to various parts of our application through our `nuxt.config.js`:
```js
{
   env: {
   ...,
    shopifyMultipassSecret: process.env.SHOPIFY_MULTIPASS_SECRET,
    myshopifyDomain: process.env.MYSHOPIFY_DOMAIN,
    shopifyToken: process.env.SHOPIFY_GRAPHQL_TOKEN,
  },
  nacelle: {
    ...,
    customEndpoint: process.env.NACELLE_CUSTOM_ENDPOINT,
    myshopifyDomain: process.env.MYSHOPIFY_DOMAIN,
    shopifyCustomDomain: process.env.SHOPIFY_CUSTOM_DOMAIN,
    shopifyToken: process.env.SHOPIFY_GRAPHQL_TOKEN,
  }
}
```
3. Only two dependencies need to be installed:
* `npm install cookie-universal-nuxt multipassify`
> [cookie-universal-nuxt](https://github.com/microcipcip/cookie-universal/tree/master/packages/cookie-universal-nuxt)
> [multipassify](https://github.com/beaucoo/multipassify)

### Code Additions
| Dir                           | Description                                            |
| ----------------------------- | ------------------------------------------------------ |
| [gql/*][DirGQL]               | exports GraphQl queries and related utility functions. |
| [middleware/*][DirMID]        | SPA style route guards. Included on certain pages      |
| [pages/account/*][DirPG]      | Account Page Templates                                 |
| [store/account.js][DirST]     | Account related Actions and Mutations                  | [static/account-head.js][DirAH] | On page load guard clause for better UX |
| [static/reset-head.js][DirRH] | On page load guard clause for better UX                |

### File Modifications
| File                                            | Description                                          |
| ----------------------------------------------- | ---------------------------------------------------- |
| [layouts/default.vue][FiLD]                     | add read token action to created hook                |
| [components/CartFlyoutCheckoutButton.vue][FiCC] | intercept checkout url and modify with custom domain |
| [store/index.js][FiSI]                          | retrieve customer access token if present in cookie  |



   [DirGQL]: <https://github.com/getnacelle/nacelle-launch-tests/tree/master/nuxt-shopify-accounts/gql>
   [DirMID]: <https://github.com/getnacelle/nacelle-launch-tests/tree/master/nuxt-shopify-accounts/middleware>
   [DirPG]: <https://github.com/getnacelle/nacelle-launch-tests/tree/master/nuxt-shopify-accounts/pages/account>
   [DirST]: <https://github.com/getnacelle/nacelle-launch-tests/tree/master/nuxt-shopify-accounts/store/account.js>
   [DirAH]: <https://github.com/getnacelle/nacelle-launch-tests/tree/master/nuxt-shopify-accounts/static/account-head.js>
   [DirRH]: <https://github.com/getnacelle/nacelle-launch-tests/tree/master/nuxt-shopify-accounts/static/reset-head.js>
   [FiLD]: <https://github.com/getnacelle/nacelle-launch-tests/tree/master/nuxt-shopify-accounts/layouts/default.vue>
   [FiCC]: <https://github.com/getnacelle/nacelle-launch-tests/tree/master/nuxt-shopify-accounts/components/CartFlyoutCheckoutButton.vue>
   [FiSI]: <https://github.com/getnacelle/nacelle-launch-tests/blob/master/nuxt-shopify-accounts/store/index.js>
   