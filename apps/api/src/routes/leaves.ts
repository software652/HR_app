import { Router } from 'express'
import { z } from 'zod'
import { leaves, employees } from '../data.js'
import type { Leave } from '../types/index.js'

const router = Router()

const leaveSchema = z.object({
  employeeId: z.string().min(1),
  type:       z.enum(['Annual Leave', 'Sick Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave']),
  from:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason:     z.string().optional(),
}).refine(d => d.from <= d.to, { message: '"from" must not be after "to"', path: ['from'] })

router.get('/', (_req, res) => {
  res.json(leaves)
})

router.get('/:id', (req, res) => {
  const leave = leaves.find(l => l.id === req.params.id)
  if (!leave) {
    res.status(404).json({ message: `Leave ${req.params.id} not found` })
    return
  }
  res.json(leave)
})

router.post('/', (req, res) => {
  const result = leaveSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ message: 'Validation failed', errors: result.error.flatten() })
    return
  }

  const emp = employees.find(e => e.id === result.data.employeeId)
  if (!emp) {
    res.status(400).json({ message: `Employee ${result.data.employeeId} not found` })
    return
  }

  const newLeave: Leave = {
    id: `LV-${String(leaves.length + 101).padStart(3, '0')}`,
    employee: emp.name,
    status: 'Pending',
    ...result.data,
  }
  leaves.push(newLeave)
  res.status(201).json(newLeave)
})

router.patch('/:id/status', (req, res) => {
  const leave = leaves.find(l => l.id === req.params.id)
  if (!leave) {
    res.status(404).json({ message: `Leave ${req.params.id} not found` })
    return
  }

  const result = z.object({ status: z.enum(['Approved', 'Rejected', 'Pending']) }).safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ message: 'Validation failed', errors: result.error.flatten() })
    return
  }

  leave.status = result.data.status
  res.json(leave)
})

export default router
