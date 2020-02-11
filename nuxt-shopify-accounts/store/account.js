import axios from 'axios'
import Multipassify from 'multipassify';

import {
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_ACCESS_TOKEN_RENEW,
  CUSTOMER_ACCESS_TOKEN_DELETE,
  CUSTOMER_CREATE,
  CUSTOMER_RECOVER,
  CUSTOMER_RESET,
  GET_CUSTOMER,
  GET_CUSTOMER_ORDERS,
  GET_CUSTOMER_DEFAULT_ADDRESS,
  GET_CUSTOMER_ADDRESSES,
  CUSTOMER_ADDRESS_CREATE,
  CUSTOMER_ADDRESS_UPDATE,
  CUSTOMER_ADDRESS_DELETE,
  transformEdges,
  transformOrders
} from '../gql'
import { stat } from 'fs';

import {
  set as setCookie,
  get as getCookie,
  remove as removeCookie,
  parse as parseCookie,
  encode as encodeCookie
} from 'es-cookie';

const accountClient = axios.create({
  baseURL: `https://${process.env.myshopifyDomain}/api/2020-01/graphql`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Shopify-Storefront-Access-Token': process.env.shopifyToken
  }
})

const multipassify = new Multipassify(process.env.shopifyMultipassSecret);

export const state = () => ({
  customer: null,
  customerAccessToken: null,
  orders: [],
  defaultAddress: null,
  addresses: [],
  userErrors: []
})

export const mutations = {
  setErrors (state, userErrors) {
    state.userErrors = userErrors || []
  },
  setCustomer (state, customer) {
    state.customer = customer
  },
  setCustomerAccessToken (state, customerAccessToken) {
    state.customerAccessToken = customerAccessToken
  },
  setOrders (state, orders) {
    state.orders = orders
  },
  setDefaultAddress (state, defaultAddress) {
    state.defaultAddress = defaultAddress
  },
  setAddresses (state, addresses) {
    state.addresses = addresses
  },
  addAddress (state, address) {
    state.addresses = [address].concat(state.addresses)
  },
  removeAddress (state, addressId) {
    // addressId is already decoded from Shopify response
    const id = addressId.split('?')[0]
    state.addresses = state.addresses.filter(item => atob(item.id).split('?')[0] !== id)
  },
  setAddress (state, address) {
    const addressId = atob(address.id).split('?')[0]

    state.addresses = state.addresses.map((item) => {
      const itemId = atob(item.id).split('?')[0]
      if (itemId === addressId) {
        return item = address
      } else {
        return item
      }
    })
  }
}

