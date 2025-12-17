const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  AI_SERVICE_URL: process.env.AI_SERVICE_URL,
  AI_API_KEY: process.env.AI_API_KEY
}
