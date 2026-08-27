import ClientPage, { type Config } from '@/components/ClientPage'
import { redis } from '@/lib/redis'

// Forza Next.js a recuperare i dati live invece di usare una versione in cache al momento della build
export const revalidate = 0

export default async function Page() {
  let config: Config | null = null;

  try {
    config = await redis.get<Config>('grim_config')
  } catch (e) {
    console.error('Failed to fetch config from Redis:', e)
  }

  // Fallback se il database è appena stato creato ed è vuoto
  if (!config) {
    config = {
      artistName: 'grim',
      songTitle: 'PEZZI PEZZOTTI',
      metaPixelId: '',
      coverImageUrl: '/laki-cover.png',
      theme: { backgroundColor: '#0b0f19', accentColor: '#8b5cf6' },
      buttons: [
        { id: 'btn-1', label: 'Listen on Spotify', url: '', icon: 'Headphones', color: '#1DB954', isPrimary: true },
        { id: 'btn-2', label: 'Apple Music', url: '', icon: 'Apple', color: '#FA243C', isPrimary: false }
      ],
    }
  }

  return <ClientPage config={config} />
}
