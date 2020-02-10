<template>
  <div
    class="button is-primary checkout-button nacelle custom"
    :class="{ 'is-loading': loading }"
    @click="checkout"
  >
    {{ checkoutText }}
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  props: {
    checkoutText: {
      type: String,
      default: 'Checkout'
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters('cart', ['checkoutLineItems', 'checkoutIdForBackend'])
  },
  methods: {
    ...mapMutations('cart', ['setCartError']),
    ...mapActions('cart', ['processCheckout']),
    getLocation(href) {
      var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
      return match && {
          href: href,
          protocol: match[1],
          host: match[2],
          hostname: match[3],
          port: match[4],
          pathname: match[5],
          search: match[6],
          hash: match[7]
      }
    },
    async checkout() {
      const vm = this
      this.loading = true
      const processCheckoutObject = await this.$nacelle
        .checkout({
          cartItems: vm.checkoutLineItems,
          checkoutId: vm.checkoutIdForBackend
        })
        .then(data => {
          if (data && data.id && data.url) {
            // Accounts Modifications
            // Intercept checkout url and add custom domain
            if (vm.$nacelle.shopifyCustomDomain) {
              const { protocol, pathname, search } = vm.getLocation(data.url)
              data.url = `${protocol}//${vm.$nacelle.shopifyCustomDomain}${pathname}${search}`
            }
            return data
          }
          throw new Error('checkout failure')
        })
        .catch(err => {
          console.log(err)
          vm.setCartError(err)
          vm.loading = false
        })
      this.processCheckout(processCheckoutObject)
    }
  }
}
</script>

<style lang="scss" scoped>
.checkout-button {
  border-radius: 0;
  width: 100%;
  padding: 2rem;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 12pt;
  letter-spacing: 1px;
}
</style>