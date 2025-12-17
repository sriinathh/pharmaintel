const morgan = require('morgan')

function loggerMiddleware(app) {
  app.use(morgan('dev'))
}

// Expose middleware as the default export (callable) and also
// provide convenience logging methods used elsewhere (info/error).
function logger(app) {
  return loggerMiddleware(app)
}

logger.info = (...args) => console.log('[INFO]', ...args)
logger.error = (...args) => console.error('[ERROR]', ...args)

module.exports = logger
