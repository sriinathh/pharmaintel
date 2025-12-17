const mongoose = require('mongoose')

const QueryLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  queryText: { type: String },
  category: { type: String, index: true },
  resultCount: { type: Number, default: 0 }
}, { timestamps: true })

QueryLogSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('QueryLog', QueryLogSchema)
