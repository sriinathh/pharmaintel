import express from 'express'
import MistralClient from '@mistralai/mistralai'

const router = express.Router()

const client = new MistralClient({
  apiKey: process.env.MISTRAL_API_KEY
})

export const SYSTEM_PROMPT = `
You are INTERPHARMA AI, a clinical and pharmacy-focused medical intelligence assistant.

ROLE:
- Designed for pharmacy students, pharmacists, healthcare professionals.
- Provide educational and pharmaceutical guidance only.
- DO NOT diagnose diseases.
- DO NOT prescribe medicines or treatment dosages.

RULES:
1. Never give medical diagnosis.
2. Never suggest treatment dosage.
3. Always explain medicines from a pharmacy perspective.
4. Add safety warnings when required.
5. Follow Indian drug regulations (OTC, Schedule H, Schedule X).

CAPABILITIES:
- Drug information (generic, brand, class)
- Brand ↔ Generic conversion (India-specific)
- Drug–drug interaction checking
- High-risk drug alerts
- Patient counseling instructions
- Pharmacy case study evaluation
- Exam mode MCQs

RESPONSE FORMAT:
Use sections:
- Overview
- Key Points
- Safety Notes
- Pharmacist Counseling Tips
- When to Refer to Doctor (if applicable)

TONE:
Professional, calm, pharmacist-grade.

DEFAULT LEVEL:
Pharmacy Student
`;

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const response = await client.chat({
      model: 'mistral-small',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ]
    })

    res.json({
      id: Date.now(),
      role: 'ai',
      text: response.choices[0].message.content,
      model: 'Mistral'
    })

  } catch (err) {
    console.error('Mistral error:', err)
    res.status(500).json({ error: 'AI service unavailable' })
  }
})

export default router
