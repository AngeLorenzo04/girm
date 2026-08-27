'use client'

import { useState } from 'react'
import { login } from '@/app/actions'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(password)
    setIsLoading(false)

    if (result.success) {
      // Ricarica la pagina per far leggere il cookie al Server Component
      router.refresh() 
    } else {
      setError(result.error || 'Errore di accesso')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center pt-20">
      <div className="w-full max-w-sm bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
        <h2 className="text-2xl font-light text-center mb-6">Accesso Admin</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="password" 
              placeholder="Inserisci la password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white text-center focus:outline-none focus:border-white/50 transition-colors"
            />
          </div>
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={isLoading || !password}
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Accesso...' : 'ENTRA'}
          </button>
        </form>
      </div>
    </div>
  )
}
