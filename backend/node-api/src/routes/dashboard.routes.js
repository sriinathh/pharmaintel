const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const rateLimit = require('express-rate-limit')
const { cache } = require('../middleware/cache.middleware')

const QueryLog = require('../models/QueryLog')
const Report = require('../models/Report')
const MedicineSearch = require('../models/MedicineSearch')
const Reminder = require('../models/Reminder')
const Pharmacy = require('../models/Pharmacy')
const Alert = require('../models/Alert')
const Insight = require('../models/Insight')
const aiService = require('../services/ai.service')

const limiter = rateLimit({ windowMs: 60*1000, max: 60 })

// helper: stats
router.get('/stats', auth, limiter, cache((req) => `stats:${req.user.id}`, 20), async (req, res) => {
  const userId = req.user.id
  const [queries, reports, medicines, reminders, pharmacies] = await Promise.all([
    QueryLog.countDocuments({ userId }),
    Report.countDocuments({ userId }),
    MedicineSearch.countDocuments({ userId }),
    Reminder.countDocuments({ userId }),
    Pharmacy.countDocuments({ userId })
  ])
  res.json({ queries, reports, medicines, reminders, pharmacies })
})

// trends: last 7 days for queries/reports/medicines
router.get('/trends', auth, limiter, cache((req) => `trends:${req.user.id}`, 30), async (req, res) => {
  const userId = req.user.id
  const now = new Date()
  const days = 7
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const matchUser = { userId }

  const dayBuckets = (Model, field) => Model.aggregate([
    { $match: { ...matchUser, createdAt: { $gte: new Date(base.getTime() - (days-1)*24*3600*1000) } } },
    { $project: { day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } } },
    { $group: { _id: '$day', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ])

  const [qAgg, rAgg, mAgg] = await Promise.all([
    dayBuckets(QueryLog),
    dayBuckets(Report),
    dayBuckets(MedicineSearch)
  ])

  // build arrays aligned to last N days
  const arrFor = (agg) => {
    const map = Object.fromEntries(agg.map(a => [a._id, a.count]))
    const out = []
    for (let i = days-1; i >= 0; i--) {
      const d = new Date(base.getTime() - i*24*3600*1000)
      const key = d.toISOString().slice(0,10)
      out.push(map[key] || 0)
    }
    return out
  }

  res.json({ queries: arrFor(qAgg), reports: arrFor(rAgg), medicines: arrFor(mAgg) })
})

// activity: recent mixed activities
router.get('/activity', auth, limiter, async (req, res) => {
  const userId = req.user.id
  const q = QueryLog.find({ userId }).sort({ createdAt: -1 }).limit(6).lean()
  const r = Report.find({ userId }).sort({ createdAt: -1 }).limit(6).lean()
  const m = MedicineSearch.find({ userId }).sort({ createdAt: -1 }).limit(6).lean()
  const rem = Reminder.find({ userId }).sort({ createdAt: -1 }).limit(6).lean()
  const [qa, ra, ma, rema] = await Promise.all([q, r, m, rem])
  const items = []
  qa.forEach(x => items.push({ id: x._id, type: 'query', text: x.queryText || 'Query', time: x.createdAt }))
  ra.forEach(x => items.push({ id: x._id, type: 'report', text: x.title || 'Report', time: x.createdAt }))
  ma.forEach(x => items.push({ id: x._id, type: 'search', text: x.medicineName || 'Medicine search', time: x.createdAt }))
  rema.forEach(x => items.push({ id: x._id, type: 'reminder', text: x.title || 'Reminder', time: x.createdAt }))
  // sort and trim
  items.sort((a,b)=> new Date(b.time)-new Date(a.time))
  res.json(items.slice(0,10).map(i => ({ ...i, time: i.time.toISOString().replace('T',' ').slice(0,16) })))
})

// alerts
router.get('/alerts', auth, limiter, async (req, res) => {
  const userId = req.user.id
  const alerts = await Alert.find({ userId }).sort({ createdAt: -1 }).limit(10).lean()
  res.json(alerts.map(a => ({ id: a._id, level: a.level, text: a.text })))
})

// insights
router.get('/insights', auth, limiter, async (req, res) => {
  const userId = req.user.id
  let insights = await Insight.find({ userId }).sort({ createdAt: -1 }).limit(10).lean()
  // if none, generate on demand (async)
  if (!insights.length) {
    insights = await aiService.generateInsightsForUser(userId)
  }
  res.json(insights.map(i => ({ id: i._id, title: i.title, description: i.description })))
})

module.exports = router
