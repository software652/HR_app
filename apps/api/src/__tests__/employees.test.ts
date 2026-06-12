import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { createApp } from '../app.js'
import { employees } from '../data.js'

const app = createApp()
const AUTH = { Authorization: 'Bearer demo-token' }

// Reset in-memory data before each test so mutations don't bleed across tests
const ORIGINAL_LENGTH = employees.length
beforeEach(() => {
  employees.splice(ORIGINAL_LENGTH)
})

describe('GET /employees', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/employees')
    expect(res.status).toBe(401)
  })

  it('returns employee list', async () => {
    const res = await request(app).get('/employees').set(AUTH)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
    expect(res.body[0]).toMatchObject({ id: expect.stringMatching(/^EMP-/), name: expect.any(String) })
  })
})

describe('GET /employees/:id', () => {
  it('returns a single employee', async () => {
    const res = await request(app).get('/employees/EMP-001').set(AUTH)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe('EMP-001')
  })

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/employees/EMP-999').set(AUTH)
    expect(res.status).toBe(404)
  })
})

describe('POST /employees', () => {
  it('creates a new employee', async () => {
    const payload = {
      name: 'Test User', email: 'test@company.com',
      department: 'QA', role: 'QA Engineer',
      status: 'Active', joiningDate: '2026-01-01',
    }
    const res = await request(app).post('/employees').set(AUTH).send(payload)
    expect(res.status).toBe(201)
    expect(res.body.id).toMatch(/^EMP-/)
    expect(res.body.name).toBe('Test User')
  })

  it('returns 400 for invalid email', async () => {
    const res = await request(app).post('/employees').set(AUTH).send({
      name: 'Bad', email: 'not-email', department: 'X', role: 'Y', joiningDate: '2026-01-01',
    })
    expect(res.status).toBe(400)
  })

  it('returns 400 for missing required fields', async () => {
    const res = await request(app).post('/employees').set(AUTH).send({ name: 'Only Name' })
    expect(res.status).toBe(400)
  })
})

describe('PATCH /employees/:id', () => {
  it('updates an employee field', async () => {
    const res = await request(app).patch('/employees/EMP-001').set(AUTH).send({ role: 'Senior Developer' })
    expect(res.status).toBe(200)
    expect(res.body.role).toBe('Senior Developer')
  })

  it('returns 404 for unknown id', async () => {
    const res = await request(app).patch('/employees/EMP-999').set(AUTH).send({ role: 'X' })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /employees/:id', () => {
  it('deletes an employee', async () => {
    // First create one to delete
    const created = await request(app).post('/employees').set(AUTH).send({
      name: 'To Delete', email: 'del@company.com',
      department: 'Temp', role: 'Temp', joiningDate: '2026-01-01',
    })
    const id = created.body.id as string
    const del = await request(app).delete(`/employees/${id}`).set(AUTH)
    expect(del.status).toBe(204)

    const get = await request(app).get(`/employees/${id}`).set(AUTH)
    expect(get.status).toBe(404)
  })
})
