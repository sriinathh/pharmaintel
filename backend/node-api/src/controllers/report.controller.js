const Report = require('../models/Report')
const aiService = require('../services/aiService')
const mongoose = require('mongoose')

async function listReports(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })
    const reports = await Report.find({ userId }).sort({ createdAt: -1 }).limit(200)
    res.json(reports)
  } catch (err) {
    res.status(500).json({ error: 'Failed to list reports' })
  }
}

async function createReport(req, res) {
  try {
    const data = req.body
    const r = await Report.create({ ...data, userId: req.user?.id })
    res.status(201).json(r)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create report' })
  }
}

// Generate report using AI and persist
async function generateReport(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { topic, disease, region, timeRange } = req.body
    if (!topic || !disease) return res.status(400).json({ error: 'Missing topic or disease' })

    const title = `${topic} — ${disease}`

    // create placeholder record with status pending
    const placeholder = await Report.create({ userId, title, topic, disease, region, timeRange, status: 'generated', content: 'Generating…' })

    try {
      const content = await aiService.generateReportContent({ topic, disease, region, timeRange })
      placeholder.content = content
      placeholder.status = 'generated'
      await placeholder.save()
      return res.json(placeholder)
    } catch (aiErr) {
      placeholder.content = ''
      placeholder.status = 'failed'
      await placeholder.save()
      return res.status(502).json({ error: 'AI generation failed' })
    }
  } catch (err) {
    console.error('generateReport error', err)
    res.status(500).json({ error: 'Failed to generate report' })
  }
}

async function getReport(req, res) {
  try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' })
    const r = await Report.findById(id)
    if (!r) return res.status(404).json({ error: 'Not found' })
    if (String(r.userId) !== String(req.user?.id)) return res.status(403).json({ error: 'Forbidden' })
    res.json(r)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch report' })
  }
}

async function deleteReport(req, res) {
  try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' })
    const r = await Report.findById(id)
    if (!r) return res.status(404).json({ error: 'Not found' })
    if (String(r.userId) !== String(req.user?.id)) return res.status(403).json({ error: 'Forbidden' })
    await r.remove()
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete report' })
  }
}

module.exports = { listReports, createReport, getReport, generateReport, deleteReport }
