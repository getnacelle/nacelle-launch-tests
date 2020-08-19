# Nacelle Nuxt Starter Project

## Getting Started

Read the [Nacelle docs](https://docs.getnacelle.com) to get an overview on the platform as a whole. Once you have a grasp of the necessary workflows, make a new repo using this as a template.

### What?
Demo of bypassing Hail Frequency's `processCheckout` by utilizing [Permalinks](https://community.shopify.com/c/Shopify-Design/Cart-Use-permalinks-to-pre-load-the-cart/td-p/613702)


### Method
We can utilize the method below to create a checkout url. This effectively replaces `this.$nacelle.checkout.process({ cartItems, checkoutId })`. It is important to note that we can pass all sorts of query parameters onto this checkout url including:

- Checkout Parameters ([docs](https://community.shopify.com/c/Shopify-Design/Cart-Use-permalinks-to-pre-load-the-cart/td-p/613702#toc-hId--1797899715)):
    - `/cart/{variant_id}:{quantity}?checkout[email]=somebody@store.com&checkout[shipping_address][city]=thisismyhometown`
- Discounts ([docs](https://community.shopify.com/c/Shopify-Design/Cart-Use-permalinks-to-pre-load-the-cart/td-p/613702#toc-hId--55089380)):
    - `/cart/{variant_id}:{quantity}?discount=test`
- Order Notes, Attributes, and Coversion Tracking ([docs](https://community.shopify.com/c/Shopify-Design/Cart-Use-permalinks-to-pre-load-the-cart/td-p/613702#toc-hId--878374329)):
    - `/cart/70881412:1,70881382:1?note=came-from-newsletter-2013-02-14`
    - `/cart/70881412:1,70881382:1?attributes[where-from]=came-from-newsletter-2013-02-14&attributes[some-other-key]=some-value`
    - `/cart/70881412:1,70881382:1?ref=came-from-newsletter-2013-02-14`

Limitations include:
- No line item attributes
- Must be Shopify Plus and have `checkout.liquid` enabled
- Requires extra logic if using multiple checkouts (ie. Recharge and Shopify)
- Unsupported by Nacelle

```js
  createCheckoutPermalink({ rootGetters }) {
    const cartItems = rootGetters['cart/checkoutLineItems']
    const baseUrl = `https://${this.$nacelle.myshopifyDomain}/cart/`
    const parameters = cartItems.map(item => {
      const { quantity, variantId } = item

      return `${decodeBase64Id(variantId)}:${quantity}`
    })
    return baseUrl + parameters
  }
```

### Checkout.liquid
We must add this script to our Shopify theme's `checkout.liquid`:

```html
    <script>
      {% assign path = "path=/" %}
      {% assign domain = "domain=nacellestaging.com" %}
      {% assign seconds = 5 | times: 24 | times: 60 | times: 60 %}
      {% assign exp = 'now' | date: "%s" | plus: seconds | date: "%a, %d %m %Y" %}
      {% assign exp = "expires=" | append: exp | append: " 00:00:00 UTC" %}
      {% if checkout.order_id %}
      	// This will only run on the first vist to the thank_you page
        if (Shopify.Checkout.step === 'thank_you') {
          document.cookie = "nacelle-checkout-completed=true; {{ domain }}; {{ exp }}; {{ path }}"
        }
      {% else %}
        {% assign token = tracking_code | split: 'checkouts\/' | last | split: '?' | first %}
      	document.cookie = "nacelle-checkout={{ token }}; {{ domain }}; {{ exp }}; {{ path }}"
      	document.cookie = "nacelle-checkout-completed=false; {{ domain }}; {{ exp }}; {{ path }}"
      {% endif %}
    </script>
```

### Demo:
https://permalinks.nacellestaging.com/

- Use `$nuxt.$store.state.checkout` to check `id` and `url` state.
