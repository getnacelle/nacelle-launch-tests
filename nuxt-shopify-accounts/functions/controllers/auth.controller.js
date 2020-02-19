require('../utils/passport')
const axios = require('axios')
const Multipassify = require('multipassify')
const {
  COOKIE_SECURE,
  SHOPIFY_MULTIPASS_SECRET,
  MYSHOPIFY_DOMAIN,
  SHOPIFY_GRAPHQL_TOKEN
 } = require('../utils/secrets')

 const CUSTOMER_ACCESS_TOKEN_CREATE_WITH_MULTIPASS = `mutation customerAccessTokenCreateWithMultipass($multipassToken: String!) {
  customerAccessTokenCreateWithMultipass(multipassToken: $multipassToken) {
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}`

const multipassify = new Multipassify(SHOPIFY_MULTIPASS_SECRET);

const accountClient = axios.create({
  baseURL: `https://${MYSHOPIFY_DOMAIN}/api/2020-04/graphql`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_GRAPHQL_TOKEN
  }
})

const multipassLogin = (customer, return_to) => {
  const customerData = {
    ...customer,
    return_to
  }
  const multipassToken = multipassify.encode(customerData)

  return {
    multipassUrl: `https://${MYSHOPIFY_DOMAIN}/account/login/multipass/${multipassToken}`,
    multipassToken
  }
}

const exchangeMultipassForAccessToken = async (multipassToken) => {
  try {
    const variables = { multipassToken }
    const query = CUSTOMER_ACCESS_TOKEN_CREATE_WITH_MULTIPASS
    const response = await accountClient.post(null, { query, variables })
    const { data, errors } = response.data
    if (errors && errors.length) {
      throw new Error(JSON.stringify(errors))
    }
    const { customerAccessToken, customerUserErrors } = data.customerAccessTokenCreateWithMultipass
    if (customerAccessToken) {
      return customerAccessToken
    } else {
      throw new Error(customerUserErrors)
    }
  } catch (error) {
    throw error
  }
}

const handleCallback = async (req, res) => {
  try {
    const { state } = req.query
    if (state === undefined) {
      throw new Error('must set returnTo= query parameter on orignial request')
    }
    
    const { returnTo } = JSON.parse(Buffer.from(state, 'base64').toString())
    if (typeof returnTo === 'string') {
      const {
        multipassUrl,
        multipassToken
      } = multipassLogin(req.user, returnTo)
      const { accessToken, expiresAt } = await exchangeMultipassForAccessToken(multipassToken)
      const payload = {
        ...req.user,
        accessToken,
        expiresAt
      }
      console.log('payload', payload)
      res
        .cookie('ncl', JSON.stringify(payload), { secure: COOKIE_SECURE })
        .redirect(multipassUrl);
    } else {
      throw new Error('Invalid returnTo url')
    }
  } catch(error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

// Needed for Dynamic Routing
const preservedState = (req) => {
  const { returnTo } = req.query
  return returnTo
    ? Buffer.from(JSON.stringify({ returnTo })).toString('base64') : undefined
}

const getStatus = async (req, res) => {
  try {
    res.json(req.user)
  } catch(error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

module.exports = {
  handleCallback,
  preservedState,
  getStatus
}