import { mapMutations } from 'vuex'
import { getCollectionData, collectionProducts } from '@nacelle/nacelle-tools'
import observeFetchMoreComponent from './observeFetchMoreComponent'

export default ({ pageHandle, itemsPerPage, selectedList, locale } = {}) => {
  return {
    mixins: [observeFetchMoreComponent],
    data() {
      return {
        handle: null,
        collection: null,
        noCollectionData: false,
        products: [],
        productIndex: 0,
        productsPerPage: itemsPerPage || 30,
        selectedList: selectedList || 'default',
        isLoadingProducts: false
      }
    },
    async asyncData(context) {
      const { params, store, app, payload } = context
      const { handle } = params
      const { $nacelle } = app

      // Check if collection saved in vuex store
      const getCollection = store.getters['collections/getCollection']
      const storeCollection = getCollection(pageHandle || handle)

      if (storeCollection) {
        return {
          ...storeCollection
        }
      }

      // If not in store fetch static data
      const collectionData = await getCollectionData({
        handle: pageHandle || handle,
        locale: locale || $nacelle.locale,
        payload
      })

      let products = []

      if (
        collectionData &&
        collectionData.collection &&
        collectionData.collection.productLists
      ) {
        products = await collectionProducts({
          productLists: collectionData.productLists,
          productsPerPage: itemsPerPage || 30,
          selectedList: selectedList || 'default',
          locale: locale || $nacelle.locale
        })
      }

      // Create collection object for vuex store and returned async data
      const collectionObj = {
        handle: pageHandle || handle,
        ...collectionData,
        products,
        productIndex: products.length,
        selectedList: selectedList || 'default'
      }

      store.commit('collections/addCollection', collectionObj)

      return collectionObj
    },
    async created () {
      // Flag for determining if we update collection in vuex store
      let updateCollection = false

      this.handle = pageHandle || this.$route.params.handle

      if (process.browser) {
        // If no collection data, fetch
        if (!this.collection && !this.noCollectionData) {
          this.collection = await this.$nacelle.collection({
            handle: this.handle,
            locale: locale || this.$nacelle.locale
          })
          updateCollection = true
        }

        // Try to get product data if products array is empty
        if (this.products.length === 0) {
          if (this.collection && this.collection.productLists) {
            this.isLoadingProducts = true
            this.products = await collectionProducts({
              productLists: this.collection.productLists,
              productsPerPage: this.productsPerPage,
              selectedList: this.selectedList,
              locale: locale || this.$nacelle.locale
            })
            updateCollection = true
          }
        }
      }

      this.isLoadingProducts = false
      this.productIndex = this.products.length

      if (updateCollection) {
        this.updateCollection({
          handle: this.handle,
          collection: this.collection,
          products: this.products,
          productIndex: this.products.length,
          selectedList: this.selectedList
        })
      }
    },
    methods: {
      ...mapMutations('collections', ['updateCollection']),
      async fetchMore() {
        if (
          !this.isLoadingProducts &&
          this.collection &&
          Array.isArray(this.collection.products) &&
          this.products.length > 0 &&
          this.productIndex < this.collection.products.length
        ) {
          this.isLoadingProducts = true

          const nextPageProducts = await collectionProducts({
            productLists: this.collection.productLists,
            productsPerPage: this.productsPerPage,
            index: this.productIndex,
            selectedList: this.selectedList,
            locale: locale || this.$nacelle.locale
          })

          this.products = [
            ...this.products,
            ...nextPageProducts
          ]
          this.productIndex += this.productsPerPage
          this.isLoadingProducts = false
          this.updateCollection({
            handle: this.handle,
            collection: this.collection,
            products: this.products,
            productIndex: this.productIndex
          })
        }
      }
    }
  }
}
