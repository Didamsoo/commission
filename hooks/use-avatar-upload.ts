"use client"

import { useState } from "react"

export function useAvatarUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadAvatar = async (file: File): Promise<string | null> => {
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("avatar", file)
      const response = await fetch("/api/profil/avatar", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Upload failed")
      }
      const result = await response.json()
      return result.data?.avatar_url || result.avatar_url
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur d'upload"
      setError(message)
      return null
    } finally {
      setUploading(false)
    }
  }

  return { uploadAvatar, uploading, error }
}
