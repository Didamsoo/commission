import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock apiFetch
const mockApiFetch = vi.fn()
vi.mock('@/lib/api/client', () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
  ApiError: class ApiError extends Error {
    status: number
    constructor(status: number, message: string) {
      super(message)
      this.status = status
    }
  }
}))

// Import after mock
import { createDefi, deleteDefi } from '../use-defis'

describe('use-defis', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createDefi', () => {
    it('sends POST request with correct data', async () => {
      mockApiFetch.mockResolvedValue({ data: { id: '123' } })

      const data = { title: 'Test Defi', type: 'sales_count', target: 10 }
      await createDefi(data)

      expect(mockApiFetch).toHaveBeenCalledWith('/api/defis', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    })

    it('returns API response', async () => {
      const response = { data: { id: '123', title: 'Test' } }
      mockApiFetch.mockResolvedValue(response)

      const result = await createDefi({ title: 'Test' })
      expect(result).toEqual(response)
    })

    it('propagates API errors', async () => {
      mockApiFetch.mockRejectedValue(new Error('Network error'))

      await expect(createDefi({ title: 'Fail' })).rejects.toThrow('Network error')
    })
  })

  describe('deleteDefi', () => {
    it('sends DELETE request with correct id', async () => {
      mockApiFetch.mockResolvedValue({})

      await deleteDefi('abc-123')

      expect(mockApiFetch).toHaveBeenCalledWith('/api/defis/abc-123', {
        method: 'DELETE',
      })
    })

    it('propagates errors on delete', async () => {
      mockApiFetch.mockRejectedValue(new Error('Not found'))

      await expect(deleteDefi('bad-id')).rejects.toThrow('Not found')
    })
  })
})
