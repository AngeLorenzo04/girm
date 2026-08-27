'use client'

import { useState } from 'react'
import { type Config, type CustomButton } from '@/components/ClientPage'
import { saveConfig } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { Trash2, Plus } from 'lucide-react'

const AVAILABLE_ICONS = [
  { value: 'Headphones', label: 'Cuffie (Spotify)' },
  { value: 'Music2', label: 'Nota Musicale' },
  { value: 'Apple', label: 'Apple' },
  { value: 'Play', label: 'Play (Generico)' },
  { value: 'Youtube', label: 'YouTube' },
  { value: 'Camera', label: 'Fotocamera' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Twitter', label: 'X / Twitter' },
  { value: 'Globe', label: 'Mondo (Sito Web)' },
  { value: 'Link', label: 'Link' },
]

export default function AdminForm({ initialConfig }: { initialConfig: Config }) {
  const [config, setConfig] = useState<Config>({
    ...initialConfig,
    buttons: initialConfig.buttons || []
  })
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const result = await saveConfig(config)
    setIsSaving(false)
    if (result.success) {
      alert('Salvato con successo!')
      router.push('/')
    } else {
      alert('Errore durante il salvataggio')
    }
  }

  const handleChange = (field: keyof Config, value: string) => {
    setConfig({ ...config, [field]: value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_SIZE = 600
        
        let width = img.width
        let height = img.height
        
        // Ritaglia in un quadrato perfetto (cover) dal centro
        const size = Math.min(width, height)
        const startX = (width - size) / 2
        const startY = (height - size) / 2

        canvas.width = MAX_SIZE
        canvas.height = MAX_SIZE

        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, startX, startY, size, size, 0, 0, MAX_SIZE, MAX_SIZE)
          const base64 = canvas.toDataURL('image/jpeg', 0.75) // Qualità al 75% per stare sotto i 100kb
          handleChange('coverImageUrl', base64)
        }
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleButtonChange = (id: string, field: keyof CustomButton, value: any) => {
    const updatedButtons = config.buttons.map(btn => {
      if (btn.id === id) {
        let finalValue = value;
        // Estrazione automatica ID Spotify
        if (field === 'url' && typeof value === 'string') {
          const trackMatch = value.match(/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/)
          if (trackMatch && trackMatch[1]) {
            finalValue = `spotify:track:${trackMatch[1]}`
          }
        }
        return { ...btn, [field]: finalValue }
      }
      return btn
    })
    setConfig({ ...config, buttons: updatedButtons })
  }

  const handleAddButton = () => {
    const newBtn: CustomButton = {
      id: `btn-${Date.now()}`,
      label: 'Nuovo Pulsante',
      url: '',
      icon: 'Link',
      color: '#ffffff',
      isPrimary: false
    }
    setConfig({ ...config, buttons: [...config.buttons, newBtn] })
  }

  const handleRemoveButton = (id: string) => {
    setConfig({ ...config, buttons: config.buttons.filter(b => b.id !== id) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
      
      {/* SEZIONE INFORMAZIONI */}
      <div className="space-y-4">
        <h2 className="text-xl font-light border-b border-white/20 pb-2">Informazioni Singolo</h2>
        
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/70 mb-2">Nome Artista</label>
          <input 
            type="text" 
            value={config.artistName}
            onChange={(e) => handleChange('artistName', e.target.value)}
            className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-white/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-white/70 mb-2">Titolo Brano</label>
          <input 
            type="text" 
            value={config.songTitle}
            onChange={(e) => handleChange('songTitle', e.target.value)}
            className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-white/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-white/70 mb-2">Copertina</label>
          <div className="flex items-center gap-4">
            {config.coverImageUrl && (
              <img 
                src={config.coverImageUrl} 
                alt="Preview" 
                className="w-24 h-24 rounded-lg object-cover border border-white/20 shadow-lg" 
              />
            )}
            <div className="flex-1">
              <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                <span className="text-sm font-medium text-white/80">
                  {config.coverImageUrl?.startsWith('data:image') ? 'Cambia Immagine...' : 'Carica Immagine...'}
                </span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
              </label>
              <p className="text-[10px] text-white/40 mt-2 uppercase tracking-widest">
                La foto verrà automaticamente ritagliata a 600x600 e compressa.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-white/70 mb-2">Meta Pixel ID (Opzionale)</label>
          <input 
            type="text" 
            placeholder="Es. 123456789098765"
            value={config.metaPixelId}
            onChange={(e) => handleChange('metaPixelId', e.target.value)}
            className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-white/50 transition-colors"
          />
        </div>
      </div>

      {/* SEZIONE BOTTONI DINAMICI */}
      <div className="space-y-4 pt-6">
        <h2 className="text-xl font-light border-b border-white/20 pb-2 flex justify-between items-center">
          <span>Gestione Pulsanti</span>
        </h2>
        
        <div className="space-y-6">
          {config.buttons.map((btn, index) => (
            <div key={btn.id} className="p-4 bg-black/40 rounded-xl border border-white/10 relative group">
              
              <button 
                type="button" 
                onClick={() => handleRemoveButton(btn.id)}
                className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Elimina pulsante"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">Testo Bottone</label>
                  <input 
                    type="text" 
                    value={btn.label}
                    onChange={(e) => handleButtonChange(btn.id, 'label', e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded p-2 text-sm text-white focus:outline-none focus:border-white/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">Link Destinazione</label>
                  <input 
                    type="text" 
                    value={btn.url}
                    onChange={(e) => handleButtonChange(btn.id, 'url', e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded p-2 text-sm text-white focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">Icona</label>
                  <select 
                    value={btn.icon}
                    onChange={(e) => handleButtonChange(btn.id, 'icon', e.target.value)}
                    className="w-full bg-[#151515] border border-white/20 rounded p-2 text-sm text-white focus:outline-none focus:border-white/50"
                  >
                    {AVAILABLE_ICONS.map(icon => (
                      <option key={icon.value} value={icon.value}>{icon.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">Colore LED</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="color" 
                      value={btn.color}
                      onChange={(e) => handleButtonChange(btn.id, 'color', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <span className="text-xs font-mono opacity-50">{btn.color}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end h-full mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={btn.isPrimary}
                      onChange={(e) => handleButtonChange(btn.id, 'isPrimary', e.target.checked)}
                      className="w-4 h-4 rounded bg-black/50 border-white/20 text-white accent-white"
                    />
                    <span className="text-xs uppercase tracking-widest text-white/70">Tasto Principale?</span>
                  </label>
                </div>
              </div>

            </div>
          ))}
        </div>

        <button 
          type="button" 
          onClick={handleAddButton}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 border border-dashed border-white/20 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Plus className="w-5 h-5" /> Aggiungi Nuovo Pulsante
        </button>
      </div>

      <button 
        type="submit" 
        disabled={isSaving}
        className="w-full bg-white text-black font-bold py-4 rounded-lg mt-8 hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {isSaving ? 'Salvataggio...' : 'SALVA TUTTE LE MODIFICHE'}
      </button>

    </form>
  )
}
