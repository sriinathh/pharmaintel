const QueryLog = require('../models/QueryLog')
const Report = require('../models/Report')
const MedicineSearch = require('../models/MedicineSearch')
const Reminder = require('../models/Reminder')
const Insight = require('../models/Insight')
const audit = require('../utils/audit.logger')

async function generateInsightsForUser(userId) {
  // 1. Frequent interaction categories
  const categories = await QueryLog.aggregate([
    { $match: { userId: userId } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ])

  // 2. Medicine risk patterns (count searches with interactionFlag)
  const risky = await MedicineSearch.aggregate([
    { $match: { userId: userId, interactionFlag: true } },
    { $group: { _id: '$medicineName', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ])

  // 3. Adherence patterns from reminders
  const totalReminders = await Reminder.countDocuments({ userId })
  const completedReminders = await Reminder.countDocuments({ userId, completed: true })
  const adherence = totalReminders === 0 ? 0 : Math.round((completedReminders / totalReminders) * 100)

  const insights = []
  if (categories.length) {
    insights.push({ title: 'Frequent interaction categories', description: `You mainly search in: ${categories.map(c=>c._id).join(', ')}`, source: 'behavior' })
  }
  if (risky.length) {
    insights.push({ title: 'Medicine risk patterns', description: `Possible risky searches: ${risky.map(r=>r._id).join(', ')}`, source: 'behavior' })
  }
  insights.push({ title: 'Reminder adherence', description: `Adherence rate: ${adherence}%`, source: 'behavior' })

  // Store insights and write audit
  const saved = []
  for (const ins of insights) {
    const doc = new Insight({ userId, title: ins.title, description: ins.description, source: ins.source })
    await doc.save()
    saved.push(doc)
    audit.log({ userId, action: 'insight.generated', insightId: doc._id, meta: ins })
  }

  return saved
}

module.exports = { generateInsightsForUser }
