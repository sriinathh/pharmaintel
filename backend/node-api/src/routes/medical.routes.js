const express = require('express')
const router = express.Router()
const rateLimitMap = new Map()
const env = require('../config/env')

// System prompt for the medical assistant
const SYSTEM_PROMPT = `You are InterPharma Medical Assistant, a pharmacy-focused medical AI. You provide educational and pharmaceutical information only. You do NOT diagnose diseases. You do NOT prescribe treatments or dosages. You follow Indian drug regulations (OTC, Schedule H, Schedule X). You prioritize patient safety and pharmacy ethics. Respond using sections: Overview, Key Points, Safety Notes, Pharmacist Counseling Tips, When to Refer to a Doctor.`

// Health/info endpoint for quick checks (GET /api/medical)
router.get('/', (req, res) => {
  return res.json({ ok: true, service: 'medical-chat', env: process.env.NODE_ENV || 'development' })
})

function validateInput(req, res, next) {
  const { message, mode } = req.body
  if (!message || typeof message !== 'string' || message.trim().length < 2) return res.status(400).json({ error: 'Invalid message' })
  const modes = ['Student','Pharmacist','Patient-Friendly']
  if (mode && !modes.includes(mode)) return res.status(400).json({ error: 'Invalid mode' })
  next()
}

// Simple in-memory rate limiter per IP: max 30 requests per minute
function rateLimiter(req, res, next) {
  try {
    const ip = req.ip || req.connection.remoteAddress || 'local'
    const now = Date.now()
    const entry = rateLimitMap.get(ip) || { count: 0, ts: now }
    if (now - entry.ts > 60_000) { entry.count = 0; entry.ts = now }
    entry.count++
    rateLimitMap.set(ip, entry)
    if (entry.count > 30) return res.status(429).json({ error: 'Rate limit exceeded' })
    next()
  } catch (e) {
    next()
  }
}

