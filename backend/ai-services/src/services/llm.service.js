const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()

function extractTextFromResponse(resp) {
  if (!resp) return ''
  if (typeof resp === 'string') return resp
  const d = resp.data || resp
  return d?.choices?.[0]?.text || d?.result || d?.output?.[0]?.content || d?.generations?.[0]?.text || d?.outputs?.[0]?.content || JSON.stringify(d)
}

async function callLLM({ prompt }) {
  const mandatory = 'This information is for educational purposes only and is not medical advice. Please consult a qualified healthcare professional.'

  // Prefer explicit provider config, then fall back to Mistral variables
  const apiKey = process.env.AI_API_KEY || process.env.MISTRAL_API_KEY
  const providerUrl = process.env.AI_PROVIDER_URL || process.env.MISTRAL_API_URL || (process.env.MISTRAL_API_KEY ? `https://api.mistral.ai/v1/models/${process.env.MISTRAL_MODEL || 'mistral-7b-instruct'}/generate` : null)

  if (!apiKey || !providerUrl) {
    const text = `MOCKED LLM RESPONSE:\n${prompt}`
    const finalText = text.includes(mandatory) ? text : `${text}\n\n${mandatory}`
    return { text: finalText, model: 'mock' }
  }

  try {
    const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
    let resp
    // Try a few payload shapes so different providers can work without further edits
    const attempts = [ { prompt }, { input: prompt }, { text: prompt } ]
    for (const payload of attempts) {
      try {
        resp = await axios.post(providerUrl, payload, { headers, timeout: 20000 })
        if (resp) break
      } catch (e) {
        // try next shape
      }
    }

    const text = extractTextFromResponse(resp)
    const finalText = text.includes(mandatory) ? text : `${text}\n\n${mandatory}`
    return { text: finalText, model: 'provider' }
  } catch (err) {
    const text = `MOCKED LLM RESPONSE (provider error):\n${prompt}`
    const finalText = text.includes(mandatory) ? text : `${text}\n\n${mandatory}`
    return { text: finalText, model: 'mock' }
  }
}

module.exports = { callLLM }
