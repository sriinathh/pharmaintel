import api from './api'

export async function searchDrugs(q) {
  try {
    const params = q ? { q } : {}
    const res = await api.get('/drugs/search', params)
    return res
  } catch (err) {
    return []
  }
}

export async function getDrug(id) {
  try {
    const res = await api.get(`/drugs/${id}`)
    return res
  } catch (err) {
    return null
  }
}

export async function convertDrug(query) {
  try {
    const res = await api.post('/drugs/convert', { query })
    return res
  } catch (err) {
    return null
  }
}

export async function getSubstitutes(drugId) {
  try {
    const res = await api.post('/drugs/substitutes', { drugId })
    return res
  } catch (err) {
    return null
  }
}

export async function checkInteractions(drugs) {
  try {
    const res = await api.post('/drugs/interactions', { drugs })
    return res
  } catch (err) {
    return null
  }
}

export default { searchDrugs, getDrug, convertDrug, getSubstitutes, checkInteractions }
