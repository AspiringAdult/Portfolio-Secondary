'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const SPIDER_LINES = {
  hero: 'With great power comes great... portfolio!',
  shadow: "AI consciousness? Even I'm not sure I'm conscious sometimes.",
  web: 'Trading bots? My Spidey-sense says... BUY!',
  cyber: 'VPN in Java? I protect my identity too, trust me.',
  data: "More charts than villains I've fought. Respect.",
  archive: '7 certs?! Even Tony Stark is impressed.',
  contact: 'Shoot your shot! I shoot webs, you shoot emails.',
}

const BAT_LINES = {
  hero: "I'm Batman. And this... is Kingslayer.",
  shadow: "Genesis Syndicate. I've studied it. Impressive architecture.",
  web: 'Algorithmic trading. I fund the cave with similar systems.',
  cyber: 'Nightshade VPN. I approve of protecting your identity.',
  data: "Power BI. Alfred uses this. Don't tell him I told you.",
  archive: 'IBM. EC-Council. Duke. This man trains like me.',
  contact: "The signal has been sent. They'll find you.",
}

function Speech({ children, side }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 8 }}
      className={`absolute top-1/2 -translate-y-1/2 w-56 glass rounded p-3 font-mono text-[11px] leading-relaxed text-white/85 ${
        side === 'left' ? 'left-16' : 'right-16'
      }`}
    >
      {children}
    </motion.div>
  )
}

function SpiderMan({ activeSector, onHide }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="companion companion-spider"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button type="button" className="companion-close" onClick={onHide} aria-label="Hide companions">
        x
      </button>
      <svg viewBox="0 0 70 90" className="h-12 w-12 lg:h-16 lg:w-16">
        <line x1="35" y1="0" x2="35" y2="24" stroke="white" strokeWidth="1" />
        <circle cx="35" cy="34" r="15" fill="#dc2626" />
        <ellipse cx="29" cy="32" rx="5" ry="7" fill="white" />
        <ellipse cx="41" cy="32" rx="5" ry="7" fill="white" />
        <rect x="24" y="48" width="22" height="18" rx="8" fill="#dc2626" />
        <path d="M28 66 20 84M42 66 50 84" stroke="#2563eb" strokeWidth="8" strokeLinecap="round" />
      </svg>
      <AnimatePresence>{hovered ? <Speech side="left">{SPIDER_LINES[activeSector] || SPIDER_LINES.hero}</Speech> : null}</AnimatePresence>
    </div>
  )
}

function Batman({ activeSector, onHide }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div className="companion companion-bat" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <button type="button" className="companion-close" onClick={onHide} aria-label="Hide companions">
        x
      </button>
      <svg viewBox="0 0 80 90" className="h-16 w-16">
        <path className="bat-cape" d="M6 82 C18 30 30 62 40 20 C50 62 62 30 74 82 C54 70 26 70 6 82Z" fill="#111827" />
        <path d="M28 32 L34 12 L40 28 L46 12 L52 32 Q40 45 28 32Z" fill="#27272a" />
        <ellipse cx="35" cy="31" rx="4" ry="2.2" fill="white" />
        <ellipse cx="45" cy="31" rx="4" ry="2.2" fill="white" />
        <rect x="31" y="48" width="18" height="24" rx="6" fill="#1f2937" />
        <rect x="30" y="58" width="20" height="4" fill="#facc15" />
      </svg>
      <AnimatePresence>{hovered ? <Speech side="right">{BAT_LINES[activeSector] || BAT_LINES.hero}</Speech> : null}</AnimatePresence>
    </div>
  )
}

export default function HeroCompanions({ activeSector }) {
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    setHidden(window.localStorage.getItem('companions_hidden') === 'true')
  }, [])

  const hide = () => {
    window.localStorage.setItem('companions_hidden', 'true')
    setHidden(true)
  }

  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => {
          window.localStorage.removeItem('companions_hidden')
          setHidden(false)
        }}
        className="fixed bottom-4 left-4 z-40 hidden sm:inline-flex glass rounded px-3 py-2 font-mono text-[10px] tracking-widest text-cyan-100"
      >
        SHOW COMPANIONS
      </button>
    )
  }

  return (
    <>
      <SpiderMan activeSector={activeSector} onHide={hide} />
      <div className="hidden lg:block">
        <Batman activeSector={activeSector} onHide={hide} />
      </div>
    </>
  )
}
