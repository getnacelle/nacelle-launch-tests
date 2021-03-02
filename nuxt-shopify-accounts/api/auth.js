const app = require('../acccounts/app/app')
const serverless = require('serverless-http')

module.exports = app
module.exports.handler = serverless(app)