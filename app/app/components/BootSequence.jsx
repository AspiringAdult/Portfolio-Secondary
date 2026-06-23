'use client'

import { useEffect, useMemo, useState } from 'react'

const LINES = [
  '> INITIALIZING MULTIVERSE PROTOCOL...',
  '> LOADING SECTOR DATA............[OK]',
  '> CONNECTING INTELLIGENCE GRID...[OK]',
  '> IDENTITY: DIPTANGKUSH DAS // KINGSLAYER',
  '> CLEARANCE LEVEL: ARCHITECT',
  '> WELCOME TO THE SYSTEM.',
]

export default function BootSequence() {
  const [phase, setPhase] = useState('checking')
  const [lineIndex, setLineIndex] = useState(0)
  const [typed, setTyped] = useState('')

  const reduced = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (window.sessionStorage.getItem('kingslayer_booted') === 'true') {
      setPhase('done')
      return undefined
    }
    if (reduced) {
      window.sessionStorage.setItem('kingslayer_booted', 'true')
      setPhase('done')
      return undefined
    }

    setPhase('heroes')
    const terminalTimer = window.setTimeout(() => setPhase('terminal'), 3000)
    return () => window.clearTimeout(terminalTimer)
  }, [reduced])

  useEffect(() => {
    if (phase !== 'terminal') return undefined
    const current = LINES[lineIndex]
    if (!current) {
      const exitTimer = window.setTimeout(() => setPhase('exit'), 500)
      return () => window.clearTimeout(exitTimer)
    }

    if (typed.length < current.length) {
      const timer = window.setTimeout(() => setTyped(current.slice(0, typed.length + 1)), 80)
      return () => window.clearTimeout(timer)
    }

    const nextTimer = window.setTimeout(() => {
      setLineIndex((value) => value + 1)
      setTyped('')
    }, 220)
    return () => window.clearTimeout(nextTimer)
  }, [lineIndex, phase, typed])

  useEffect(() => {
    if (phase !== 'exit') return undefined
    window.sessionStorage.setItem('kingslayer_booted', 'true')
    const doneTimer = window.setTimeout(() => setPhase('done'), 900)
    return () => window.clearTimeout(doneTimer)
  }, [phase])

  const skip = () => {
    window.sessionStorage.setItem('kingslayer_booted', 'true')
    setPhase('exit')
  }

  if (phase === 'checking' || phase === 'done') return null

  return (
    <div className={`boot-overlay ${phase === 'exit' ? 'boot-exit' : ''}`} aria-live="polite">
      <button type="button" onClick={skip} className="boot-skip glass">
        SKIP
      </button>

      <div className="boot-scanlines" />

      <div className="spider-run text-cyan-300" aria-hidden="true">
        <svg viewBox="0 0 120 90" className="hero-svg">
          <line x1="12" y1="0" x2="44" y2="28" stroke="white" strokeWidth="1" opacity=".65" />
          <line x1="0" y1="16" x2="44" y2="28" stroke="white" strokeWidth="1" opacity=".35" />
          <circle cx="50" cy="34" r="12" fill="currentColor" />
          <ellipse cx="66" cy="52" rx="18" ry="12" fill="currentColor" />
          <path d="M45 50 25 66M54 55 36 82M72 52 96 68M76 60 108 82" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          <path d="M44 31 36 28M56 31 64 28" stroke="#03050a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="bat-glide text-amber-200" aria-hidden="true">
        <svg viewBox="0 0 140 100" className="hero-svg bat-svg">
          <path d="M20 50 C38 12 52 34 62 12 L70 34 L78 12 C88 34 102 12 120 50 C98 38 90 72 70 78 C50 72 42 38 20 50Z" fill="currentColor" />
          <path d="M56 34 L62 18 L69 34 L76 18 L84 34 Q70 48 56 34Z" fill="#111827" />
          <ellipse cx="64" cy="36" rx="4" ry="2" fill="white" />
          <ellipse cx="76" cy="36" rx="4" ry="2" fill="white" />
        </svg>
      </div>

      {phase === 'terminal' ? (
        <div className="boot-terminal glass hud-corner">
          {LINES.slice(0, lineIndex).map((line) => (
            <div key={line}>{line}</div>
          ))}
          {lineIndex < LINES.length ? (
            <div>
              {typed}
              <span className="text-cyan-300 animate-pulse">|</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
