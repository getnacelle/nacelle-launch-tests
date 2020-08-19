import localforage from 'localforage'
import * as Cookies from 'es-cookie'
const isFunc = (func) => (typeof func === 'function')

const decodeBase64Id = (encodedId) => {
  const base64id = encodedId.split("::").shift()
  return Buffer.from(base64id, "base64")
    .toString("binary")
    .split("/")
    .pop()
}

export const state = () => ({
  id: null,
  url: null
})

export const mutations = {
  setId(state, payload) {
    localforage.setItem('checkout-id', payload)
    state.id = payload
  },

  setUrl(state, payload) {
    localforage.setItem('checkout-url', payload)
    state.url = payload
  },

  setCheckout(state, { id, url }) {
    localforage.setItem('checkout-id', id)
    localforage.setItem('checkout-url', url)
    state.id = id
    state.url = url
  }
}

export const actions = {
  async initializeCheckout({ commit, dispatch }) {
    const id = Cookies.get('nacelle-checkout')
    const completed = Cookies.get('nacelle-checkout-completed')
    // const id = await localforage.getItem('checkout-id')
    const url = await localforage.getItem('checkout-url')
    if (id && url) {
      // const { completed } = await this.$nacelle.checkout.get({ id, url })
      if (completed === 'true') {
        await dispatch('resetCheckout')
      } else {
        commit('setCheckout', { id, url })
      }
    }
  },

  updateCheckoutId({ commit }, payload) {
    commit('setId', payload)
  },

  async resetCheckout({ commit, dispatch }) {
    Cookies.remove('nacelle-checkout', { path: '/' });
    Cookies.remove('nacelle-checkout-status', { path: '/' });
    commit('setCheckout', { id: null, url: null })
    await dispatch('cart/resetLineItems', null, { root: true })
  },

  async processCheckout({ dispatch }, { beforeCreate, beforeRedirect }) {
    if (isFunc(beforeCreate)) {
      await beforeCreate()
    }
    await dispatch('checkoutCreate')
    await dispatch('addCheckoutParams')
    if (isFunc(beforeRedirect)) {
      await beforeRedirect()
    }
    dispatch('checkoutRedirect')
  },

  async checkoutCreate({ commit, dispatch, state, rootState, rootGetters }) {
    const cartItems = rootGetters['cart/checkoutLineItems']
    const checkoutId = state.id || ''

    if (cartItems.length === 0) {
      throw new Error('Cannot checkout with an empty cart')
    }

    // let checkout = await this.$nacelle.checkout.process({ cartItems, checkoutId })
    // if (checkout && checkout.completed) {
    //   checkout = await this.$nacelle.checkout.process({ cartItems, checkoutId: '' })
    // }

    // if (!checkout || !checkout.id || !checkout.url) {
    //   throw new Error('Checkout Failure')
    // }

    const checkout = {
      id: checkoutId,
      url: await dispatch('createCheckoutPermalink')
    }

    if (rootState.events) {
      dispatch('events/checkoutInit', { cart: rootState.cart.lineItems }, { root: true })
    }

    commit('setCheckout', checkout)
  },

  async addCheckoutParams({ commit, dispatch, state, rootState }) {
    const queryOperator = state.url.includes('?') ? '&' : '?'
    const linkerParam = await dispatch('getLinkerParam')
    await commit('setUrl', `${state.url}${queryOperator}c=${JSON.stringify(rootState.user.userData)}&${linkerParam}`)
  },

  async getLinkerParam() {
    return new Promise((resolve, reject) => {
      const gaClient = process.browser ? window.ga : undefined

      if (typeof gaClient !== 'undefined') {
        gaClient((tracker) => resolve(tracker.get('linkerParam')))
      }

      // if no ga resolve with empty string
      resolve('')
    })
  },

  checkoutRedirect ({ state }) {
    if (process.browser) {
      window.location = state.url
    }
  },

  createCheckoutPermalink({ rootGetters }) {
    const cartItems = rootGetters['cart/checkoutLineItems']
    const baseUrl = `https://${this.$nacelle.myshopifyDomain}/cart/`
    const parameters = cartItems.map(item => {
      const { quantity, variantId } = item

      return `${decodeBase64Id(variantId)}:${quantity}`
    })
    return baseUrl + parameters
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
