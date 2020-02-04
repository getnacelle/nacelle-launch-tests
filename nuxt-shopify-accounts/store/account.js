import localforage from 'localforage'
import axios from 'axios'
import {
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_ACCESS_TOKEN_RENEW,
  GET_CUSTOMER_ORDERS,
  GET_CUSTOMER_DEFAULT_ADDRESS,
  GET_CUSTOMER_ADDRESSES,
  transformEdges,
  transformOrders
} from '../gql'

const accountClient = axios.create({
  baseURL: 'https://starship-furniture.myshopify.com/api/2020-01/graphql',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Shopify-Storefront-Access-Token': 'f274a6e2390d860f9226b2dce33ddd8a'
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

  async login({ state, dispatch, commit, redirect }, payload) {
    const variables = { input: { email: payload.email, password: payload.password } }
    const query = CUSTOMER_ACCESS_TOKEN_CREATE
    const response = await accountClient.post(null, { query, variables })
    const { customerAccessToken, userErrors } = response.data.data.customerAccessTokenCreate
    if (customerAccessToken) {
      localforage.setItem('customerAccessToken', customerAccessToken)
      commit('setCustomerAccessToken', customerAccessToken)
    }
    commit('setErrors', userErrors)
  },

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

  logout({ state, dispatch, commit, rootState, context }) {
    console.log('logout')
  }
}
