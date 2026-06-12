import { Router } from 'express'
import { z } from 'zod'
import { payroll, employees } from '../data.js'
import type { PayrollRecord } from '../types/index.js'

const router = Router()

const payrollSchema = z.object({
  employeeId: z.string().min(1),
  month:      z.string().min(1),
  gross:      z.number().positive(),
  deductions: z.number().min(0),
  status:     z.enum(['Pending', 'Processed', 'Failed']).default('Pending'),
})

router.get('/', (_req, res) => {
  res.json(payroll)
})

router.get('/:id', (req, res) => {
  const record = payroll.find(p => p.id === req.params.id)
  if (!record) {
    res.status(404).json({ message: `Payroll record ${req.params.id} not found` })
    return
  }
  res.json(record)
})

router.post('/', (req, res) => {
  const result = payrollSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ message: 'Validation failed', errors: result.error.flatten() })
    return
  }

  const emp = employees.find(e => e.id === result.data.employeeId)
  if (!emp) {
    res.status(400).json({ message: `Employee ${result.data.employeeId} not found` })
    return
  }

  const { gross, deductions } = result.data
  const newRecord: PayrollRecord = {
    id: `PAY-${String(payroll.length + 1).padStart(3, '0')}`,
    employee: emp.name,
    net: gross - deductions,   // always derived
    ...result.data,
  }
  payroll.push(newRecord)
  res.status(201).json(newRecord)
})

router.patch('/:id/status', (req, res) => {
  const record = payroll.find(p => p.id === req.params.id)
  if (!record) {
    res.status(404).json({ message: `Payroll record ${req.params.id} not found` })
    return
  }

  const result = z.object({ status: z.enum(['Pending', 'Processed', 'Failed']) }).safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ message: 'Validation failed', errors: result.error.flatten() })
    return
  }

  record.status = result.data.status
  res.json(record)
})

export default router
