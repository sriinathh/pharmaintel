import axios from 'axios'

// Prefer explicit VITE_API_URL; in dev default to localhost backend to avoid 404s
const envBase = import.meta.env.VITE_API_URL
const devFallback = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : ''
const baseURL = envBase || devFallback || ''

const instance = axios.create({ baseURL: (baseURL ? baseURL : '') + '/api', timeout: 10000 })

// attach token from localStorage if present
instance.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('auth_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export async function get(path, params) {
  const res = await instance.get(path, { params })
  return res.data
}

export async function post(path, body) {
  const res = await instance.post(path, body)
  return res.data
}

export default { get, post, instance }
