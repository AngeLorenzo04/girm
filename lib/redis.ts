import { Redis } from '@upstash/redis'

// Crea e asporta una singola istanza globale di Redis
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})
