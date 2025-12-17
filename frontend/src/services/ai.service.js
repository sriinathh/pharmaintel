import api from './api'

export async function queryAI(message, model = null) {
  try {
    const resp = await api.post('/ai/query', { message, model })
    // Expect { text, model, disclaimer }
    return { text: resp.text || '(no response)', model: resp.model || 'provider', disclaimer: resp.disclaimer }
  } catch (err) {
    return { text: 'AI service unavailable. Please try again later.', model: 'local-fallback', disclaimer: 'This information is for educational purposes only and is not medical advice. Please consult a qualified healthcare professional.' }
  }
}

export default { queryAI }
