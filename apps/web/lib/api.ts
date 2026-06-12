const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

// Demo token — in production this would come from a session/cookie store
const DEMO_TOKEN = 'demo-token'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  /** Skip the Authorization header (e.g. for /auth/login) */
  public?: boolean
}

export async function api<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, public: isPublic = false } = opts

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (!isPublic) headers['Authorization'] = `Bearer ${DEMO_TOKEN}`

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })

  if (!res.ok) {
    let message = `API error ${res.status}`
    try {
      const data = await res.json() as { message?: string }
      if (data.message) message = data.message
    } catch {
      // ignore parse errors on error responses
    }
    throw new Error(message)
  }

  // 204 No Content
  if (res.status === 204) return undefined as T

  return res.json() as Promise<T>
}

