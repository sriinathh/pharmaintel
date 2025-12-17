const mongoose = require('mongoose')

const MedicineSearchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  medicineName: { type: String, index: true },
  interactionFlag: { type: Boolean, default: false }
}, { timestamps: true })

MedicineSearchSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('MedicineSearch', MedicineSearchSchema)
