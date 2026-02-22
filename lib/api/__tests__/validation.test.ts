import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { validateBody } from '../validation'

const testSchema = z.object({
  name: z.string().min(1),
  age: z.number().positive(),
})

function createJsonRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('validateBody', () => {
  it('retourne data pour un input valide', async () => {
    const req = createJsonRequest({ name: 'Alice', age: 30 })
    const { data, error } = await validateBody(req, testSchema)
    expect(error).toBeNull()
    expect(data).toEqual({ name: 'Alice', age: 30 })
  })

  it('retourne error pour un input invalide', async () => {
    const req = createJsonRequest({ name: '', age: -1 })
    const { data, error } = await validateBody(req, testSchema)
    expect(data).toBeNull()
    expect(error).not.toBeNull()
    expect(error!.status).toBe(400)
  })

  it('retourne error pour un body non-JSON', async () => {
    const req = new NextRequest('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'not json',
    })
    const { data, error } = await validateBody(req, testSchema)
    expect(data).toBeNull()
    expect(error).not.toBeNull()
    expect(error!.status).toBe(400)
  })
})
