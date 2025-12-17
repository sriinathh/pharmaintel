const mongoose = require('mongoose')

const PharmacySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String },
  location: { type: { type: String }, coordinates: [Number] }
}, { timestamps: true })

PharmacySchema.index({ 'location.coordinates': '2dsphere' })

module.exports = mongoose.model('Pharmacy', PharmacySchema)
