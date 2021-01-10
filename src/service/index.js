import axios from 'axios'

export const BASE_URL = 'http://localhost:8080'

// Set csrf token to any value in case it doesn't present
if (process.env.NODE_ENV === 'dev') document.cookie = 'XSRF-TOKEN=dump'
const CSRF_TOKEN = document.cookie.match(new RegExp(`XSRF-TOKEN=([^;]+)`))[1]

const service = axios.create({
  baseURL: BASE_URL,
  withCredentials: process.env.NODE_ENV === 'dev',
  headers: {
    'X-XSRF-TOKEN': CSRF_TOKEN
  }
})

export const login = (username, password) => {
  const f = new FormData()
  f.append('username', username)
  f.append('password', password)
  return service.post(`login`, f)
}

export const any = () => {
  return service.get(`any`)
}

export const user = () => {
  return service.get(`user`)
}

export const admin = () => {
  return service.get(`admin`)
}

export const logout = () => {
  return service.post(`logout`)
}

export const roles = () => {
  return service.get(`roles`)
}
