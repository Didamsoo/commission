import { describe, it, expect, vi, beforeEach } from 'vitest'

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

import { saveFicheMarge } from '../use-fiches-marge'

describe('use-fiches-marge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('saveFicheMarge', () => {
    it('sends POST request with correct data', async () => {
      mockApiFetch.mockResolvedValue({ data: { id: 'fm-1' } })

      const data = {
        vehicle_type: 'VP',
        selling_price: 25000,
        purchase_price: 20000,
        financing_rate: 45,
      }
      await saveFicheMarge(data)

      expect(mockApiFetch).toHaveBeenCalledWith('/api/fiches-marge', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    })

    it('returns API response on success', async () => {
      const response = { data: { id: 'fm-1', margin: 5000 } }
      mockApiFetch.mockResolvedValue(response)

      const result = await saveFicheMarge({ selling_price: 25000 })
      expect(result).toEqual(response)
    })

    it('propagates API errors', async () => {
      mockApiFetch.mockRejectedValue(new Error('Validation failed'))

      await expect(saveFicheMarge({})).rejects.toThrow('Validation failed')
    })
  })
})
