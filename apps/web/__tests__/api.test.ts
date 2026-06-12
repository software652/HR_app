import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { api } from '../lib/api'

// Stub global fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => mockFetch.mockReset())
afterEach(() => vi.restoreAllMocks())

function makeResponse(body: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response)
}

describe('api()', () => {
  it('sends GET with Authorization header by default', async () => {
    mockFetch.mockReturnValue(makeResponse({ ok: true }))
    await api('/health')
    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect((init.headers as Record<string, string>)['Authorization']).toBe('Bearer demo-token')
    expect(init.method).toBe('GET')
  })

  it('omits Authorization header when public: true', async () => {
    mockFetch.mockReturnValue(makeResponse({ token: 'x' }))
    await api('/auth/login', { public: true, method: 'POST', body: {} })
    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect((init.headers as Record<string, string>)['Authorization']).toBeUndefined()
  })

  it('sends POST with JSON body', async () => {
    mockFetch.mockReturnValue(makeResponse({ id: 'EMP-006' }, 201))
    await api('/employees', { method: 'POST', body: { name: 'Test' } })
    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect(init.method).toBe('POST')
    expect(init.body).toBe(JSON.stringify({ name: 'Test' }))
  })

  it('throws with server message on non-ok response', async () => {
    mockFetch.mockReturnValue(makeResponse({ message: 'Not found' }, 404))
    await expect(api('/employees/EMP-999')).rejects.toThrow('Not found')
  })

  it('throws generic message when error body has no message field', async () => {
    mockFetch.mockReturnValue(makeResponse({}, 500))
    await expect(api('/employees')).rejects.toThrow('API error 500')
  })

  it('returns undefined for 204 No Content', async () => {
    mockFetch.mockReturnValue(Promise.resolve({ ok: true, status: 204, json: () => Promise.reject() } as Response))
    const result = await api('/employees/EMP-001', { method: 'DELETE' })
    expect(result).toBeUndefined()
  })
})
