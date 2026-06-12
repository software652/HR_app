import { Router } from 'express'
import { z } from 'zod'

const router = Router()

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

// Demo credentials — replace with a real user store + bcrypt in production
const DEMO_USER = { email: 'hr@company.com', password: 'password123', name: 'HR Admin', role: 'HR_MANAGER' }

router.post('/login', (req, res) => {
  const result = loginSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ message: 'Invalid request body', errors: result.error.flatten() })
    return
  }

  const { email, password } = result.data
  if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  res.json({
    token: 'demo-token',
    user: { name: DEMO_USER.name, email: DEMO_USER.email, role: DEMO_USER.role },
  })
})

export default router
