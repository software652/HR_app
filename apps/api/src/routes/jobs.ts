import { Router } from 'express'
import { z } from 'zod'
import { jobs } from '../data.js'
import type { Job } from '../types/index.js'

const router = Router()

const jobSchema = z.object({
  title:      z.string().min(1),
  department: z.string().min(1),
  status:     z.enum(['Open', 'Closed', 'Draft']).default('Open'),
})

router.get('/', (_req, res) => {
  res.json(jobs)
})

router.get('/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id)
  if (!job) {
    res.status(404).json({ message: `Job ${req.params.id} not found` })
    return
  }
  res.json(job)
})

router.post('/', (req, res) => {
  const result = jobSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ message: 'Validation failed', errors: result.error.flatten() })
    return
  }

  const newJob: Job = {
    id: `JOB-${String(jobs.length + 1).padStart(3, '0')}`,
    applicants: 0,
    ...result.data,
  }
  jobs.push(newJob)
  res.status(201).json(newJob)
})

router.patch('/:id', (req, res) => {
  const idx = jobs.findIndex(j => j.id === req.params.id)
  if (idx === -1) {
    res.status(404).json({ message: `Job ${req.params.id} not found` })
    return
  }

  const result = jobSchema.partial().safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ message: 'Validation failed', errors: result.error.flatten() })
    return
  }

  jobs[idx] = { ...jobs[idx]!, ...result.data }
  res.json(jobs[idx])
})

export default router
