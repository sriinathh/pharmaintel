const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  topic: { type: String },
  disease: { type: String },
  region: { type: String },
  timeRange: { type: String },
  content: { type: String },
  status: { type: String, enum: ['generated', 'failed'], default: 'generated' },
  category: { type: String },
  language: { type: String, default: 'en' },
  meta: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true })

ReportSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('Report', ReportSchema)
