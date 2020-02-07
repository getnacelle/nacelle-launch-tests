import { getArticleData } from '../nacelle/fetch-static'

export default (config = {}) => {
  return {
    data() {
      return {
        handle: null,
        blogHandle: null,
        article: null,
        noArticleData: false
      }
    },
    async asyncData(context) {
      const { params, payload, app } = context
      const { $nacelle } = app
      const { handle, blogHandle } = params

      const articleData = await getArticleData({
        handle: config.articleHandle || handle,
        blogHandle: config.blogHandle || blogHandle,
        locale: config.locale || $nacelle.locale,
        payload
      })

      return {
        ...articleData
      }
    },
    async created() {
      this.handle = config.articleHandle || this.$route.params.handle
      this.blogHandle = config.blogHandle || this.$route.params.blogHandle

      if (
        process.browser &&
        !this.article &&
        !this.noArticleData
      ) {
        this.article = await this.$nacelle.article({
          articleHandle: this.handle,
          blogHandle: this.blogHandle,
          locale: config.locale || this.$nacelle.locale
        })
      }
    }
  }
}
