'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { type Config } from '@/components/ClientPage'
import { redis } from '@/lib/redis'

export async function login(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD

  if (adminPassword && password === adminPassword) {
    const cookieStore = await cookies()
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
    return { success: true }
  }
  return { success: false, error: 'Password errata' }
}

export async function saveConfig(newConfig: Config) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  
  if (!session || session.value !== 'authenticated') {
    return { success: false, error: 'Non autorizzato. Effettua il login.' }
  }

  try {
    // Salvataggio sul Database Redis invece che su disco locale
    await redis.set('grim_config', newConfig)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error saving config to Redis:', error)
    return { success: false, error: 'Failed to save configuration' }
  }
}
