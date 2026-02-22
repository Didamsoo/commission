// Client-side API fetch wrapper (for use in React components)

export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  details?: unknown
  count?: number
  page?: number
  limit?: number
}

export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    let body: ApiResponse | undefined
    try {
      body = await res.json()
    } catch {
      // not JSON
    }
    throw new ApiError(
      res.status,
      body?.error || `Erreur ${res.status}`,
      body?.details
    )
  }

  const contentType = res.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return (await res.json()) as ApiResponse<T>
  }

  return {} as ApiResponse<T>
}
