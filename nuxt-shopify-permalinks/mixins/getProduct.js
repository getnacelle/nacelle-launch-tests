import { mapMutations } from 'vuex'

export default (config = {}) => {
  return {
    data() {
      return {
        handle: null,
        product: null,
        noProductData: false
      }
    },
    async asyncData(context) {
      const { params, app } = context
      const { $nacelle } = app
      const { productHandle } = params

      const productObj = {
        productHandle: config.productHandle || productHandle,
        product: null,
        locale: config.locale || $nacelle.locale
      }

      if (process.server) {
        const fs = require('fs')
        try {
          const file = fs.readFileSync(
          `./static/data/products/${productObj.productHandle}--${productObj.locale}/static.json`,
          'utf-8'
          )
          productObj.product = JSON.parse(file)
        } catch (err) {
          productObj.noProductData = true
        }
      } else {
        productObj.product = await $nacelle.data.product({
          handle: productObj.productHandle,
          locale: productObj.locale
        }).catch(() => {
          productObj.noProductData = true
        })
      }

      return {
        ...productObj
      }
    },
    async created() {
      if (this.product) {
        this.setProduct(this.product)
      }

      this.unsubscribe = this.$store.subscribe(async (mutation, state) => {
        if (mutation.type === 'user/setLocale') {
          this.locale = mutation.payload.locale

          this.product = await this.$nacelle.data.product({
            handle: this.productHandle,
            locale: this.$nacelle.locale
          }).catch(() => {
            this.noProductData = true
          })
        }
      })
    },
    methods: {
      ...mapMutations('product', ['setProduct'])
    },
    beforeDestroy() {
      this.unsubscribe()
    }
  }
}
