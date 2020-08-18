export default (config = {}) => {
  return {
    data() {
      return {
        articleHandle: null,
        blogHandle: null,
        article: null,
        noArticleData: false
      }
    },
    async asyncData(context) {
      const { params, app } = context
      const { $nacelle } = app
      const { articleHandle, blogHandle } = params

      const articleObj = {
        articleHandle: config.articleHandle || articleHandle,
        blogHandle: config.blogHandle || blogHandle,
        article: null,
        locale: config.locale || $nacelle.locale
      }

      if (process.server) {
        const fs = require('fs')
        try {
          const file = fs.readFileSync(
          `./static/data/articles/${articleObj.blogHandle}/${articleObj.articleHandle}--${articleObj.locale}/static.json`,
          'utf-8'
          )
          articleObj.article = JSON.parse(file)
        } catch (err) {
          articleObj.noArticleData = true
        }
      } else {
        articleObj.article = await $nacelle.data.article({
          handle: articleObj.articleHandle,
          blogHandle: articleObj.blogHandle,
          locale: articleObj.locale
        }).catch(() => {
          articleObj.noArticleData = true
        })
      }

      return {
        ...articleObj
      }
    },
    created() {
      this.unsubscribe = this.$store.subscribe(async (mutation, state) => {
        if (mutation.type === 'user/setLocale') {
          this.locale = mutation.payload.locale

          this.article = await this.$nacelle.data.article({
            handle: this.articleHandle,
            blogHandle: this.blogHandle,
            locale: this.$nacelle.locale
          }).catch(() => {
            this.noArticleData = true
          })
        }
      })
    },
    beforeDestroy() {
      this.unsubscribe()
    }
  }
}
