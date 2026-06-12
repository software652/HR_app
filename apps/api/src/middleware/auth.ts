import type { Request, Response, NextFunction } from 'express'

// In production this would verify a JWT signed with a secret.
// For this demo we validate the static demo token issued by /auth/login.
const DEMO_TOKEN = 'demo-token'

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''

  if (!token) {
    res.status(401).json({ message: 'Missing Authorization header' })
    return
  }

  if (token !== DEMO_TOKEN) {
    res.status(401).json({ message: 'Invalid or expired token' })
    return
  }

  next()
}
