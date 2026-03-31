import axios from 'axios'
import { API_BASE_URL, AUTH_COOKIE_NAME } from '@/lib/constants'

/**
 * Shared Axios instance with auth-token interceptor.
 * All API calls should import this instead of bare axios.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  // Only access localStorage in the browser
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(AUTH_COOKIE_NAME)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_COOKIE_NAME)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
