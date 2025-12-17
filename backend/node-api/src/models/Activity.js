const mongoose = require('mongoose')

const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['report_generated','chat_query','login','profile_update'], required: true },
  description: { type: String },
  metadata: { type: Object, default: {} }
}, { timestamps: true })

module.exports = mongoose.model('Activity', ActivitySchema)
