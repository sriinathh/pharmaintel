const { getRedis } = require('../config/redis')

function cache(keyGenerator, ttl = 30) {
  return async (req, res, next) => {
    try {
      const redis = getRedis()
      if (!redis) return next()
      const key = typeof keyGenerator === 'function' ? keyGenerator(req) : keyGenerator
      const data = await redis.get(key)
      if (data) return res.json(JSON.parse(data))
      // override res.json to cache
      const originalJson = res.json.bind(res)
      res.json = async (body) => {
        try { await redis.setEx(key, ttl, JSON.stringify(body)) } catch (e) { console.error('redis set', e) }
        return originalJson(body)
      }
      next()
    } catch (err) { next() }
  }
}

module.exports = { cache }
