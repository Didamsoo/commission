import { NextRequest } from 'next/server'

export interface PaginationParams {
  page: number
  limit: number
  offset: number
}

export function getPaginationParams(request: NextRequest): PaginationParams {
  const searchParams = request.nextUrl.searchParams
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
  const offset = (page - 1) * limit
  return { page, limit, offset }
}

export function getFilterParam(request: NextRequest, key: string): string | null {
  return request.nextUrl.searchParams.get(key) || null
}

export function getDateFilterParam(
  request: NextRequest,
  key: string
): string | null {
  const value = request.nextUrl.searchParams.get(key)
  if (!value) return null
  // Validation basique du format ISO date
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return null
  return value
}