export const actions = {
  async readCustomerAccessToken ({ dispatch, commit }, { accessToken }) {
    if (accessToken) { 
      commit('setCustomerAccessToken', { accessToken, expiresAt: null })
      dispatch('renewCustomerAccessToken', accessToken)
    }
  },

  async renewCustomerAccessToken ({ commit, dispatch }, payload) {
    try {
      const variables = { customerAccessToken: payload }
      const query = CUSTOMER_ACCESS_TOKEN_RENEW
      const response = await accountClient.post(null, { query, variables })
      const { customerAccessToken, userErrors } = response.data.data.customerAccessTokenRenew
      if (customerAccessToken && customerAccessToken.accessToken) {
        const { accessToken, expiresAt } = customerAccessToken
        let expires = new Date(expiresAt);
        expires.setHours(expires.getHours());
        setCookie('customerAccessToken', accessToken, { expires })
        commit('setCustomerAccessToken', customerAccessToken)
      } else {
        // access token does not exist
        removeCookie('customerAccessToken')
        commit('setCustomerAccessToken', null)
        commit('setCustomer', null)
      }
      commit('setErrors', userErrors)
    } catch (error) {
      throw error
    }
  },

  async getCustomer ({ state, commit, dispatch }) {
    try {
      const variables = { customerAccessToken: state.customerAccessToken.accessToken }
      const query = GET_CUSTOMER
      const response = await accountClient.post(null, { query, variables })
      const { customer, userErrors } = response.data.data
      if (customer) {
        commit('setCustomer', customer)
      }
      commit('setErrors', userErrors)
    } catch (error) {
      throw error
    }
  },

  async multipassLogin ({ state, commit, dispatch }) {
    // TODO: figure out remote ip
    if (process.browser) {
      const { host, protocol } = window.location
      // multipass login
      const customerData = {
        ...state.customer,
        // remote_ip: req.ip,
        return_to: `${protocol}//${host}/account`
      }
      return {
        multipassUrl: multipassify.generateUrl(customerData, process.env.myshopifyDomain)
      }
    }
  },

  async login ({ state, commit, dispatch }, { email, password }) {
    try {
      const variables = { input: { email, password } }
      const query = CUSTOMER_ACCESS_TOKEN_CREATE
      const response = await accountClient.post(null, { query, variables })
      const { customerAccessToken, userErrors } = response.data.data.customerAccessTokenCreate

      if (customerAccessToken) {
        const { accessToken, expiresAt } = customerAccessToken
        let expires = new Date(expiresAt);
        expires.setHours(expires.getHours());
        setCookie('customerAccessToken', accessToken, { expires })
        await commit('setCustomerAccessToken', customerAccessToken)
        await dispatch('getCustomer')
        return await dispatch('multipassLogin') 
      }
      commit('setErrors', userErrors)
    } catch (error) {
      throw error
    }
  },

  async logout ({ state, dispatch, commit, rootState }) {
    const accessToken = (state.customerAccessToken && state.customerAccessToken.accessToken) || getCookie('customerAccessToken')
    const variables = { customerAccessToken: accessToken }
    const query = CUSTOMER_ACCESS_TOKEN_DELETE
    const response = await accountClient.post(null, { query, variables })
    const { deletedAccessToken, deletedCustomerAccessTokenId, userErrors } = response.data.data.customerAccessTokenDelete
    if (deletedAccessToken) {
      removeCookie('customerAccessToken')
      commit('setCustomerAccessToken', null)
      commit('setCustomer', null)
    }
    commit('setErrors', userErrors)
  },

  async fetchOrders ({ state, dispatch, commit, rootState }, payload) {
    try {
      const variables = { customerAccessToken: state.customerAccessToken.accessToken }
      const query = GET_CUSTOMER_ORDERS
      const response = await accountClient.post(null, { query, variables })
      const { customer, userErrors } = response.data.data
      if (customer) {
        commit('setOrders', transformOrders(customer.orders))
      }
      commit('setErrors', userErrors)
    } catch (error) {
      throw error
    }
  },

  async fetchDefaultAddress ({ state, dispatch, commit, rootState }, payload) {
    try {
      const variables = { customerAccessToken: state.customerAccessToken.accessToken }
      const query = GET_CUSTOMER_DEFAULT_ADDRESS
      const response = await accountClient.post(null, { query, variables })
      const { customer, userErrors } = response.data.data
      if (customer) {
        commit('setDefaultAddress', customer.defaultAddress)
      }
      commit('setErrors', userErrors)
    } catch (error) {
      throw error
    }
  },

  async fetchAddresses ({ state, dispatch, commit, rootState }, payload) {
    try {
      const variables = { customerAccessToken: state.customerAccessToken.accessToken }
      const query = GET_CUSTOMER_ADDRESSES
      const response = await accountClient.post(null, { query, variables })
      const { customer, userErrors } = response.data.data
      if (customer) {
        commit('setAddresses', transformEdges(customer.addresses))
      }
      commit('setErrors', userErrors)
    } catch (error) {
      throw error
    }
  },

  async createAddress ({ state, dispatch, commit, rootState }, { address }) {
    try {
      const variables = {
        customerAccessToken: state.customerAccessToken.accessToken,
        address
      }
      const query = CUSTOMER_ADDRESS_CREATE
      const response = await accountClient.post(null, { query, variables })
      const { data, errors } = response.data
      if (errors && errors.length) {
        throw new Error(JSON.stringify(errors))
      }
      const { customerAddress, customerUserErrors } = data.customerAddressCreate
      if (customerAddress) {
        commit('addAddress', customerAddress)
      }
      commit('setErrors', customerUserErrors)
    } catch (error) {
      throw error
    }
  },

  async updateAddress ({ state, dispatch, commit, rootState }, { address, id }) {
    try {
      const variables = {
        customerAccessToken: state.customerAccessToken.accessToken,
        address,
        id
      }
      const query = CUSTOMER_ADDRESS_UPDATE
      const response = await accountClient.post(null, { query, variables })
      const { data, errors } = response.data
      if (errors && errors.length) {
        throw new Error(JSON.stringify(errors))
      }
      const { customerAddress, customerUserErrors } = data.customerAddressUpdate
      if (customerAddress) {
        commit('setAddress', customerAddress)
      }
      commit('setErrors', customerUserErrors)
    } catch (error) {
      throw error
    }
  },

  async deleteAddress ({ state, dispatch, commit, rootState }, { id }) {
    try {
      const variables = {
        customerAccessToken: state.customerAccessToken.accessToken,
        id
      }
      const query = CUSTOMER_ADDRESS_DELETE
      const response = await accountClient.post(null, { query, variables })
      const { data, errors } = response.data
      if (errors && errors.length) {
        throw new Error(JSON.stringify(errors))
      }
      const { deletedCustomerAddressId, customerUserErrors } = data.customerAddressDelete
      if (deletedCustomerAddressId) {
        commit('removeAddress', deletedCustomerAddressId)
      }
      commit('setErrors', customerUserErrors)
    } catch (error) {
      throw error
    }
  },

  async register ({ state, commit, dispatch }, { firstName, lastName, email, password }) {
    try {
      const variables = { input: { firstName, lastName, email, password } }
      const query = CUSTOMER_CREATE
      const response = await accountClient.post(null, { query, variables })
      const { data, errors } = response.data
      if (errors && errors.length) {
        throw new Error(JSON.stringify(errors))
      }
      const { customer, customerUserErrors } = data.customerCreate
      commit('setErrors', customerUserErrors)
    } catch (error) {
      throw error
    }
  },

  // will need to adjust notifications:
  // https://community.shopify.com/c/Shopify-APIs-SDKs/Reset-Password-Token-in-Notification-Email/td-p/367455
  async recover ({ state, commit, dispatch }, { email }) {
    try {
      const variables = { input: { email } }
      const query = CUSTOMER_RECOVER
      const response = await accountClient.post(null, { query, variables })
      const { data, errors } = response.data
      if (errors && errors.length) {
        throw new Error(JSON.stringify(errors))
      }
      const { customerUserErrors } = data.customerRecover
      commit('setErrors', customerUserErrors)
    } catch (error) {
      throw error
    }
  },

  async reset ({ state, commit, dispatch }, { password, resetToken, customerId }) {
    try {
      const id = Buffer.from(`gid://shopify/Customer/${customerId}`).toString('base64')
      const variables = { id: id, input: { password, resetToken } }
      const query = CUSTOMER_RESET
      const response = await accountClient.post(null, { query, variables })
      const { data, errors } = response.data
      if (errors && errors.length) {
        throw new Error(JSON.stringify(errors))
      }
      const { customer, customerAccessToken, customerUserErrors } = data.customerReset
      // TODO: Login w/ multipass
      commit('setErrors', customerUserErrors)
    } catch (error) {
      throw error
    }
  },
}
