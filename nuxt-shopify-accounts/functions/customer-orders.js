// Expected request body:
//
//  { customerID: "the-customer's-base64-encoded-id" }

const axios = require("axios")

exports.handler = async function(event, context, callback) {
  const { customerID } = JSON.parse(event.body)

  const id = Buffer.from(customerID, "base64")
    .toString("binary")
    .split("gid://shopify/Customer/")
    .pop()

  const endpoint = `https://${process.env.MYSHOPIFY_DOMAIN}/admin/api/2020-04/customers/${id}/orders.json`

  try {
    const response = await axios.get(endpoint, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_REST_TOKEN
      }
    })

    const body = JSON.stringify(response.data.orders)
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
