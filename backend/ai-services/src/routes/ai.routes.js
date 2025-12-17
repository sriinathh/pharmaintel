const express = require('express')
const router = express.Router()
const { callLLM } = require('../services/llm.service')
const pharmaPrompt = require('../prompts/pharma.chat.prompt')

router.post('/query', async (req, res) => {
  const { message, language = 'en' } = req.body
  if (!message) return res.status(400).json({ error: 'Missing message' })
  try {
    // Basic safety checks: block disallowed personal/prescription/diagnosis requests
    const ml = message.toLowerCase()
    const disallowed = [/diagnos/i, /prescrib/i, /what should i take/i, /should i take/i, /emergency|911|suicide|self harm|poison/i, /give me a dose/i]
    if (disallowed.some(r => r.test(ml))) {
      return res.status(400).json({ text: 'I cannot provide diagnoses, prescriptions, or patient-specific recommendations. Please consult a qualified healthcare professional for personalized advice.', model: 'safety', disclaimer: 'This information is for educational purposes only and is not medical advice. Please consult a qualified healthcare professional.' })
    }
    const prompt = pharmaPrompt({ message, language })
    const out = await callLLM({ prompt })
    // Append mandatory disclaimer and return structured shape expected by frontend
    const mandatory = 'This information is for educational purposes only and is not medical advice. Please consult a qualified healthcare professional.'
    const text = (out.text || '')
    const finalText = text.includes(mandatory) ? text : `${text}\n\n${mandatory}`
    res.json({ text: finalText, model: out.model || 'provider', disclaimer: mandatory })
  } catch (err) {
    res.status(500).json({ error: 'LLM error' })
  }
})

module.exports = router
