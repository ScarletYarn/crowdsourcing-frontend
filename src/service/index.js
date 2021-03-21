import axios from 'axios'

export const BASE_URL = 'http://localhost:8080'
// export const BASE_URL = 'http://192.168.10.162:8080'

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
  f.append('phone', username)
  f.append('password', password)
  return service.post(`login`, f)
}

// export const signup = (data) => {
//   return service.post(`/user/signup`, data)
// }
export const signup = (username, password, phone, alipay) => {
  const f = new FormData()
  f.append('username', username)
  f.append('password', password)
  f.append('phone', phone)
  f.append('alipay', alipay)
  return service.put(`/user/signup`, f)
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

export const getme = () => {
  return service.get(`/user/me`)
}
export const getjoball = () => {
  return service.get(`/job/all`)
}

export const getRewardAll = () => {
  return service.get(`/reward/me`)
}

export const queryJob = jobId => {
  return service.get(`/job/q`, {
    params: {
      jobId: jobId
    }
  })
}

export const getRank = () => {
  return service.get(`/reward/rank`)
}

export const update = (username, alipay) => {
  const f = new FormData()
  f.append('username', username)
  f.append('alipay', alipay)
  return service.post(`/user/update`, f)
}

export const getQuestionnaire = () => {
  return service.get(`/user/questionnaire/q`)
}

export const insertQuestionnaire = (
  name,
  age,
  gender,
  kg,
  education,
  rating
) => {
  return service.put(`/user/questionnaire/p`, null, {
    params: {
      name: name,
      age: age,
      gender: gender,
      kg: kg,
      education: education,
      rating: rating
    }
  })
}

export const getRules = jobId => {
  return service.get(`/ruleData/byJobId`, {
    params: {
      jobId: jobId
    }
  })
}

export const qRule = ruleId => {
  return service.get(`/ruleData/q`, {
    params: {
      id: ruleId
    }
  })
}

export const answer = (
  jobId,
  ruleDataId,
  answer,
  graphScore,
  nlScore,
  instanceScore
) => {
  return service.put(`/answerRecord/answer`, null, {
    params: {
      jobId: jobId,
      ruleDataId: ruleDataId,
      answer: answer,
      graphScore: graphScore,
      nlScore: nlScore,
      instanceScore: instanceScore
    }
  })
}
