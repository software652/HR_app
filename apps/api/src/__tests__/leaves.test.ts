import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../app.js'

const app = createApp()
const AUTH = { Authorization: 'Bearer demo-token' }

describe('GET /leaves', () => {
  it('returns leave records', async () => {
    const res = await request(app).get('/leaves').set(AUTH)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('POST /leaves', () => {
  it('creates a leave request', async () => {
    const res = await request(app).post('/leaves').set(AUTH).send({
      employeeId: 'EMP-001',
      type: 'Annual Leave',
      from: '2026-07-01',
      to: '2026-07-05',
      reason: 'Holiday',
    })
    expect(res.status).toBe(201)
    expect(res.body.status).toBe('Pending')
    expect(res.body.employee).toBe('Aarav Sharma')
  })

  it('returns 400 when "from" is after "to"', async () => {
    const res = await request(app).post('/leaves').set(AUTH).send({
      employeeId: 'EMP-001',
      type: 'Sick Leave',
      from: '2026-07-10',
      to: '2026-07-05',
    })
    expect(res.status).toBe(400)
  })

  it('returns 400 for unknown employee', async () => {
    const res = await request(app).post('/leaves').set(AUTH).send({
      employeeId: 'EMP-999',
      type: 'Sick Leave',
      from: '2026-07-01',
      to: '2026-07-02',
    })
    expect(res.status).toBe(400)
  })
})

describe('PATCH /leaves/:id/status', () => {
  it('approves a leave request', async () => {
    const res = await request(app).patch('/leaves/LV-101/status').set(AUTH).send({ status: 'Approved' })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('Approved')
  })

  it('returns 400 for invalid status value', async () => {
    const res = await request(app).patch('/leaves/LV-101/status').set(AUTH).send({ status: 'Maybe' })
    expect(res.status).toBe(400)
  })

  it('returns 404 for unknown leave id', async () => {
    const res = await request(app).patch('/leaves/LV-999/status').set(AUTH).send({ status: 'Approved' })
    expect(res.status).toBe(404)
  })
})
