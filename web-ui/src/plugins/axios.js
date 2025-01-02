import axios from 'axios'
import { useSessionStore } from '@/stores/session'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const sessionStore = useSessionStore()

    if (sessionStore.token) {
      config.headers['X-Token'] = sessionStore.token
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default axiosInstance
