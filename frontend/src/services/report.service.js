import api from './api'

// Fallback mocked data used if backend is unavailable
const _mock = [
  { id: 'r1', title: 'Drug Interaction Report: Atenolol', date: '2025-12-01', category: 'Interaction', language: 'en', content: 'Summary: No major interactions detected. Recommendations: Monitor blood pressure.' },
  { id: 'r2', title: 'Adverse Events Summary: Ibuprofen', date: '2025-11-20', category: 'Safety', language: 'en', content: 'Summary: GI upset in 3% of cases. Recommendations: Take with food.' }
]

export async function listReports() {
  try {
    const data = await api.get('/reports')
    return Array.isArray(data) ? data.reverse() : []
  } catch (err) {
    return Promise.resolve(_mock.slice().reverse())
  }
}

export async function getReport(id) {
  try {
    const data = await api.get(`/reports/${id}`)
    return data
  } catch (err) {
    return Promise.resolve(_mock.find(r => r.id === id))
  }
}

export async function generateReport(payload) {
  // payload expected: { topic, disease, region, timeRange }
  try {
    const res = await api.post('/reports/generate', payload)
    return res
  } catch (err) {
    // Fallback: create a simple mocked report from payload
    const newR = {
      id: 'r' + (Date.now()),
      title: `${payload.topic || 'AI Report'} — ${payload.disease || ''}`.trim(),
      date: new Date().toISOString().slice(0,10),
      category: 'AI Report',
      language: payload.language || 'en',
      content: `Generated (mock): Topic: ${payload.topic || ''}\nDisease: ${payload.disease || ''}\nRegion: ${payload.region || ''}\nTime Range: ${payload.timeRange || ''}`
    }
    return Promise.resolve(newR)
  }
}

export default { listReports, getReport, generateReport }
