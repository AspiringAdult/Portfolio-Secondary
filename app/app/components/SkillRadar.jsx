'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { DATA_STREAMS, LANGUAGES, SKILLS } from '@/components/portfolio/data'

const FILTERS = ['ALL', 'CODE', 'DATA', 'DOMAIN', 'FRAMEWORKS', 'ENGINEERING']
const COLORS = { Code: '#22d3ee', Data: '#d946ef', Domain: '#f59e0b', Frameworks: 'rgba(255,255,255,.65)', Engineering: 'rgba(255,255,255,.65)' }

function useInViewOnce() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.25 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, visible]
}

function polar(index, total, radius) {
  const angle = -Math.PI / 2 + (index / total) * Math.PI * 2
  return [250 + Math.cos(angle) * radius, 250 + Math.sin(angle) * radius]
}

function SkillProgressBars() {
  const [ref, visible] = useInViewOnce()
  const [open, setOpen] = useState(() => new Set(['Code', 'Data', 'Domain', 'Frameworks', 'Engineering']))
  const groups = useMemo(() => Object.groupBy ? Object.groupBy(SKILLS, (skill) => skill.group) : SKILLS.reduce((acc, skill) => ({ ...acc, [skill.group]: [...(acc[skill.group] || []), skill] }), {}), [])

  const toggle = (group) => {
    setOpen((current) => {
      const next = new Set(current)
      if (next.has(group)) next.delete(group)
      else next.add(group)
      return next
    })
  }

  return (
    <div ref={ref} className="mt-6 space-y-3">
      {Object.entries(groups).map(([group, skills]) => (
        <div key={group} className="glass rounded">
          <button type="button" onClick={() => toggle(group)} className="flex w-full items-center justify-between px-4 py-3 font-mono text-xs text-white/75">
            <span>{group.toUpperCase()}</span>
            <span>{open.has(group) ? '-' : '+'}</span>
          </button>
          <div className={`overflow-hidden transition-[max-height] duration-500 ${open.has(group) ? 'max-h-96' : 'max-h-0'}`}>
            <div className="space-y-4 px-4 pb-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="mb-1 flex justify-between font-mono text-sm text-white/75">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="h-1.5 rounded bg-white/10">
                    <div
                      className="skill-fill relative h-full rounded"
                      style={{ width: visible ? `${skill.level}%` : 0, background: COLORS[skill.group], '--spark-color': COLORS[skill.group] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function DiagnosticsPanel() {
  const [ref, visible] = useInViewOnce()
  return (
    <div ref={ref} className="glass-magenta hud-corner rounded p-5">
      <div className="font-mono text-[10px] tracking-widest text-cyan-300">// SYSTEM DIAGNOSTICS</div>
      <div className="mt-5 space-y-5">
        {DATA_STREAMS.map((stream) => {
          const dash = 2 * Math.PI * 26
          return (
            <div key={stream.label} className="flex items-center gap-4">
              <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="5" />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="5"
                  strokeDasharray={dash}
                  strokeDashoffset={visible ? dash - (dash * stream.value) / 100 : dash}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-3 text-sm text-white/80">
                  <span>{stream.label}</span>
                  <span className="font-mono text-cyan-200">{visible ? stream.value : 0}%</span>
                </div>
                <div className="mt-1 font-mono text-xs text-white/45">{stream.detail}</div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        {LANGUAGES.map((language, index) => (
          <div key={language.name} className="glass rounded px-3 py-2 font-mono text-[10px] text-white/75" style={{ transitionDelay: `${index * 120}ms` }}>
            {language.name === 'Bengali' ? 'BD' : language.name === 'English' ? 'GB' : 'IN'} / {language.name.toUpperCase()} / {language.level}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SkillRadar() {
  const [filter, setFilter] = useState('ALL')
  const [progress, setProgress] = useState(0)
  const [tip, setTip] = useState(null)

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const animate = (time) => {
      const t = Math.min(1, (time - start) / 1500)
      setProgress(1 - (1 - t) ** 3)
      if (t < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  const values = SKILLS.map((skill) => (filter === 'ALL' || skill.group.toUpperCase() === filter ? skill.level : 25) * progress)
  const points = values.map((value, index) => polar(index, SKILLS.length, (value / 100) * 180).join(',')).join(' ')

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]">
      <div>
        <div className="glass hud-corner rounded p-4">
          <div className="mx-auto max-w-[420px]">
            <svg viewBox="0 0 500 500" className="w-full">
              {[45, 90, 135, 180].map((radius) => (
                <circle key={radius} cx="250" cy="250" r={radius} fill="none" stroke="rgba(34,211,238,.1)" />
              ))}
              {SKILLS.map((skill, index) => {
                const end = polar(index, SKILLS.length, 190)
                const vertex = polar(index, SKILLS.length, (values[index] / 100) * 180)
                return (
                  <g key={skill.name}>
                    <line x1="250" y1="250" x2={end[0]} y2={end[1]} stroke="rgba(34,211,238,.12)" />
                    <text x={end[0]} y={end[1]} textAnchor="middle" fill="rgba(255,255,255,.65)" fontSize="13" fontFamily="JetBrains Mono">
                      {skill.name}
                    </text>
                    <circle
                      cx={vertex[0]}
                      cy={vertex[1]}
                      r="6"
                      fill="#22d3ee"
                      onMouseEnter={() => setTip({ skill, x: vertex[0], y: vertex[1] })}
                      onMouseLeave={() => setTip(null)}
                    />
                  </g>
                )
              })}
              <polygon points={points} fill="rgba(34,211,238,.15)" stroke="#22d3ee" strokeWidth="2" />
              {tip ? (
                <g>
                  <rect x={Math.min(360, tip.x + 10)} y={Math.max(20, tip.y - 34)} width="130" height="34" rx="4" fill="rgba(3,5,10,.92)" stroke="#22d3ee" />
                  <text x={Math.min(370, tip.x + 18)} y={Math.max(42, tip.y - 13)} fill="white" fontSize="11" fontFamily="JetBrains Mono">
                    {tip.skill.name}: {tip.skill.level}%
                  </text>
                </g>
              ) : null}
            </svg>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-widest ${filter === item ? 'glass border-cyan-300 text-cyan-200' : 'border-white/10 text-white/40'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <SkillProgressBars />
      </div>
      <DiagnosticsPanel />
    </div>
  )
}
