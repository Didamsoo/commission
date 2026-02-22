import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { getPaginationParams, getFilterParam, getDateFilterParam } from '../pagination'

function createRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL('http://localhost:3000/api/test')
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return new NextRequest(url)
}

describe('getPaginationParams', () => {
  it('retourne les défauts (page=1, limit=20)', () => {
    const req = createRequest()
    const { page, limit, offset } = getPaginationParams(req)
    expect(page).toBe(1)
    expect(limit).toBe(20)
    expect(offset).toBe(0)
  })

  it('calcule l\'offset correctement', () => {
    const req = createRequest({ page: '3', limit: '10' })
    const { page, limit, offset } = getPaginationParams(req)
    expect(page).toBe(3)
    expect(limit).toBe(10)
    expect(offset).toBe(20) // (3-1) * 10
  })

  it('clamp page minimum à 1', () => {
    const req = createRequest({ page: '-5' })
    const { page } = getPaginationParams(req)
    expect(page).toBe(1)
  })

  it('clamp limit minimum à 1', () => {
    const req = createRequest({ limit: '0' })
    const { limit } = getPaginationParams(req)
    expect(limit).toBe(1)
  })

  it('clamp limit maximum à 100', () => {
    const req = createRequest({ limit: '500' })
    const { limit } = getPaginationParams(req)
    expect(limit).toBe(100)
  })

  it('gère les valeurs non numériques', () => {
    const req = createRequest({ page: 'abc', limit: 'xyz' })
    const { page, limit } = getPaginationParams(req)
    // parseInt('abc') = NaN → Math.max(1, NaN) = NaN
    expect(page).toBeNaN()
    expect(limit).toBeNaN()
  })
})

describe('getFilterParam', () => {
  it('retourne la valeur du paramètre', () => {
    const req = createRequest({ status: 'active' })
    expect(getFilterParam(req, 'status')).toBe('active')
  })

  it('retourne null si absent', () => {
    const req = createRequest()
    expect(getFilterParam(req, 'status')).toBeNull()
  })
})

describe('getDateFilterParam', () => {
  it('retourne une date ISO valide', () => {
    const req = createRequest({ from: '2024-01-15' })
    expect(getDateFilterParam(req, 'from')).toBe('2024-01-15')
  })

  it('rejette un format invalide', () => {
    const req = createRequest({ from: '15/01/2024' })
    expect(getDateFilterParam(req, 'from')).toBeNull()
  })

  it('retourne null si absent', () => {
    const req = createRequest()
    expect(getDateFilterParam(req, 'from')).toBeNull()
  })
})
