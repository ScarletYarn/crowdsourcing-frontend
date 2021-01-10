const Mock = require('mockjs')
import { BASE_URL } from '../service'

Mock.mock(`${BASE_URL}/any`, 'get', () => 'Hello')
Mock.mock(`${BASE_URL}/login`, () => true)
Mock.mock(`${BASE_URL}/logout`, () => true)
Mock.mock(`${BASE_URL}/user`, () => 'user')
Mock.mock(`${BASE_URL}/admin`, () => 'admin')
Mock.mock(`${BASE_URL}/roles`, () => ['ROLE_ADMIN'])
