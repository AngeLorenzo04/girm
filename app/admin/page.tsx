import { redis } from '@/lib/redis'
import fs from 'fs/promises'
import path from 'path'
import { cookies } from 'next/headers'
import { type Config } from '@/components/ClientPage'
import AdminForm from './AdminForm'
import AdminLogin from './AdminLogin'

export const revalidate = 0

export default async function AdminPage() {
  const filePath = path.join(process.cwd(), 'data/config.json')
  let config: Config | null = null
  
  try {
    // 1. Prova a leggere dal Database
    config = await redis.get<Config>('grim_config')
  } catch (error) {
    console.error('Redis error:', error)
  }

  // 2. Se Redis è vuoto (primo avvio col DB), prova a recuperare i dati dal vecchio file locale
  if (!config) {
    try {
      const fileContent = await fs.readFile(filePath, 'utf8')
      const parsed = JSON.parse(fileContent)
      
      // Migrazione al volo dal vecchio formato (links) al nuovo (buttons)
      if (parsed.links && !parsed.buttons) {
        parsed.buttons = [
          { id: 'spotify', label: 'Listen on Spotify', url: parsed.links.spotify || '', icon: 'Headphones', color: '#1DB954', isPrimary: true },
          { id: 'apple', label: 'Apple Music', url: parsed.links.appleMusic || '', icon: 'Apple', color: '#FA243C', isPrimary: false },
          { id: 'youtube', label: 'Watch on YouTube', url: parsed.links.youtube || '', icon: 'Youtube', color: '#FF0000', isPrimary: false },
          { id: 'instagram', label: 'Follow on Instagram', url: parsed.links.instagram || '', icon: 'Instagram', color: '#E1306C', isPrimary: false },
        ]
        delete parsed.links
      }
      
      config = parsed as Config
      // Salva automaticamente la vecchia configurazione sul nuovo database
      await redis.set('grim_config', config)
      
    } catch (error) {
      // 3. Se anche il file locale fallisce, usa il Fallback di base
      config = {
        artistName: 'Laki',
        songTitle: 'PEZZI PEZZOTTI',
        metaPixelId: '123456789098765',
        coverImageUrl: '/laki-cover.png',
        theme: { backgroundColor: '#0b0f19', accentColor: '#8b5cf6' },
        buttons: [
          { id: 'btn-1', label: 'Listen on Spotify', url: '', icon: 'Headphones', color: '#1DB954', isPrimary: true }
        ],
      }
    }
  }

  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  const isAuthenticated = session && session.value === 'authenticated'

  return (
    <div className="min-h-screen bg-[#030008] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-thin tracking-widest mb-8 text-center [text-shadow:0_0_15px_rgba(255,255,255,0.5)]">
          GRIM UNIVERSE - ADMIN
        </h1>
        {isAuthenticated ? (
          <AdminForm initialConfig={config} />
        ) : (
          <AdminLogin />
        )}
      </div>
    </div>
  )
}
