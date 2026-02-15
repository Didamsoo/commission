import { NextResponse } from 'next/server'
import type { ApiResponse } from './types'

export function unauthorized(): NextResponse<ApiResponse> {
  return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
}

export function forbidden(): NextResponse<ApiResponse> {
  return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
}

export function notFound(resource = 'Ressource'): NextResponse<ApiResponse> {
  return NextResponse.json({ error: `${resource} introuvable` }, { status: 404 })
}

export function badRequest(error: string, details?: unknown): NextResponse<ApiResponse> {
  return NextResponse.json({ error, details }, { status: 400 })
}

export function serverError(error: string = 'Erreur serveur'): NextResponse<ApiResponse> {
  return NextResponse.json({ error }, { status: 500 })
}
