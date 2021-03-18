// Expected request body:
//
//  { orderID: "the-order-id" }

const axios = require('axios')

exports.handler = async function (event, context, callback) {
  const { orderID } = JSON.parse(event.body)

  const endpoint = `https://${process.env.MYSHOPIFY_DOMAIN}/admin/api/2020-04/orders/${orderID}/transactions.json`

  try {
    const response = await axios.get(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_REST_TOKEN
      }
    })

    const body = JSON.stringify(response.data.transactions)
    return {
      statusCode: 200,
      body
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    }
  }
}