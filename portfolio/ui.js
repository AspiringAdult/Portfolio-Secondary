'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Github, Linkedin, Mail, Phone, Volume2, VolumeX, ChevronDown, FileText } from 'lucide-react'
import { HERO, SECTORS } from './data'

export function TopHUD({ activeSector, sound, toggleSound }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    })

    const updateTime = () => {
      setTime(`${formatter.format(new Date())} UTC`)
    }

    updateTime()
    const intervalId = window.setInterval(updateTime, 1000)
    return () => window.clearInterval(intervalId)
  }, [])

  const sector = SECTORS.find((entry) => entry.id === activeSector) || SECTORS[0]

  return (
    <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="flex items-start justify-between px-4 md:px-8 pt-4">
        <div className="glass hud-corner pointer-events-auto rounded-md px-4 py-2 font-mono text-xs flex items-center gap-3">
          <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
          <span className="text-cyan-200">KINGSLAYER // ONLINE</span>
          <span className="text-white/40">/</span>
          <span className="text-white/60">{time}</span>
        </div>

        <div className="hidden md:block glass hud-corner pointer-events-auto rounded-md px-4 py-2 font-mono text-xs">
          <span className="text-white/40">SECTOR </span>
          <span className="neon-cyan font-bold">{sector.code}</span>
          <span className="text-white/40 mx-2">/</span>
          <span className="text-white">{sector.label}</span>
        </div>

        <button
          type="button"
          onClick={toggleSound}
          className="glass hud-corner pointer-events-auto rounded-md px-3 py-2 font-mono text-xs flex items-center gap-2 hover:border-cyan-400/60 transition"
          aria-label={sound ? 'Mute ambient audio state' : 'Enable ambient audio state'}
        >
          {sound ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          <span className="hidden md:inline">{sound ? 'AMBIENCE' : 'MUTED'}</span>
        </button>
      </div>
    </div>
  )
}

export function SideNavigator({ activeSector, onJump }) {
  return (
    <nav
      className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden sm:block"
      aria-label="Section navigation"
    >
      <ul className="flex flex-col gap-3">
        {SECTORS.map((sector) => {
          const isActive = sector.id === activeSector

          return (
            <li key={sector.id}>
              <button
                type="button"
                onClick={() => onJump(sector.id)}
                className="group flex items-center gap-3"
                aria-current={isActive ? 'true' : undefined}
              >
                <span className="font-mono text-[10px] text-white/40 group-hover:text-cyan-300 transition tabular-nums">
                  {sector.code}
                </span>
                <span
                  className={`relative h-2.5 w-2.5 rounded-full border ${
                    isActive
                      ? 'bg-cyan-300 border-cyan-300 shadow-[0_0_14px_#67e8f9]'
                      : 'bg-transparent border-white/40 group-hover:border-cyan-300'
                  }`}
                >
                  {isActive && <span className="absolute inset-0 rounded-full pulse-ring text-cyan-300" />}
                </span>
                <span
                  className={`font-display text-[10px] tracking-widest ${
                    isActive ? 'text-cyan-200' : 'text-white/40 group-hover:text-white/80'
                  } hidden md:inline`}
                >
                  {sector.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function MissionModal({ data, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!data) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="relative w-full max-w-2xl glass hud-corner rounded-lg p-6 md:p-8"
        onClick={(event) => event.stopPropagation()}
        style={{ borderColor: `${data.color}50` }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white"
          aria-label="Close mission file"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-white/50">
          <span className="text-cyan-300">MISSION FILE</span>
          <span>/</span>
          <span style={{ color: data.color }}>{data.code}</span>
          <span>/</span>
          <span className="text-amber-300">{data.status}</span>
        </div>

        <div className="mt-2 flex items-start gap-3">
          <div className="min-w-12 text-sm font-mono tracking-[0.3em] text-white/50">{data.glyph}</div>
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight" style={{ color: data.color }}>
              {data.name}
            </h3>
            <p className="text-white/60 text-sm md:text-base mt-1">{data.subtitle}</p>
          </div>
        </div>

        <p className="mt-5 text-white/80 leading-relaxed">{data.summary}</p>

        <div className="mt-5">
          <div className="font-mono text-[10px] tracking-widest text-white/50 mb-2">// OBJECTIVES</div>
          <ul className="space-y-1.5">
            {data.objectives.map((objective) => (
              <li key={objective} className="flex gap-2 text-sm text-white/85">
                <span style={{ color: data.color }}>&gt;</span>
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {data.stack.map((item) => (
            <span
              key={item}
              className="font-mono text-[10px] tracking-widest px-2.5 py-1 rounded border border-white/15 text-white/80 bg-white/5"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between font-mono text-[10px] tracking-widest text-white/40">
          <span>// END_TRANSMISSION</span>
          <span>ESC TO CLOSE</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function ScrollHint() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: [0.3, 1, 0.3], y: [0, 6, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 font-mono text-[10px] tracking-widest text-cyan-200/70"
    >
      <span>SCROLL TO ENGAGE</span>
      <ChevronDown className="h-4 w-4" />
    </motion.div>
  )
}

export function SectionHeading({ code, title, accent = 'cyan', sub }) {
  const colorClass =
    accent === 'cyan' ? 'neon-cyan' : accent === 'magenta' ? 'neon-magenta' : 'neon-amber'

  return (
    <div className="max-w-2xl">
      <div className="font-mono text-[10px] tracking-[0.4em] text-white/40">SECTOR_{code}</div>
      <h2 className={`font-display font-black text-3xl md:text-5xl lg:text-6xl mt-2 ${colorClass}`}>{title}</h2>
      {sub ? <p className="mt-3 text-white/60 max-w-xl">{sub}</p> : null}
    </div>
  )
}

export function ContactDeck({ resumeHref }) {
  const items = [
    { icon: Mail, label: HERO.contact.email, href: `mailto:${HERO.contact.email}` },
    { icon: Github, label: 'github.com/AspiringAdult', href: HERO.contact.github },
    { icon: Linkedin, label: 'linkedin.com/in/diptangkush-das-kingslayer', href: HERO.contact.linkedin },
    { icon: Phone, label: HERO.contact.phone, href: `tel:${HERO.contact.phone}` },
  ]

  if (resumeHref) {
    items.push({ icon: FileText, label: 'Open Resume PDF', href: resumeHref })
  }

  return (
    <div className="grid sm:grid-cols-2 gap-3 max-w-xl">
      {items.map(({ icon: Icon, label, href }) => {
        const shouldOpenNewTab = href.startsWith('http') || href.endsWith('.pdf')

        return (
          <a
            key={label}
            href={href}
            {...(shouldOpenNewTab ? { target: '_blank', rel: 'noreferrer' } : {})}
            className="group glass hud-corner rounded-md px-4 py-3 flex items-center gap-3 hover:border-cyan-400/60 transition"
          >
            <div className="h-9 w-9 rounded bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
              <Icon className="h-4 w-4 text-cyan-300" />
            </div>
            <span className="font-mono text-xs text-white/80 truncate group-hover:text-cyan-200">{label}</span>
          </a>
        )
      })}
    </div>
  )
}
