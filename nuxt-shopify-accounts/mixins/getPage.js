import { getPageData } from '@nacelle/nacelle-tools'

export default ({ pageHandle, locale } = {}) => {
  return {
    data () {
      return {
        handle: null,
        page: null,
        noPageData: false
      }
    },
    async asyncData (context) {
      const { params, app, payload } = context
      const { handle } = params
      const { $nacelle } = app

      const pageData = await getPageData({
        handle: pageHandle || handle,
        locale: locale || $nacelle.locale,
        payload
      })

      return {
        ...pageData
      }
    },
    async created () {
      this.handle = pageHandle || this.$route.params.handle

      if (process.browser && !this.page && !this.noPageData) {
        const pageData = await this.$nacelle.content({
          handle: this.handle,
          locale: locale || this.$nacelle.locale
        })

        if (pageData) {
          if (pageData.noData) {
            this.noPageData = true
          } else {
            this.page = pageData
          }
        } else {
          this.noPageData = true
        }
      }
    }
  }
}
