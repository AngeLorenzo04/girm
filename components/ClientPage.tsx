'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import Script from 'next/script'
import { Camera, Headphones, Music2, Play, Link as LinkIcon, Video, MessageSquare, Music, Globe, ChevronDown } from 'lucide-react'

export type CustomButton = {
  id: string
  label: string
  url: string
  icon: string
  color: string
  isPrimary: boolean
}

export type Config = {
  artistName: string
  songTitle: string
  metaPixelId: string
  coverImageUrl: string
  theme: {
    backgroundColor: string;
    accentColor: string;
  }
  buttons: CustomButton[]
}

const IconMap: Record<string, React.ElementType> = {
  Headphones,
  Music2,
  Play,
  Camera,
  Link: LinkIcon,
  Youtube: Video,
  Instagram: Camera,
  Twitter: MessageSquare,
  Apple: Music,
  Globe
}

// Helper per convertire HEX in RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ?
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '255, 255, 255';
}

// Generatore pseudo-casuale deterministico per evitare errori di idratazione
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const generateStarShadows = (count: number, maxRadius: number, seedOffset: number) => {
  let shadows = [];
  for (let i = 0; i < count; i++) {
    const x = seededRandom(i + seedOffset) * 100;
    const y = seededRandom(i + seedOffset + 1000) * 100;
    const radius = seededRandom(i + seedOffset + 2000) * maxRadius;
    const opacity = seededRandom(i + seedOffset + 3000) * 0.8 + 0.2;
    shadows.push(`${x}vw ${y}vh 0 ${radius}px rgba(255, 255, 255, ${opacity})`);
  }
  return shadows.join(', ');
}

const smallStars = generateStarShadows(150, 0.5, 0);
const mediumStars = generateStarShadows(75, 1, 5000);
const largeStars = generateStarShadows(25, 1.5, 10000);

const comets = [
  { top: 10, left: -10, delay: 1, duration: 4, width: 80, rotate: 35, dx: 1228, dy: 860 },
  { top: 30, left: -20, delay: 3, duration: 3, width: 60, rotate: 20, dx: 1409, dy: 513 },
];

