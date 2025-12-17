const axios = require('axios')
const env = require('../config/env')

async function queryRemoteAI(payload) {
  const url = `${env.AI_SERVICE_URL}/api/ai/query`
  const resp = await axios.post(url, payload, { headers: { 'x-api-key': env.AI_API_KEY } })
  return resp.data
}

module.exports = { queryRemoteAI }
