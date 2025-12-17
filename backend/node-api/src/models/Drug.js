const mongoose = require('mongoose')

const BrandSchema = new mongoose.Schema({
  name: String,
  manufacturer: String,
  price: Number,
  availability: { type: Boolean, default: true }
}, { _id: false })

const DrugSchema = new mongoose.Schema({
  genericName: { type: String, required: true, index: true },
  brandNames: { type: [BrandSchema], default: [] },
  drugClass: String,
  indications: [String],
  dosageForms: [String],
  strengths: [String],
  storage: String,
  sideEffects: [String],
  pregnancy: String,
  schedule: String, // OTC / Schedule H / Schedule X / NDPS
  highRisk: { type: Boolean, default: false },
  keywords: { type: [String], index: true }
}, { timestamps: true })

// Text index for search convenience
DrugSchema.index({ genericName: 'text', 'brandNames.name': 'text', drugClass: 'text', keywords: 'text' })

module.exports = mongoose.model('Drug', DrugSchema)
