let client
function getRedis() {
  if (client) return client
  let createClient
  try {
    ({ createClient } = require('redis'))
  } catch (e) {
    console.warn('Redis package not installed; caching disabled')
    return null
  }
  const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
  client = createClient({ url })
  client.on('error', (err) => console.error('Redis', err))
  client.connect().catch(() => {})
  return client
}

module.exports = { getRedis }