export default function ClientPage({ config }: { config: Config }) {
  const { scrollYProgress } = useScroll()

  // Il ragazzo cade più lentamente, spalmando l'animazione sull'80% dello scroll
  const boyY = useTransform(scrollYProgress, [0, 0.8], ['-40vh', '150vh'])
  const boyScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.5])
  const boyOpacity = useTransform(scrollYProgress, [0, 0.7, 0.8], [1, 1, 0])

  // Le info appaiono con un fade-in non appena la caduta finisce (0.81)
  const [infoVisible, setInfoVisible] = useState(false)
  
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.81 && !infoVisible) {
      setInfoVisible(true)
    }
  })
  
  // Scroll indicator fades out immediately
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  function handleRedirect(platform: string, url: string) {
    console.log("fbq('track', 'Lead', { content_name: platform, song: config.songTitle })", {
      metaPixelId: config.metaPixelId,
    })
    window.setTimeout(() => {
      window.location.href = url
    }, 100)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Se i bottoni non sono ancora definiti (fallback vecchio), mostriamo niente per evitare crash prima del salvataggio
  const buttonsToRender = Array.isArray(config.buttons) ? config.buttons : [];

  const pixelId = config.metaPixelId || '1055973320477956';

  return (
    <>
      {/* === META PIXEL CODE === */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img 
          height="1" 
          width="1" 
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>

      <div className="relative flex min-h-[100dvh] w-full flex-col bg-[#000]">
      
      {/* === 0. UNIVERSE E BACKGROUND EFFECTS STICKY SU TUTTA LA PAGINA === */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#030008]">
          <div
            className="absolute inset-0 opacity-80 mix-blend-screen bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05010a]/50 to-[#030008] opacity-90" />

          <div suppressHydrationWarning className="absolute top-0 left-0 w-[1px] h-[1px] rounded-full transform-gpu will-change-transform" style={{ boxShadow: smallStars }} />
          <div suppressHydrationWarning className="absolute top-0 left-0 w-[1px] h-[1px] rounded-full transform-gpu will-change-transform" style={{ boxShadow: mediumStars }} />
          <div suppressHydrationWarning className="absolute top-0 left-0 w-[1px] h-[1px] rounded-full transform-gpu will-change-transform" style={{ boxShadow: largeStars }} />

          {comets.map((comet, i) => (
            <motion.div
              key={`comet-${i}`}
              className="absolute h-[1px] origin-right bg-gradient-to-r from-transparent via-cyan-200 to-white"
              style={{
                top: `${comet.top}%`,
                left: `${comet.left}%`,
                width: `${comet.width}px`,
                rotate: `${comet.rotate}deg`,
              }}
              animate={{
                x: [0, comet.dx],
                y: [0, comet.dy],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: comet.duration,
                repeat: Infinity,
                delay: comet.delay,
                ease: 'linear',
              }}
            />
          ))}

          <motion.div
            className="absolute -left-24 top-20 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0%,transparent_60%)] transform-gpu will-change-transform"
            animate={{ x: [0, 45, 0], y: [0, -25, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -right-32 top-1/3 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1)_0%,transparent_60%)] transform-gpu will-change-transform"
            animate={{ x: [0, -35, 0], y: [0, 30, 0], scale: [1, 1.18, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,rgba(255,255,255,.5)_0_1px,transparent_1px),radial-gradient(circle_at_70%_60%,rgba(255,255,255,.35)_0_1px,transparent_1px)] [background-size:140px_140px,210px_210px]" />
        </div>
      </div>

      {/* === 2. BOY LAYER (z-20) === */}
      <motion.div
        className="pointer-events-none fixed left-1/2 top-0 z-20 flex items-center justify-center transform-gpu will-change-transform"
        style={{ x: '-50%', y: boyY, scale: boyScale, opacity: infoVisible ? 0 : boyOpacity }}
      >
          <motion.div
            animate={{
              x: [-15, 25, -20, 10, -15],
              rotate: [-5, 12, -8, 15, -5]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img src="/costa_che_cade.png" alt="Costa che cade" className="w-[35dvh] max-w-[250px] object-contain opacity-90" />
          </motion.div>
      </motion.div>

      {/* === SCROLL INDICATOR === */}
      <motion.div 
        className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center opacity-70 z-40 pointer-events-none"
        style={{ opacity: infoVisible ? 0 : indicatorOpacity }}
      >
        <span className="text-xs uppercase tracking-widest text-white/70 mb-2 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">scorri per entrare nel mio universo</span>
        <ChevronDown className="size-5 text-white animate-bounce drop-shadow-md" />
      </motion.div>

      {/* === 3. PRESENTATION CONTENT === */}
      <motion.div 
        className="fixed inset-0 z-30 flex flex-col overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: infoVisible ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ pointerEvents: infoVisible ? 'auto' : 'none' }}
      >
        <main
          className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-4"
          style={{ 
            paddingTop: 'max(4dvh, env(safe-area-inset-top))', 
            paddingBottom: 'max(4dvh, env(safe-area-inset-bottom))' 
          }}
        >
          <div className="relative mx-auto flex w-full max-w-md flex-col items-center my-auto">
            <header className="flex items-center justify-center mb-[3dvh]">
              <span className="text-[2dvh] sm:text-xl font-extralight tracking-[0.35em] text-white [text-shadow:0_0_20px_rgba(255,255,255,0.6),0_0_40px_rgba(255,255,255,0.4)]">GRIM UNIVERSE</span>
            </header>

            <section className="flex w-full flex-col items-center justify-center" aria-labelledby="release-title">
              <div className="relative">
                <div className="absolute -inset-5 rounded-2xl bg-violet-500/10 blur-3xl" />
                <img 
                  src={config.coverImageUrl} 
                  alt={`${config.artistName} — ${config.songTitle} cover art`} 
                  className="relative aspect-square w-[22dvh] min-w-[140px] max-w-[240px] rounded-xl object-cover shadow-[0_0_60px_rgba(139,92,246,0.3)] ring-1 ring-white/10" 
                />
              </div>

              <div className="mt-[3dvh] text-center">
                <p className="mb-[1dvh] text-[clamp(10px,1.2dvh,14px)] font-light uppercase tracking-[0.3em] text-white/70">New release</p>
                <h1 id="release-title" className="text-[clamp(24px,3.5dvh,40px)] font-medium tracking-[0.15em] text-white [text-shadow:0_0_15px_rgba(255,255,255,0.8),0_0_30px_rgba(255,255,255,0.3)] leading-tight">{config.songTitle}</h1>
                <p className="mt-[1dvh] text-[clamp(14px,2dvh,24px)] font-light tracking-[0.2em] text-white/80 [text-shadow:0_0_10px_rgba(255,255,255,0.4)]">{config.artistName}</p>
              </div>

              <div className="mt-[4dvh] flex w-full flex-col gap-[clamp(12px,1.5dvh,24px)]">
                {buttonsToRender.map((btn) => {
                  const Icon = IconMap[btn.icon] || LinkIcon;
                  const rgb = hexToRgb(btn.color);
                  const dynamicClassName = `dynamic-btn-${btn.id}`;

                  return (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => handleRedirect(btn.id, btn.url)}
                      className={`group relative flex h-[clamp(50px,7.5dvh,75px)] w-full items-center justify-between overflow-hidden rounded-xl bg-black/70 backdrop-blur-md px-[clamp(16px,2dvw,24px)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.97] border-2 ${dynamicClassName}`}
                    >
                      <style dangerouslySetInnerHTML={{
                        __html: `
                        .${dynamicClassName} {
                          border-color: ${btn.color};
                          box-shadow: 0 0 15px rgba(${rgb}, 0.6), inset 0 0 10px rgba(${rgb}, 0.2);
                        }
                        .${dynamicClassName}:hover {
                          box-shadow: 0 0 35px rgba(${rgb}, 1), inset 0 0 20px rgba(${rgb}, 0.6);
                          background-color: rgba(${rgb}, 0.1);
                        }
                      `}} />

                      <div className="z-10 flex items-center gap-3 sm:gap-4">
                        <Icon
                          className="size-[clamp(20px,2.8dvh,32px)] transition-colors duration-300"
                          strokeWidth={2.5}
                          style={{ color: btn.color }}
                        />
                        <span
                          className="text-[clamp(11px,1.6dvh,16px)] font-medium tracking-[0.2em] sm:tracking-[0.25em] uppercase [text-shadow:0_0_10px_rgba(255,255,255,0.5)] text-white/90"
                        >
                          {btn.label}
                        </span>
                      </div>
                      {btn.isPrimary && (
                        <div className="z-10 flex size-[clamp(30px,4dvh,45px)] items-center justify-center rounded-full bg-white/20 transition-all duration-300 group-hover:bg-white group-hover:shadow-[0_0_15px_white]">
                          <Play className="size-[clamp(14px,2dvh,20px)] fill-black text-black ml-0.5" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </section>

            <footer className="mt-[5dvh] text-center text-[clamp(10px,1.2dvh,14px)] font-light uppercase tracking-[0.3em] text-muted-foreground/60">Press play. Enter the void.</footer>
          </div>
        </main>
      </motion.div>

      {/* Invisibile scroll area per permettere l'animazione di scorrimento */}
      <div className="h-[300vh] w-full pointer-events-none" />
    </div>
    </>
  )
}
