const axios = require('axios')
const env = require('../config/env')

async function queryAI(req, res) {
  try {
    const { message, language = 'en', model = null } = req.body
    if (!message) return res.status(400).json({ error: 'Missing message' })
    // Basic safety checks: block disallowed personal/prescription/diagnosis requests
    const msgLower = message.toLowerCase()
    const disallowedPatterns = [
      /diagnos/i,
      /prescrib/i,
      /what should i take/i,
      /should i take/i,
      /emergency|911|suicide|self harm|poison/i,
      /give me a dose/i
    ]
    if (disallowedPatterns.some((re) => re.test(msgLower))) {
      const reply = {
        text: 'I cannot provide diagnoses, prescriptions, or patient-specific recommendations. Please consult a qualified healthcare professional for personalized advice.',
        model: 'safety',
        disclaimer: 'This information is for educational purposes only and is not medical advice. Please consult a qualified healthcare professional.'
      }
      return res.status(400).json(reply)
    }

    // If explicit model= 'mistral' requested or a local Mistral key is present, call local llm implementation
    const mandatory = 'This information is for educational purposes only and is not medical advice. Please consult a qualified healthcare professional.'

    if (model === 'mistral' || process.env.MISTRAL_API_KEY) {
      try {
        // Reuse the ai-services prompt and LLM helper if available in repo
        const pharmaPrompt = require('../../../ai-services/src/prompts/pharma.chat.prompt')
        const { callLLM } = require('../../../ai-services/src/services/llm.service')
        const prompt = pharmaPrompt({ message, language })
        const out = await callLLM({ prompt })
        const text = out.text || ''
        const finalText = text.includes(mandatory) ? text : `${text}\n\n${mandatory}`
        return res.json({ text: finalText, model: out.model || 'provider', disclaimer: mandatory })
      } catch (e) {
        console.error('Local LLM error', e?.message || e)
        return res.status(502).json({ error: 'Local LLM unavailable' })
      }
    }

    // Fallback: proxy to configured AI service URL
    const resp = await axios.post(`${env.AI_SERVICE_URL}/api/ai/query`, { message, language, model }, { headers: { 'x-api-key': env.AI_API_KEY } })
    // Ensure structured response
    const out = resp.data || { text: '(no response)', model: 'mock' }
    if (!out.text) out.text = ''
    if (!out.text.includes(mandatory)) out.text = `${out.text}\n\n${mandatory}`
    out.disclaimer = mandatory
    res.json(out)
  } catch (err) {
    console.error('AI proxy error', err?.message || err)
    res.status(502).json({ error: 'AI service unavailable' })
  }
}

module.exports = { queryAI }
