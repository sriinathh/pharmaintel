const mongoose = require('mongoose')

const ReminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String },
  dueAt: { type: Date },
  completed: { type: Boolean, default: false }
}, { timestamps: true })

ReminderSchema.index({ userId: 1, dueAt: 1 })

module.exports = mongoose.model('Reminder', ReminderSchema)
