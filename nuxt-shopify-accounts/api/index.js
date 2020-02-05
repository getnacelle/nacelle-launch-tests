import express from 'express'
import axios from 'axios'
import Multipassify from 'multipassify';

import {
  CUSTOMER_ACCESS_TOKEN_CREATE,
  GET_CUSTOMER
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

const getCustomerData = async (customerAccessToken) => {
  const variables = { customerAccessToken }
  const query = GET_CUSTOMER
  return await accountClient.post(null, { query, variables })
}

const multipassify = new Multipassify(process.env.SHOPIFY_MULTIPASS_SECRET);

// Create express router
const router = express.Router()

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
const app = express()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

// Add POST - /api/login
router.post('/login', async (req, res) => {
  // TODO: figure out remote ip

  const variables = { input: { email: req.body.email, password: req.body.password } }
  const query = CUSTOMER_ACCESS_TOKEN_CREATE
  const response = await accountClient.post(null, { query, variables })
  const { customerAccessToken, userErrors } = response.data.data.customerAccessTokenCreate

  if (customerAccessToken) {
    // get customer data
    const response = await getCustomerData(customerAccessToken.accessToken)
    const { customer } = response.data.data
    if (customer) {
      // multipass login
      const customerData = {
        ...customer,
        // remote_ip: req.ip,
        return_to: `https://${process.env.HOST_DOMAIN}/account`
      }
      const multipassUrl = multipassify.generateUrl(customerData, process.env.SHOPIFY_URL);
      // set session
      req.session.customerAccessToken = customerAccessToken
      return res.json({ customerAccessToken, multipassUrl, userErrors })
    }
  }
  res.status(401).json({ message: 'Bad credentials' })
})

// Add POST - /api/logout
router.post('/logout', (req, res) => {
  delete req.session.customerAccessToken
  res.json({ ok: true })
})

// Export the server middleware
export default {
  path: '/api',
  handler: router
}