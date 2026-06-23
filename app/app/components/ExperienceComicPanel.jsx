'use client'

import { motion } from 'framer-motion'
import { EXPERIENCE } from '@/components/portfolio/data'

const THEMES = [
  { accent: '#22d3ee', gradient: 'linear-gradient(135deg,#22d3ee,#0e7490)', metric: 'SAVED ~3HRS/DAY THROUGH AUTOMATION', from: { x: -60, y: 0 } },
  { accent: '#d946ef', gradient: 'linear-gradient(135deg,#d946ef,#7e22ce)', metric: 'BUGS CRUSHED: COUNTLESS', from: { x: 0, y: -60 } },
  { accent: '#f59e0b', gradient: 'linear-gradient(135deg,#f59e0b,#92400e)', metric: 'SMART CONTRACTS DEPLOYED: PRODUCTION READY', from: { x: 60, y: 0 } },
]

export default function ExperienceComicPanel() {
  return (
    <div>
      <div className="mb-5 hidden grid-cols-3 overflow-hidden rounded border border-white/10 lg:grid">
        {EXPERIENCE.map((entry, index) => (
          <div key={entry.company} className="h-1.5" style={{ background: THEMES[index].accent }} />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {EXPERIENCE.map((entry, index) => {
          const theme = THEMES[index]
          return (
            <motion.article
              key={entry.company}
              initial={{ opacity: 0, ...theme.from }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: index * 0.2, ease: 'easeOut' }}
              className="comic-panel relative overflow-hidden rounded border border-white/10 bg-black/45"
              style={{ '--accent': theme.accent }}
            >
              <div className="comic-burst" />
              <div className="relative h-[70px] p-4" style={{ background: theme.gradient }}>
                <div className="halftone" />
                <div className="relative z-10 flex items-start justify-between gap-3">
                  <span className="font-mono text-xs text-white/70">CHAPTER {String(index + 1).padStart(2, '0')}</span>
                  <span className="text-right font-display font-bold text-white">{entry.company}</span>
                </div>
              </div>
              <div className="relative z-10 p-5">
                <h3 className="font-display text-xl font-bold" style={{ color: theme.accent }}>{entry.title}</h3>
                <div className="mt-3 inline-flex rounded-full border border-white/15 px-3 py-1 font-mono text-xs text-white/65">{entry.dates}</div>
                <div className="mt-5 space-y-3">
                  {entry.points.map((point) => (
                    <div key={point} className="border-l-[3px] bg-white/[.03] p-3 text-sm leading-relaxed text-white/85" style={{ borderColor: theme.accent }}>
                      <span style={{ color: theme.accent }}>◆</span> {point}
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded bg-white/[.04] px-3 py-2 font-mono text-[10px] tracking-widest" style={{ color: theme.accent }}>
                  {theme.metric}
                </div>
              </div>
            </motion.article>
          )
        })}
      </div>
    </div>
  )
}
