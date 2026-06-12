import express from 'express'
import cors from 'cors'
import { employees, leaves, payroll, jobs } from './data.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => res.json({ ok: true }))

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body
  if (email === 'hr@company.com' && password === 'password123') {
    return res.json({ token: 'demo-token', user: { name: 'HR Admin', email, role: 'HR_MANAGER' } })
  }
  return res.status(401).json({ message: 'Invalid credentials' })
})

app.get('/dashboard', (_req, res) => {
  res.json({
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'Active').length,
    pendingLeaves: leaves.filter(l => l.status === 'Pending').length,
    openJobs: jobs.filter(j => j.status === 'Open').length
  })
})

app.get('/employees', (_req, res) => res.json(employees))
app.get('/leaves', (_req, res) => res.json(leaves))
app.get('/payroll', (_req, res) => res.json(payroll))
app.get('/jobs', (_req, res) => res.json(jobs))

app.listen(4000, () => console.log('HR API running on http://localhost:4000'))
