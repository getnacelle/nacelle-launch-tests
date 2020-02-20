const app = require('./app/app')
const serverless = require('serverless-http')

const handler = serverless(app);
module.exports.handler = async (event, context, callback) => {
  return await handler(event, context);
};