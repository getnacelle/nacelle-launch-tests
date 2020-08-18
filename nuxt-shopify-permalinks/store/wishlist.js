import axios from 'axios'
import localforage from 'localforage'

export const state = () => ({
  id: null,
  title: 'Shopping List',
  items: []
})

export const mutations = {
  setId(state, id) {
    state.id = id
  },
  setTitle(state, title) {
    state.title = title
  },
  setItems(state, items) {
    state.items = items
  },
  mergeItems(state, dbItems) {
    // Filter out duplicate variant matches
    const localItems = state.items.filter(localItem => {
      return !dbItems.find(dbItem => {
        return localItem.variant.id === dbItem.variant.id
      })
    })
    state.items = localItems.concat(dbItems)
  },
  pushItem(state, item) {
    state.items.push(item)
  },
  removeItem(state, variantId) {
    state.items = state.items.filter(item => item.variant.id !== variantId)
  }
}

export const actions = {
  async getProductData() {
    const res = await axios.get('/data/search.json')
    if (res && res.data) {
      // The old version of nacelle-nuxt-module uses 'products', new version uses 'product'
      const key = res.data.products ? 'products' : 'product'
      return res.data[key].filter(
        product => product && product.title && product.variants
      )
    }
  },

  async getWishlists({ commit, dispatch, state, rootState }) {
    // get products
    const products = (await dispatch('getProductData')) || []

    if (rootState.account && rootState.account.customer) {
      const variables = {
        customerId: rootState.account.customer.id
      }
      const response = await this.$nacelle.wishlist.get(variables)
      const { data, errors } = response.data
      if (errors && errors.length) {
        throw new Error(JSON.stringify(errors))
      }
      const { items } = data.getWishlistsByCustomerSourceId
      if (items) {
        const shoppingList = items.find(item => item.title === state.title) || {
          id: null,
          items: []
        }
        commit('setId', shoppingList.id)

        // Need to map handle and variant id to shop product data
        const wishlistItems = shoppingList.items.reduce((mappedItems, item) => {
          const product = products.find(
            product => product.handle === item.handle
          )
          if (product) {
            const variant = product.variants.find(
              variant => variant.id === item.variantId
            )
            if (variant) {
              mappedItems.push({
                product,
                variant
              })
            }
          }
          return mappedItems
        }, [])
        const anonymousItemsLength = state.items.length
        await commit('mergeItems', wishlistItems)
        if (state.items.length > anonymousItemsLength) {
          await dispatch('updateWishlist')
        } else {
          await dispatch('saveWishlist')
        }
      }
    } else {
      const wishlist = await localforage.getItem('wishlist')
      if (wishlist) {
        commit('setId', wishlist.id)
        commit('setItems', wishlist.items)
        commit('setTitle', wishlist.title)
      }
    }
  },

  async addToWishlist({ commit, dispatch, state, rootState }, payload) {
    if (payload.variant && payload.product) {
      await commit('pushItem', payload)
      if (rootState.account && rootState.account.customer) {
        const variables = {
          id: state.id,
          title: state.title,
          customerId: rootState.account.customer.id,
          items: state.items.map(item => ({
            handle: item.product.handle,
            variantId: item.variant.id
          }))
        }
        const response = await this.$nacelle.wishlist.put(variables)
        const { data, errors } = response.data
        if (errors && errors.length) {
          throw new Error(JSON.stringify(errors))
        }
        const { id, customerSourceId, items } = data.putWishlist
        commit('setId', id)
      }
      dispatch('saveWishlist')
    } else {
      console.error('must pass item with valid variant and product')
    }
  },

  async removeFromWishlist(
    { commit, dispatch, state, rootState },
    { variantId }
  ) {
    if (variantId) {
      await commit('removeItem', variantId)
      if (rootState.account && rootState.account.customer) {
        const variables = {
          id: state.id,
          title: state.title,
          customerId: rootState.account.customer.id,
          items: state.items.map(item => ({
            handle: item.product.handle,
            variantId: item.variant.id
          }))
        }
        const response = await this.$nacelle.wishlist.put(variables)
        const { data, errors } = response.data
        if (errors && errors.length) {
          throw new Error(JSON.stringify(errors))
        }
        const { customerSourceId, items } = data.putWishlist
      }
      dispatch('saveWishlist')
    } else {
      console.error('must pass item with valid variantId')
    }
  },

  async updateWishlist({ dispatch, rootState, state }) {
    if (rootState.account && rootState.account.customer) {
      const variables = {
        id: state.id,
        title: state.title,
        customerId: rootState.account.customer.id,
        items: state.items.map(item => ({
          handle: item.product.handle,
          variantId: item.variant.id
        }))
      }
      const response = await this.$nacelle.wishlist.put(variables)
      const { data, errors } = response.data
      if (errors && errors.length) {
        throw new Error(JSON.stringify(errors))
      }
      const { customerSourceId, items } = data.putWishlist
    }
    dispatch('saveWishlist')
  },

  resetWishlist({ commit }) {
    commit('setId', null)
    commit('setItems', [])
  },

  async saveWishlist(context) {
    localforage.setItem('wishlist', context.state)
  }
}

export const getters = {
  getItemByVariantId: state => variantId => {
    return state.items.find(item => item.variant.id === variantId)
  },
  quantityTotal(state) {
    return state.items.length
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
