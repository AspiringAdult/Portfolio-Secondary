'use client'

import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { CERTIFICATIONS, EDUCATION } from '@/components/portfolio/data'

const TAG_COLORS = { CYBER: '#22d3ee', AI: '#d946ef', WEB3: '#f59e0b', SCI: '#4ade80', OPS: '#fb923c' }

const CertTile = forwardRef(function CertTile({ cert, index }, ref) {
  const [style, setStyle] = useState({})
  const color = TAG_COLORS[cert.tag] || '#22d3ee'
  const move = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const rotateY = ((x / rect.width) - 0.5) * -8
    const rotateX = ((y / rect.height) - 0.5) * 8
    setStyle({
      transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`,
      '--glare-x': `${x}px`,
      '--glare-y': `${y}px`,
    })
  }
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      onMouseMove={move}
      onMouseLeave={() => setStyle({})}
      className="cert-tile group"
      style={{ ...style, '--tag-color': color, background: `radial-gradient(circle at center, ${color}18, transparent 68%)` }}
    >
      <div className="cert-glare" />
      <div className="h-0.5 w-full" style={{ background: color }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold leading-tight text-white">{cert.name}</h3>
          <span className="font-mono text-[10px]" style={{ color }}>{cert.tag}</span>
        </div>
        <div className="mt-2 font-mono text-xs" style={{ color }}>{cert.org}</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {cert.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-white/55">
              {skill}
            </span>
          ))}
        </div>
        <p className="cert-summary mt-3 text-sm leading-relaxed text-white/70">{cert.summary}</p>
      </div>
    </motion.div>
  )
})

function EducationTimeline() {
  return (
    <div className="relative mt-12 pl-8">
      <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-cyan-400 to-fuchsia-400" />
      <div className="space-y-5">
        {EDUCATION.map((entry, index) => {
          const progress = entry.status.toLowerCase().includes('progress')
          return (
            <motion.div
              key={`${entry.school}-${entry.degree}`}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="relative glass rounded p-4"
            >
              <span className={`absolute -left-[31px] top-5 h-3 w-3 rounded-full ${progress ? 'bg-amber-300 animate-pulse' : 'bg-cyan-300'}`} />
              <div className="font-display text-base font-bold text-white">{entry.school}</div>
              <div className="mt-1 text-white/70">{entry.degree}</div>
              <div className="mt-2 font-mono text-[10px] tracking-widest text-white/45">
                {entry.dates} / {entry.status}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default function CertWall() {
  const tags = useMemo(() => ['ALL', ...Object.keys(TAG_COLORS)], [])
  const [active, setActive] = useState('ALL')
  const filtered = CERTIFICATIONS.filter((cert) => active === 'ALL' || cert.tag === active)
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const count = tag === 'ALL' ? CERTIFICATIONS.length : CERTIFICATIONS.filter((cert) => cert.tag === tag).length
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setActive(tag)}
              className={`rounded-full border px-3 py-1.5 font-mono text-xs tracking-widest ${active === tag ? 'border-cyan-300 bg-cyan-400/20 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,.25)]' : 'border-white/10 text-white/40'}`}
            >
              {tag} ({count})
            </button>
          )
        })}
      </div>
      <LayoutGroup>
        <motion.div layout className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((cert, index) => <CertTile key={cert.name} cert={cert} index={index} />)}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
      <EducationTimeline />
    </div>
  )
}
