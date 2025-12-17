const mongoose = require('mongoose')
const logger = require('../utils/logger')

async function connectDB(uri) {
  try {
    await mongoose.connect(uri, { autoIndex: true })
    logger.info('MongoDB connected')
  } catch (err) {
    logger.error('MongoDB connection error:', err)
    // In development with DEV_MEDICAL_MOCK enabled, do not exit the process
    if (process.env.DEV_MEDICAL_MOCK === '1') {
      logger.warn('Continuing without MongoDB because DEV_MEDICAL_MOCK=1')
      return
    }
    // Re-throw so callers can decide whether to exit
    throw err
  }
}

module.exports = connectDB
