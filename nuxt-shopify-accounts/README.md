# Accounts

###### Utilizing Shopify Storefront API and Multipass

---

### Summary

We want a simple solution to handling customer accounts that doesn't involve maintaining code in Shopify's Theme. This example should give us all of the basic account functionality that we need.

##### Account Page Actions:

**example structure:**

```tree
├── Page
│   └── resource
│       └── ACTION
```

```tree
├── Account Page
│   ├── customer                        # requires customerAccessToken
│   │   ├── READ
│   │   └── UPDATE
│   ├── orders                          # requires customerAccessToken
│   │   └── READ
│   └── addresses                       # requires customerAccessToken
│       ├── READ
│       ├── UPDATE
│       ├── CREATE
│       └── DELETE
├── Login Page
│   └── customerAccessToken
│       └── CREATE                      # create customerAccessToken w/ email and password
├── Register Page
│   └── customer
│       └── CREATE                      # create customer account w/ email and password
├── Recover Password Page
│   └── resetToken
│       └── CREATE                      # sends password recovery email to customer
└── Reset Password Page
    └── customer
        └── UPDATE                      # updates customer password with resetToken from recovery email
```

### Prerequisites

- Must be on the [Shopify Plus](https://www.shopify.com/plus/enterprise-ecommerce) plan and have [Multipass](https://help.shopify.com/en/api/reference/plus/multipass) enabled.
- You'll need your store's:
  - Storefront API token
  - Multipass secret

### Setup

1. add a few items to our `.env` file:

```sh
SHOPIFY_MULTIPASS_SECRET="15b40af008bfad7b5dfbf36c389abf70"
MYSHOPIFY_DOMAIN="nacelle-accounts.myshopify.com"
SHOPIFY_GRAPHQL_TOKEN="789bfb8d1376a93439b27953b60ac357"
SHOPIFY_CUSTOM_DOMAIN="nacelle.commercejam.com"
```

2. We'll need to expose these to various parts of our application through our `nuxt.config.js`:

Note that `SHOPIFY_GRAPHQL_TOKEN` if your store's Storefront API Token.

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

3. The following three dependencies need to be installed:

- `npm install cookie-universal-nuxt multipassify countrycitystatejson`

> [cookie-universal-nuxt](https://github.com/microcipcip/cookie-universal/tree/master/packages/cookie-universal-nuxt)

> [multipassify](https://github.com/beaucoo/multipassify)

> [countrycitystatejson](https://github.com/khkwan0/countryCityStateJson)

4. Cookie Universal Nuxt requires an update to `nuxt.config.json`. Add to modules array.

```js
{
  modules: [
    ...,
    'cookie-universal-nuxt',
  ]
}
```

### Code Additions

| Dir                                 | Description                                                       |
| ----------------------------------- | ----------------------------------------------------------------- |
| [gql/\*][dirgql]                    | exports GraphQl queries and related utility functions.            |
| [middleware/\*][dirmid]             | SPA style route guards. Included on certain pages                 |
| [pages/account/\*][dirpg]           | Account Page Templates                                            |
| [store/account.js][dirst]           | Account related Actions and Mutations                             |
| [static/account-head.js][dirah]     | On page load guard clause for better UX                           |
| [static/reset-head.js][dirrh]       | On page load guard clause for better UX                           |
| [components/AddressItem.vue][dirai] | Component for AddressItem                                         |
| [components/AddressForm.vue][diraf] | Component for AddressForm reusable with update and create actions |

### File Modifications

| File                                            | Description                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| [layouts/default.vue][fild]                     | add read token action to mounted hook                               |
| [components/CartFlyoutCheckoutButton.vue][ficc] | intercept checkout url and modify with custom domain                |
| [nuxt.config.js][finc]                          | add nuxt-universal-cookie module and environment variable additions |
| [store/index.js][fisi]                          | retrieve customer access token if present in cookie                 |

### Shopify Email Notifications

1. Password Recover and Reset

   - During the password recovery flow, an email is sent to the customer with a link to the reset their password. We'll want to make sure to edit this link to point towards our app instead of the Shopify hosted domain.
   - We are using using query parameters vs url parameters since we are using static site generation and can't handle dynamic routes.
   - The url path will appear like:

     - `/account/reset?id=2864558604347&token=a000add20a69bb53954976edd74870a4-1581119357`

     versus:

     - `/account/reset/2864558604347/a000add20a69bb53954976edd74870a4-1581119357`

```liquid
{% comment %}
  Edit Customer Account Reset (/admin/email_templates/customer_account_reset/edit)
  ----
  Old tag:
  <a href="{{ customer.reset_password_url }}" class="button__text">Reset your password</a>
{% endcomment %}
{% assign url_parts = customer.reset_password_url  | split: '/' %}
<a href="http://domain.com/account/reset?id={{url_parts[5]}}&token={{url_parts[6]}}">Reset your password</a>
```

[dirgql]: https://github.com/getnacelle/nacelle-launch-tests/tree/master/nuxt-shopify-accounts/gql
[dirmid]: https://github.com/getnacelle/nacelle-launch-tests/tree/master/nuxt-shopify-accounts/middleware
[dirpg]: https://github.com/getnacelle/nacelle-launch-tests/tree/master/nuxt-shopify-accounts/pages/account
[dirst]: https://github.com/getnacelle/nacelle-launch-tests/tree/master/nuxt-shopify-accounts/store/account.js
[dirah]: https://github.com/getnacelle/nacelle-launch-tests/tree/master/nuxt-shopify-accounts/static/account-head.js
[dirrh]: https://github.com/getnacelle/nacelle-launch-tests/tree/master/nuxt-shopify-accounts/static/reset-head.js
[fild]: https://github.com/getnacelle/nacelle-launch-tests/tree/master/nuxt-shopify-accounts/layouts/default.vue
[ficc]: https://github.com/getnacelle/nacelle-launch-tests/tree/master/nuxt-shopify-accounts/components/CartFlyoutCheckoutButton.vue
[finc]: https://github.com/getnacelle/nacelle-launch-tests/tree/master/nuxt-shopify-accounts/nuxt.config.js
[fisi]: https://github.com/getnacelle/nacelle-launch-tests/blob/master/nuxt-shopify-accounts/store/index.js
