export default (config = {}) => {
  return {
    data() {
      return {
        blogHandle: null,
        blog: null,
        articles: [],
        articleIndex: 0,
        articlesPerPage: config.itemsPerPage || 12,
        selectedList: config.selectedList || 'default',
        noBlogData: false,
        isLoadingArticles: false
      }
    },
    async asyncData(context) {
      const { params, app } = context
      const { blogHandle } = params
      const { $nacelle } = app

      const blogObj = {
        blogHandle: config.blogHandle || blogHandle,
        blog: null,
        articles: [],
        articleIndex: 0,
        selectedList: config.selectedList || 'default',
        locale: config.locale || $nacelle.locale
      }

      if (process.server) {
        const fs = require('fs')
        try {
          const file = fs.readFileSync(`./static/data/blogs/${blogObj.blogHandle}--${blogObj.locale}/static.json`, 'utf-8')
          blogObj.blog = JSON.parse(file)
        } catch (err) {
          blogObj.noBlogData = true
        }

        if (
          blogObj.blog &&
          blogObj.blog.articleLists &&
          blogObj.blog.articleLists.length > 0
        ) {
          const articleList = blogObj.blog.articleLists.find(list => {
            return list.slug === blogObj.selectedList
          })

          const handles = articleList.handles.slice(0, config.itemsPerPage || 30)

          handles.forEach(handle => {
            const articleFile = fs.readFileSync(`./static/data/articles/${blogObj.blogHandle}/${handle}--${blogObj.locale}/static.json`, 'utf-8')
            blogObj.articles.push(JSON.parse(articleFile))
          })
        }
      } else {
        blogObj.blog = await $nacelle.data.blog({
          handle: config.blogHandle || blogHandle,
          locale: config.locale || $nacelle.locale
        }).catch(() => {
          blogObj.noBlogData = true
        })

        if (
          blogObj.blog &&
          blogObj.blog.articleLists &&
          blogObj.blog.articleLists.length > 0
        ) {
          blogObj.articles = await $nacelle.data.blogPage({
            blog: blogObj.blog,
            selectedList: config.selectedList || 'default',
            paginate: true,
            itemsPerPage: config.itemsPerPage || 12,
            locale: blogObj.locale
          })
        }
      }

      if (blogObj.blog) {
        blogObj.articleIndex = blogObj.articles.length
      }

      return {
        ...blogObj
      }
    },
    computed: {
      selectedBlogList() {
        if (
          this.blog &&
          Array.isArray(this.blog.articleLists)
        ) {
          const list = this.blog.articleLists.find(list => {
            return list.slug === this.selectedList
          })

          if (list && Array.isArray(list.handles)) {
            return list.handles
          }
        }

        return []
      }
    },
    created() {
      this.unsubscribe = this.$store.subscribe(async (mutation, state) => {
        if (mutation.type === 'user/setLocale') {
          this.locale = mutation.payload.locale

          this.blog = await this.$nacelle.data.blog({
            handle: this.blogHandle,
            locale: this.$nacelle.locale
          }).catch(() => {
            this.noBlogData = true
          })

          if (
            this.blog &&
            this.blog.articleLists &&
            this.blog.articleLists.length > 0
          ) {
            this.articles = await this.$nacelle.data.blogPage({
              blog: this.blog,
              selectedList: this.selectedList || 'default',
              paginate: true,
              itemsPerPage: this.itemsPerPage || 12,
              locale: this.$nacelle.locale
            })

            this.articleIndex = this.articles.length
          }
        }
      })
    },
    beforeDestroy() {
      this.unsubscribe()
    },
    methods: {
      async fetchMore() {
        if (
          this.blog &&
          Array.isArray(this.articles) &&
          this.articles.length > 0 &&
          this.articleIndex < this.selectedBlogList.length
        ) {
          this.isLoadingArticles = true

          const nextPageArticles = await this.$nacelle.data.blogPage({
            blog: this.blog,
            selectedList: this.selectedList || 'default',
            paginate: true,
            itemsPerPage: this.articlesPerPage || 12,
            index: this.articleIndex,
            locale: this.locale
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
