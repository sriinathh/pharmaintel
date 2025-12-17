import api from '../../services/api'

export async function postMedicalChat({ message, mode = 'Student', context = {} }) {
  const body = { message, mode, context }
  const res = await api.post('/medical/chat', body)
  return res
}

export default { postMedicalChat }
