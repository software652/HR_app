import express from 'express'
import cors from 'cors'
import { requestLogger } from './middleware/logger.js'
import { requireAuth } from './middleware/auth.js'
import authRouter from './routes/auth.js'
import employeesRouter from './routes/employees.js'
import leavesRouter from './routes/leaves.js'
import payrollRouter from './routes/payroll.js'
import jobsRouter from './routes/jobs.js'
import { employees, leaves, payroll, jobs } from './data.js'

export function createApp() {
  const app = express()

  const allowedOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3000'
  app.use(cors({ origin: allowedOrigin, credentials: true }))
  app.use(express.json())
  app.use(requestLogger)

  // Public
  app.get('/health', (_req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }))
  app.use('/auth', authRouter)

  // Protected
  app.use(requireAuth)

  app.get('/dashboard', (_req, res) => {
    const totalPayrollThisMonth = payroll
      .filter(p => p.status === 'Processed')
      .reduce((sum, p) => sum + p.net, 0)

    res.json({
      totalEmployees:       employees.length,
      activeEmployees:      employees.filter(e => e.status === 'Active').length,
      pendingLeaves:        leaves.filter(l => l.status === 'Pending').length,
      openJobs:             jobs.filter(j => j.status === 'Open').length,
      totalPayrollThisMonth,
    })
  })

  app.use('/employees', employeesRouter)
  app.use('/leaves',    leavesRouter)
  app.use('/payroll',   payrollRouter)
  app.use('/jobs',      jobsRouter)

  app.use((_req, res) => res.status(404).json({ message: 'Route not found' }))

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[ERROR]', err.message)
    res.status(500).json({ message: 'Internal server error' })
  })

  return app
}
