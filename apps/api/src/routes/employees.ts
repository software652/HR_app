import { Router } from 'express'
import { z } from 'zod'
import { employees } from '../data.js'
import type { Employee } from '../types/index.js'

const router = Router()

const employeeSchema = z.object({
  name:        z.string().min(1),
  email:       z.string().email(),
  department:  z.string().min(1),
  role:        z.string().min(1),
  status:      z.enum(['Active', 'Inactive', 'On Leave']).default('Active'),
  joiningDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
})

router.get('/', (_req, res) => {
  res.json(employees)
})

router.get('/:id', (req, res) => {
  const emp = employees.find(e => e.id === req.params.id)
  if (!emp) {
    res.status(404).json({ message: `Employee ${req.params.id} not found` })
    return
  }
  res.json(emp)
})

router.post('/', (req, res) => {
  const result = employeeSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ message: 'Validation failed', errors: result.error.flatten() })
    return
  }

  const newEmp: Employee = {
    id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
    ...result.data,
  }
  employees.push(newEmp)
  res.status(201).json(newEmp)
})

router.patch('/:id', (req, res) => {
  const idx = employees.findIndex(e => e.id === req.params.id)
  if (idx === -1) {
    res.status(404).json({ message: `Employee ${req.params.id} not found` })
    return
  }

  const result = employeeSchema.partial().safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ message: 'Validation failed', errors: result.error.flatten() })
    return
  }

  employees[idx] = { ...employees[idx]!, ...result.data }
  res.json(employees[idx])
})

router.delete('/:id', (req, res) => {
  const idx = employees.findIndex(e => e.id === req.params.id)
  if (idx === -1) {
    res.status(404).json({ message: `Employee ${req.params.id} not found` })
    return
  }
  employees.splice(idx, 1)
  res.status(204).send()
})

export default router
