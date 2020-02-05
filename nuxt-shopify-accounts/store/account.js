import localforage from 'localforage'
import axios from 'axios'
import {
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_ACCESS_TOKEN_RENEW,
  CUSTOMER_ACCESS_TOKEN_DELETE,
  GET_CUSTOMER_ORDERS,
  GET_CUSTOMER_DEFAULT_ADDRESS,
  GET_CUSTOMER_ADDRESSES,
  CHECKOUT_CUSTOMER_ASSOCIATE,
  CHECKOUT_CUSTOMER_DISASSOCIATE,
  transformEdges,
  transformOrders
} from '../gql'

const accountClient = axios.create({
  baseURL: `https://${process.env.SHOPIFY_URL}/api/2020-01/graphql`,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_GRAPHQL_TOKEN
  }
})

const apiClient = axios.create({
  baseURL: '/',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
})

export const state = () => ({
  customer: null,
  customerAccessToken: null,
  orders: [],
  defaultAddress: null,
  addresses: [],
  userErrors: []
})

export const mutations = {
  setErrors(state, userErrors) {
    state.userErrors = userErrors
  },
  setCustomerAccessToken(state, customerAccessToken) {
    state.customerAccessToken = customerAccessToken
  },
  setOrders(state, orders) {
    state.orders = orders
  },
  setDefaultAddress(state, defaultAddress) {
    state.defaultAddress = defaultAddress
  },
  setAddresses(state, addresses) {
    state.addresses = addresses
  }
}

export const actions = {
  async readCustomerAccessToken({ dispatch, commit }) {
    const customerAccessToken = await localforage.getItem('customerAccessToken')

    if (customerAccessToken === null) { return }
    if (new Date(customerAccessToken.expiresAt) < Date.now()) {
      localforage.removeItem('customerAccessToken')
    } else {
      commit('setCustomerAccessToken', customerAccessToken)
      dispatch('renewCustomerAccessToken', customerAccessToken.accessToken)
    }
  },

  async renewCustomerAccessToken({ commit }, payload) {
    const variables = { customerAccessToken: payload }
    const query = CUSTOMER_ACCESS_TOKEN_RENEW
    const response = await accountClient.post(null, { query, variables })
    const { customerAccessToken, userErrors } = response.data.data.customerAccessTokenRenew
    if (customerAccessToken) {
      localforage.setItem('customerAccessToken', customerAccessToken)
      commit('setCustomerAccessToken', customerAccessToken)
    }
    commit('setErrors', userErrors)
  },

  // async login({ state, dispatch, commit, rootState }, payload) {
  //   const variables = { input: { email: payload.email, password: payload.password } }
  //   const query = CUSTOMER_ACCESS_TOKEN_CREATE
  //   const response = await accountClient.post(null, { query, variables })
  //   const { customerAccessToken, userErrors } = response.data.data.customerAccessTokenCreate
  //   if (customerAccessToken) {
  //     localforage.setItem('customerAccessToken', customerAccessToken)
  //     commit('setCustomerAccessToken', customerAccessToken)
  //     // dispatch('setShopifySession', payload)
  //   }
  //   commit('setErrors', userErrors)
  // },

  async login ({ commit }, { email, password }) {
    try {
      const { data } = await apiClient.post('api/login', { email, password })
      const { customerAccessToken, multipassUrl, userErrors } = data
      if (customerAccessToken) {
        localforage.setItem('customerAccessToken', customerAccessToken)
        commit('setCustomerAccessToken', customerAccessToken)
      }
      commit('setErrors', userErrors)
      return data
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  async logout({ state, dispatch, commit, rootState }) {
    const variables = { customerAccessToken: state.customerAccessToken.accessToken }
    const query = CUSTOMER_ACCESS_TOKEN_DELETE
    const response = await accountClient.post(null, { query, variables })
    const { deletedAccessToken, deletedCustomerAccessTokenId, userErrors } = response.data.data.customerAccessTokenDelete
    if (deletedAccessToken) {
      await axios.post('/api/logout')
      localforage.removeItem('customerAccessToken')
      commit('setCustomerAccessToken', null)
    }
    commit('setErrors', userErrors)
  },

  // async setShopifySession({ state, dispatch, commit, rootState }, payload) {
  //   const bodyFormData = new FormData();
  //   bodyFormData.set('form_type', 'customer_login');
  //   bodyFormData.set('utf8', '✓');
  //   bodyFormData.set('customer[email]', payload.email);
  //   bodyFormData.set('customer[password]', payload.password);

  //   console.log('payload', payload)

  //   axios({
  //     method: 'post',
  //     url: payload.action,
  //     data: bodyFormData,
  //     headers: {'Content-Type': 'multipart/form-data'}
  //   })
  //   .then(function (response) {
  //     //handle success
  //     console.log(response);
  //   })
  //   .catch(function (response) {
  //     //handle error
  //     console.log(response);
  //   });
  // },

  async fetchOrders({ state, dispatch, commit, rootState }, payload) {
    const variables = { customerAccessToken: state.customerAccessToken.accessToken }
    const query = GET_CUSTOMER_ORDERS
    const response = await accountClient.post(null, { query, variables })
    const { customer, userErrors } = response.data.data
    if (customer) {
      commit('setOrders', transformOrders(customer.orders))
    }
    commit('setErrors', userErrors)
  },

  async fetchDefaultAddress({ state, dispatch, commit, rootState }, payload) {
    const variables = { customerAccessToken: state.customerAccessToken.accessToken }
    const query = GET_CUSTOMER_DEFAULT_ADDRESS
    const response = await accountClient.post(null, { query, variables })
    const { customer, userErrors } = response.data.data
    if (customer) {
      commit('setDefaultAddress', customer.defaultAddress)
    }
    commit('setErrors', userErrors)
  },

  async fetchAddresses({ state, dispatch, commit, rootState }, payload) {
    const variables = { customerAccessToken: state.customerAccessToken.accessToken }
    const query = GET_CUSTOMER_ADDRESSES
    const response = await accountClient.post(null, { query, variables })
    const { customer, userErrors } = response.data.data
    if (customer) {
      commit('setAddresses', transformEdges(customer.addresses))
    }
    commit('setErrors', userErrors)
  },

  async checkoutCustomerAssociate({ state, dispatch, commit, rootState }, { checkoutId }) {
    // console.log('rootState', rootState, checkoutId)
    const variables = {
      checkoutId: checkoutId,
      customerAccessToken: state.customerAccessToken.accessToken
    }
    const query = CHECKOUT_CUSTOMER_ASSOCIATE
    const response = await accountClient.post(null, { query, variables })
    // console.log('response', response)
    // const { customer, userErrors } = response.data.data
    // if (customer) {
    //   commit('setAddresses', transformEdges(customer.addresses))
    // }
    // commit('setErrors', userErrors)
  }
}
