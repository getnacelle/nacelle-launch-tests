import { getBlogData, blogArticles } from '@nacelle/nacelle-tools'
import observeFetchMoreComponent from './observeFetchMoreComponent'

export default (config = {}) => {
  return {
    mixins: [observeFetchMoreComponent],
    data() {
      return {
        handle: null,
        blog: null,
        articles: null,
        articleIndex: 0,
        articlesPerPage: config.itemsPerPage || 12,
        selectedList: config.selectedList || 'default',
        noBlogData: false,
        isLoadingArticles: false
      }
    },
    async asyncData(context) {
      const { params, app, payload } = context
      const { blogHandle } = params
      const { $nacelle } = app
      let articles = []

      const blogData = await getBlogData({
        handle: config.blogHandle || blogHandle,
        locale: config.locale || $nacelle.locale,
        payload
      })

      if (blogData && blogData.blog && blogData.blog.articleLists) {
        articles = await blogArticles({
          blogHandle: config.blogHandle || blogHandle,
          articleLists: blogData.blog.articleLists,
          articlesPerPage: config.itemsPerPage || 12,
          selectedList: config.selectedList || 'default',
          locale: config.locale || $nacelle.locale
        })
      }

      return {
        ...blogData,
        articles,
        articleIndex: articles.length,
        selectedList: config.selectedList || 'default'
      }
    },
    async created() {
      this.handle = config.blogHandle || this.$route.params.blogHandle

      if (process.browser) {
        if (!this.blog && !this.noBlogData) {
          this.blog = await this.$nacelle.blog({
            handle: this.handle,
            locale: config.locale || this.$nacelle.locale
          })
        }

        if (this.blog && this.blog.articleLists) {
          this.isLoadingArticles = true
          this.articles = await blogArticles({
            blogHandle: this.handle,
            articleLists: this.blog.articleLists,
            articlesPerPage: this.articlesPerPage,
            selectedList: this.selectedList,
            locale: config.locale || this.$nacelle.locale
          })
        } else {
          this.articles = []
        }
      }

      this.isLoadingArticles = false
      this.articleIndex = this.articles.length
    },
    methods: {
      async fetchMore() {
        if (
          this.blog &&
          Array.isArray(this.blog.articles) &&
          Array.isArray(this.articles) &&
          this.articles.length > 0 &&
          this.articleIndex < this.blog.articles.length
        ) {
          this.isLoadingArticles = true

          const nextPageArticles = await blogArticles({
            blogHandle: this.handle,
            articleLists: this.blog.articleLists,
            articlesPerPage: this.articlesPerPage,
            index: this.articleIndex,
            selectedList: this.selectedList,
            locale: config.locale || this.$nacelle.locale
          })

          this.articles = [
            ...this.articles,
            ...nextPageArticles
          ]
          this.articleIndex += this.articlesPerPage
          this.isLoadingArticles = false
        }
      }
    }
  }
}
