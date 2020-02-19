require('../utils/passport')
const Multipassify = require('multipassify')
const {
  COOKIE_SECURE,
  SHOPIFY_MULTIPASS_SECRET,
  MYSHOPIFY_DOMAIN
 } = require('../utils/secrets')

const multipassify = new Multipassify(SHOPIFY_MULTIPASS_SECRET);

const multipassLogin = (customer, return_to) => {
  const customerData = {
    ...customer,
    return_to
  }
  return multipassify.generateUrl(customerData, MYSHOPIFY_DOMAIN)
}

const handleCallback = (req, res) => {
  try {
    const { state } = req.query
    if (state === undefined) {
      throw new Error('must set returnTo= query parameter on orignial request')
    }
    
    const { returnTo } = JSON.parse(Buffer.from(state, 'base64').toString())
    if (typeof returnTo === 'string') {
      const multipassUrl = multipassLogin(req.user, returnTo)
      res
        .cookie('ncl', JSON.stringify(req.user), { secure: COOKIE_SECURE })
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