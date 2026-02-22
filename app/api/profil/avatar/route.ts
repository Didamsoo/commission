import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, badRequest, serverError } from '@/lib/api/errors'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 2 * 1024 * 1024 // 2 MB

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser()
    if (!auth) return unauthorized()

    const { user, profile, supabase } = auth

    // Parse FormData
    const formData = await request.formData()
    const file = formData.get('avatar') as File | null

    if (!file || !(file instanceof File)) {
      return badRequest('Aucun fichier fourni')
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return badRequest('Type de fichier non autoris\u00e9. Formats accept\u00e9s : JPEG, PNG, WebP, GIF')
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return badRequest('Le fichier est trop volumineux. Taille maximale : 2 Mo')
    }

    // Build storage path
    const ext = file.name.split('.').pop() || 'jpg'
    const timestamp = Date.now()
    const filePath = `${user.id}/${timestamp}.${ext}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      return serverError(uploadError.message)
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    const publicUrl = publicUrlData.publicUrl

    // Update profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)

    if (updateError) {
      return serverError(updateError.message)
    }

    // Update auth user metadata
    await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    })

    // Clean up old avatar from storage if it was in the "avatars" bucket
    const oldAvatarUrl = profile.avatar_url
    if (oldAvatarUrl && oldAvatarUrl.includes('/avatars/')) {
      const oldPath = oldAvatarUrl.split('/avatars/').pop()
      if (oldPath) {
        await supabase.storage.from('avatars').remove([decodeURIComponent(oldPath)])
      }
    }

    return NextResponse.json({ data: { avatar_url: publicUrl } })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return serverError("Erreur lors de l'upload de l'avatar")
  }
}
