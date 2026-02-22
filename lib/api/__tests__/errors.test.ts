/// <reference types="vitest/config" />
import { describe, it, expect } from 'vitest'
import { unauthorized, forbidden, notFound, badRequest, serverError } from '../errors'

describe('API error responses', () => {
  it('unauthorized → 401', async () => {
    const res = unauthorized()
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Non authentifié')
  })

  it('forbidden → 403', async () => {
    const res = forbidden()
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toBe('Accès interdit')
  })

  it('notFound → 404 avec nom de ressource', async () => {
    const res = notFound('Utilisateur')
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toBe('Utilisateur introuvable')
  })

  it('badRequest → 400 avec détails', async () => {
    const res = badRequest('Champ invalide', { field: 'email' })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Champ invalide')
    expect(body.details).toEqual({ field: 'email' })
  })

  it('serverError → 500', async () => {
    const res = serverError()
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('Erreur serveur')
  })
})
