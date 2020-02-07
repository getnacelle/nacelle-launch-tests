import { getProductData } from '@nacelle/nacelle-tools'

export default ({ productHandle, locale } = {}) => {
  return {
    data () {
      return {
        handle: null,
        product: null,
        noProductData: false
      }
    },
    async asyncData (context) {
      const { params, payload, app } = context
      const { handle } = params
      const { $nacelle } = app

      const productData = await getProductData({
        handle: productHandle || handle,
        locale: locale || $nacelle.locale,
        payload
      })

      return {
        ...productData
      }
    },
    async created () {
      this.handle = productHandle || this.$route.params.handle

      if (process.browser) {
        if (!this.product && !this.noProductData) {
          const result = await this.$nacelle.products({
            handle: this.handle,
            locale: locale || this.$nacelle.locale
          })

          if (
            Array.isArray(result) &&
            result.length > 0
          ) {
            this.product = result.pop()
          }
        }
      }
    }
  }
}
