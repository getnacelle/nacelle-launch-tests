import Multipassify from 'multipassify';

/**
 * Use the multipassify package to generate a Multipass login URL
 * @param {Object} req  - HTTP request object (see https://vercel.com/docs/runtimes#official-runtimes/node-js/node-js-request-and-response-objects/node-js-helpers)
 * @param {Object} req.body - HTTP request body
 * @param {Object} req.body.customerData - customer data object
 * @param {Object} req.body.customerData.email - the customer's email address
 * @param {Object} req.body.customerData.return_to - the URL that the customer should be directed to after login
 * @param {Object} res - HTTP response object (see https://vercel.com/docs/runtimes#official-runtimes/node-js/node-js-request-and-response-objects/node-js-helpers)
 */
export default function (req, res) {
  try {
    const { customerData } = JSON.parse(req.body);
    const { email, created_at, return_to } = customerData;
    const multipassify = new Multipassify(process.env.SHOPIFY_MULTIPASS_SECRET);
    const url = multipassify.generateUrl(
      { email, created_at, return_to },
      process.env.MYSHOPIFY_DOMAIN
    );
    console.log(url);
    res.status(200).send({ url });
  } catch (err) {
    res.status(500).send(`Could not generate Multipass URL: ${err.message}`);
  }
}