async function callLLMService(message, mode) {
  // Development mock: if DEV_MEDICAL_MOCK=1 return a canned structured response
  if (process.env.DEV_MEDICAL_MOCK === '1') {
    const mock = {
      overview: `Sample response (mock): ${message}`,
      keyPoints: `This is a mock key points summary for mode ${mode}`,
      safety: `Mock safety notes: always consult a clinician for diagnosis or dosing.`,
      counseling: `Mock counseling tips: explain administration, storage, and when to seek help.`,
      refer: `Refer for severe or life-threatening symptoms.`
    }
    return JSON.stringify(mock)
  }
  // Use centralized ai-services helper (supports Mistral or configured provider)
  try {
    // Prefer direct Mistral HTTP API when API key is available
    if (process.env.MISTRAL_API_KEY) {
      try {
        const axios = require('axios')
        // Use recommended chat completions endpoint and newer default model
        const model = process.env.MISTRAL_MODEL || 'mistral-large-latest'
        const providerUrl = process.env.MISTRAL_API_URL || `https://api.mistral.ai/v1/chat/completions`
        const instruct = `Mode: ${mode || 'Student'}\nRespond ONLY in JSON with keys: overview, keyPoints, safetyNotes, counselingTips, referToDoctor (string or empty). Ensure values are plain strings or arrays where appropriate.`
        const systemMessage = `${SYSTEM_PROMPT}\n\n${instruct}`
        const messages = [
          { role: 'system', content: systemMessage },
          { role: 'user', content: message }
        ]

        const requestBody = { model, messages }
        const headers = { Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`, 'Content-Type': 'application/json' }

        // Safe debug logs (do not log the API key)
        try { console.info('Mistral request:', { model, messages: messages.map(m => ({ role: m.role, content: m.content.length > 120 ? m.content.slice(0,120) + '…' : m.content })) }) } catch(e){}

        let resp
        try {
          resp = await axios.post(providerUrl, requestBody, { headers, timeout: 30000 })
        } catch (err) {
          // Log details for debugging
          console.error('Mistral API request error:', err && err.message)
          if (err && err.response && err.response.status) console.error('Mistral status:', err.response.status)
          if (err && err.response && err.response.data) console.error('Mistral error body:', JSON.stringify(err.response.data))
          throw err
        }

        console.info('Mistral response status:', resp.status)
        try { console.debug('Mistral response data:', JSON.stringify(resp.data)) } catch (e) {}

        const d = resp?.data || {}
        // Chat completions return choices[0].message.content
        let text = ''
        if (Array.isArray(d.choices) && d.choices.length > 0) {
          text = d.choices[0]?.message?.content || d.choices[0]?.message || d.choices[0]?.text || ''
        }
        // fallback shapes
        if (!text) text = d?.result || d?.output?.[0]?.content || d?.generations?.[0]?.text || d?.outputs?.[0]?.content || d?.text || (typeof d === 'string' ? d : JSON.stringify(d))
        return text || ''
      } catch (e) {
        console.error('Direct Mistral call failed', e && e.message)
        if (e && e.stack) console.error(e.stack)
        // fall through to helper
      }
    }

    // Fallback: use centralized ai-services helper
    const { callLLM } = require('../../../ai-services/src/services/llm.service')
    const instruct = `Mode: ${mode || 'Student'}\nRespond ONLY in JSON with keys: overview, keyPoints, safetyNotes, counselingTips, referToDoctor (string or empty). Ensure values are plain strings or arrays where appropriate.`
    const prompt = `${SYSTEM_PROMPT}\n\n${instruct}\n\nUser: ${message}`
    const out = await callLLM({ prompt })
    // callLLM returns { text, model }
    return out.text || ''
  } catch (e) {
    console.error('callLLMService error', e)
    if (e && e.stack) console.error(e.stack)
    throw new Error('No AI provider configured')
  }
}

router.post('/chat', validateInput, rateLimiter, async (req, res) => {
  try {
    const { message, mode = 'Student' } = req.body
    console.info('Incoming /api/medical/chat request:', { ip: req.ip, mode, message: message.length > 200 ? message.slice(0,200) + '…' : message })
    let text = ''
    try {
      text = await callLLMService(message, mode)
    } catch (e) {
      console.error('LLM call failed in handler:', e)
      if (e && e.stack) console.error(e.stack)
      // graceful fallback structured response to avoid 500 for users
      const fallback = {
        overview: 'The AI service is temporarily unavailable. Please try again later.',
        keyPoints: 'The medical assistant could not reach the LLM provider.',
        safety: 'Always follow local regulations and consult a qualified healthcare professional when in doubt.',
        counseling: 'If this is urgent, advise seeking direct clinical support. Retry later for detailed guidance.',
        refer: 'Refer immediately for severe or life-threatening symptoms.'
      }
      return res.json({ structured: true, ...fallback })
    }

    // Try to parse JSON from the model output
    let parsed = null
    try {
      // Some models may include surrounding text; attempt to locate JSON block
      const jsonStart = text.indexOf('{')
      const jsonText = jsonStart >= 0 ? text.slice(jsonStart) : text
      parsed = JSON.parse(jsonText)
    } catch (e) {
      // parsing failed — keep raw text
    }

    if (parsed) {
      // normalize keys to expected frontend fields
      const normalized = {
        overview: parsed.overview || parsed.Overview || parsed.summary || '',
        keyPoints: parsed.keyPoints || parsed.key_points || parsed.keyPoints || parsed.keypoints || parsed.key_points || parsed.keyPoints || '',
        safety: parsed.safetyNotes || parsed.safety || parsed.safety_notes || '',
        counseling: parsed.counselingTips || parsed.counseling || parsed.counseling_tips || '',
        refer: parsed.referToDoctor || parsed.refer || parsed.when_to_refer || ''
      }
      return res.json({ structured: true, ...normalized })
    }

    // If parsing failed, wrap the raw model text into the structured `overview` field
    console.info('Model returned non-JSON or unparsable text; returning raw text in overview')
    return res.json({ structured: true, overview: text || '', keyPoints: '', safety: '', counseling: '', refer: '' })
  } catch (err) {
    console.error('medical chat error', err)
    if (err && err.stack) console.error(err.stack)
    return res.status(500).json({ error: 'AI service error', detail: err.message })
  }
})

module.exports = router
