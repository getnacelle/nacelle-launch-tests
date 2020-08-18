export default (config = {}) => {
  return {
    data() {
      return {
        pageHandle: null,
        page: null,
        noPageData: false
      }
    },
    async asyncData(context) {
      const { params, app } = context
      const { $nacelle } = app
      const { pageHandle } = params

      const pageObj = {
        pageHandle: config.pageHandle || pageHandle,
        page: null,
        locale: config.locale || $nacelle.locale
      }

      if (process.server) {
        const fs = require('fs')
        try {
          const file = fs.readFileSync(
          `./static/data/pages/${pageObj.pageHandle}--${pageObj.locale}/static.json`,
          'utf-8'
          )
          pageObj.page = JSON.parse(file)
        } catch (err) {
          pageObj.noPageData = true
        }
      } else {
        pageObj.page = await $nacelle.data.page({
          handle: pageObj.pageHandle,
          locale: pageObj.locale
        }).catch(() => {
          pageObj.noPageData = true
        })
      }

      return {
        ...pageObj
      }
    },
    created() {
      this.unsubscribe = this.$store.subscribe(async (mutation, state) => {
        if (mutation.type === 'user/setLocale') {
          this.locale = mutation.payload.locale

          this.page = await this.$nacelle.data.page({
            handle: this.pageHandle,
            locale: this.$nacelle.locale
          }).catch(() => {
            this.noPageData = true
          })
        }
      })
    },
    beforeDestroy() {
      this.unsubscribe()
    }
  }
}
