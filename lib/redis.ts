import { Redis } from '@upstash/redis'

const getEnv = (key: string) => {
  const val = process.env[key] || ''
  // Rimuove eventuali virgolette singole o doppie incollate per sbaglio
  return val.replace(/^["']|["']$/g, '')
}

// Crea e asporta una singola istanza globale di Redis
export const redis = new Redis({
  url: getEnv('UPSTASH_REDIS_REST_URL') || 'https://dummy.upstash.io',
  token: getEnv('UPSTASH_REDIS_REST_TOKEN') || 'dummy',
})
