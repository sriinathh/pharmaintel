const mongoose = require('mongoose')

const InsightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String },
  description: { type: String },
  source: { type: String }
}, { timestamps: true })

InsightSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('Insight', InsightSchema)
