import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../app.js'

const app = createApp()
const AUTH = { Authorization: 'Bearer demo-token' }

describe('GET /payroll', () => {
  it('returns payroll records', async () => {
    const res = await request(app).get('/payroll').set(AUTH)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('net pay equals gross minus deductions for every record', async () => {
    const res = await request(app).get('/payroll').set(AUTH)
    for (const record of res.body) {
      expect(record.net).toBe(record.gross - record.deductions)
    }
  })
})

describe('POST /payroll', () => {
  it('creates a record and derives net automatically', async () => {
    const res = await request(app).post('/payroll').set(AUTH).send({
      employeeId: 'EMP-001',
      month: 'May 2026',
      gross: 100000,
      deductions: 10000,
    })
    expect(res.status).toBe(201)
    expect(res.body.net).toBe(90000)   // must be derived, not supplied
  })

  it('returns 400 for negative gross', async () => {
    const res = await request(app).post('/payroll').set(AUTH).send({
      employeeId: 'EMP-001', month: 'May 2026', gross: -1, deductions: 0,
    })
    expect(res.status).toBe(400)
  })

  it('returns 400 for unknown employee', async () => {
    const res = await request(app).post('/payroll').set(AUTH).send({
      employeeId: 'EMP-999', month: 'May 2026', gross: 50000, deductions: 5000,
    })
    expect(res.status).toBe(400)
  })
})

describe('GET /dashboard', () => {
  it('returns all expected stat fields', async () => {
    const res = await request(app).get('/dashboard').set(AUTH)
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      totalEmployees:       expect.any(Number),
      activeEmployees:      expect.any(Number),
      pendingLeaves:        expect.any(Number),
      openJobs:             expect.any(Number),
      totalPayrollThisMonth: expect.any(Number),
    })
  })

  it('activeEmployees <= totalEmployees', async () => {
    const res = await request(app).get('/dashboard').set(AUTH)
    expect(res.body.activeEmployees).toBeLessThanOrEqual(res.body.totalEmployees)
  })
})
