import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../app.js'

const app = createApp()

describe('POST /auth/login', () => {
  it('returns token for valid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'hr@company.com', password: 'password123' })

    expect(res.status).toBe(200)
    expect(res.body.token).toBe('demo-token')
    expect(res.body.user.role).toBe('HR_MANAGER')
  })

  it('returns 401 for wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'hr@company.com', password: 'wrong' })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid credentials')
  })

  it('returns 400 for invalid email format', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'not-an-email', password: 'password123' })

    expect(res.status).toBe(400)
  })

  it('returns 400 for missing body fields', async () => {
    const res = await request(app).post('/auth/login').send({})
    expect(res.status).toBe(400)
  })
})
