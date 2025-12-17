const axios = require('axios')
const env = require('../config/env')

// MASTER PROMPT template
const MASTER_PROMPT = `You are INTERPHARMA AI, a clinical and pharmacy-focused medical intelligence assistant.

Generate a professional pharmaceutical intelligence report based on the following inputs:

Drug / Topic: {{topic}}
Disease / Use case: {{disease}}
Region (if any): {{region}}
Time Range: {{timeRange}}

Report must be structured in clean sections:

1. Executive Summary
- 5–7 concise bullet points
- Focus on clinical relevance and market impact

2. Drug Overview
- Mechanism of Action
- Indications
- Dosage forms

3. Clinical Insights
- Efficacy highlights
- Safety profile
- Known side effects
- Contraindications

4. Market & Regulatory Insights
- Approval status
- Market presence
- Key competitors (if applicable)

5. Research & Future Scope
- Ongoing trials
- Innovations
- Limitations

6. Conclusion
- Clear pharma-grade summary

Formatting rules:
- Use headings
- Use bullet points where needed
- Do NOT hallucinate specific trial numbers
- Keep it suitable for pharmacists, students, and analysts
- Language must be professional and medical

Return the report as plain text (not markdown).
`

function buildPrompt({ topic, disease, region, timeRange }) {
  return MASTER_PROMPT.replace('{{topic}}', topic || '')
    .replace('{{disease}}', disease || '')
    .replace('{{region}}', region || 'global')
    .replace('{{timeRange}}', timeRange || '')
}

async function callProvider(prompt) {
  // Prefer local ai-services llm helper if present
  try {
    const llm = require('../../../ai-services/src/services/llm.service')
    if (llm && typeof llm.callLLM === 'function') {
      const out = await llm.callLLM({ prompt })
      return out.text || out || ''
    }
  } catch (e) {
    // ignore and fallback to HTTP proxy
  }

  // Proxy to configured AI service URL
  if (env.AI_SERVICE_URL && env.AI_API_KEY) {
    try {
      const resp = await axios.post(`${env.AI_SERVICE_URL}/api/ai/query`, { message: prompt }, { headers: { 'x-api-key': env.AI_API_KEY }, timeout: 20000 })
      return resp.data?.text || ''
    } catch (e) {
      throw new Error('AI provider request failed')
    }
  }

  throw new Error('No AI provider configured')
}

async function generateReportContent({ topic, disease, region, timeRange }) {
  const prompt = buildPrompt({ topic, disease, region, timeRange })
  const text = await callProvider(prompt)
  return text
}

module.exports = { generateReportContent }
