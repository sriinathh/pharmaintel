const Drug = require('../models/Drug')
const mongoose = require('mongoose')

// GET /api/drugs/search?q=term
async function searchDrugs(req, res) {
  try {
    const q = (req.query.q || '').trim()
    if (!q) {
      // return recent or popular drugs (limit)
      const list = await Drug.find().limit(30).sort({ updatedAt: -1 })
      return res.json(list)
    }

    // text search then fallback to regex
    const results = await Drug.find({ $text: { $search: q } }).limit(50)
    if (results && results.length) return res.json(results)

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, ''), 'i')
    const alt = await Drug.find({ $or: [{ genericName: regex }, { 'brandNames.name': regex }, { drugClass: regex }] }).limit(50)
    res.json(alt)
  } catch (err) {
    console.error('searchDrugs', err)
    res.status(500).json({ error: 'Drug search failed' })
  }
}

// GET /api/drugs/:id
async function getDrug(req, res) {
  try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' })
    const d = await Drug.findById(id)
    if (!d) return res.status(404).json({ error: 'Not found' })
    res.json(d)
  } catch (err) {
    console.error('getDrug', err)
    res.status(500).json({ error: 'Failed to fetch drug' })
  }
}

// POST /api/drugs/convert
// body: { query: 'Dolo 650' }
async function convertDrug(req, res) {
  try {
    const { query } = req.body
    if (!query) return res.status(400).json({ error: 'Missing query' })
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, ''), 'i')
    // find brand match first
    let drug = await Drug.findOne({ 'brandNames.name': regex })
    if (drug) return res.json({ type: 'brand->generic', generic: drug.genericName, brands: drug.brandNames })

    // try generic
    drug = await Drug.findOne({ genericName: regex })
    if (drug) return res.json({ type: 'generic->brands', generic: drug.genericName, brands: drug.brandNames })

    res.status(404).json({ error: 'No match' })
  } catch (err) {
    console.error('convertDrug', err)
    res.status(500).json({ error: 'Conversion failed' })
  }
}

// POST /api/drugs/substitutes
// body: { drugId }
async function substitutes(req, res) {
  try {
    const { drugId } = req.body
    if (!drugId || !mongoose.Types.ObjectId.isValid(drugId)) return res.status(400).json({ error: 'Invalid drugId' })
    const base = await Drug.findById(drugId)
    if (!base) return res.status(404).json({ error: 'Not found' })

    // same generic name (same salt) - other brands
    const sameGeneric = await Drug.find({ genericName: base.genericName, _id: { $ne: base._id } })

    // strength equivalents: match by generic and suggest other strengths within same document
    const strengthEquiv = base.strengths || []

    // same class alternatives
    const sameClass = await Drug.find({ drugClass: base.drugClass, _id: { $ne: base._id } }).limit(10)

    res.json({ sameGeneric, strengthEquiv, sameClass, note: 'Therapeutic substitution – pharmacist approval required' })
  } catch (err) {
    console.error('substitutes', err)
    res.status(500).json({ error: 'Substitute lookup failed' })
  }
}

// POST /api/drugs/interactions
// body: { drugs: ['Paracetamol', 'Warfarin'] }
async function interactions(req, res) {
  try {
    const { drugs } = req.body
    if (!Array.isArray(drugs) || drugs.length < 2) return res.status(400).json({ error: 'Provide at least two drugs' })

    // Normalize: look up by name to get genericName and classes
    const found = await Drug.find({ $or: [{ genericName: { $in: drugs } }, { 'brandNames.name': { $in: drugs } }] })
    const names = found.map(f => f.genericName || f._id.toString())

    // Simple rule set (extendable)
    const rules = []
    // warfarin + aspirin / ibuprofen -> severe (bleeding risk)
    const lower = names.map(n => n.toLowerCase())
    if (lower.includes('warfarin') && (lower.includes('aspirin') || lower.includes('ibuprofen') || lower.includes('naproxen'))) {
      rules.push({ severity: 'Severe', interaction: 'Increased bleeding risk due to combined anticoagulant and antiplatelet/NSAID effect', advice: 'Advise patient about bleeding risk; recommend monitoring INR and consult prescriber. Refer to physician for therapy review.' })
    }

    // insulin + beta-blocker -> moderate (masking hypoglycaemia)
    if (lower.includes('insulin') && lower.some(n => n.includes('propranolol') || n.includes('metoprolol') || n.includes('atenolol'))) {
      rules.push({ severity: 'Moderate', interaction: 'Beta-blockers may mask hypoglycaemia symptoms in patients on insulin', advice: 'Counsel patient on hypoglycaemia signs; consider additional monitoring and dose adjustment.' })
    }

    // defaults: no known interactions found
    if (rules.length === 0) {
      return res.json({ interactions: [], message: 'No clinically significant interactions found using local rule set. Use full interaction database for production.' })
    }

    res.json({ interactions: rules })
  } catch (err) {
    console.error('interactions', err)
    res.status(500).json({ error: 'Interaction check failed' })
  }
}

module.exports = { searchDrugs, getDrug, convertDrug, substitutes, interactions }
