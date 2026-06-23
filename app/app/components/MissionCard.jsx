'use client'

import { useEffect, useRef, useState } from 'react'

function NeuralCanvas({ active }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    let raf = 0
    let nodes = []
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      nodes = Array.from({ length: 20 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }))
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = active ? 0.7 : 0.42
      nodes.forEach((node) => {
        node.x = (node.x + node.vx + canvas.width) % canvas.width
        node.y = (node.y + node.vy + canvas.height) % canvas.height
        ctx.fillStyle = '#d946ef'
        ctx.beginPath()
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i]
          const b = nodes[j]
          if (Math.hypot(a.x - b.x, a.y - b.y) < 80) {
            ctx.strokeStyle = '#22d3ee'
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [active])
  return <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-70" />
}

function MatrixCanvas({ active }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    let raf = 0
    let drops = []
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      drops = Array.from({ length: Math.ceil(canvas.width / 14) }, () => Math.random() * canvas.height)
    }
    const draw = () => {
      ctx.fillStyle = active ? 'rgba(0,0,0,.18)' : 'rgba(0,0,0,.28)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = '12px JetBrains Mono'
      ctx.fillStyle = active ? 'rgba(74,222,128,.35)' : 'rgba(74,222,128,.18)'
      drops.forEach((y, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 14, y)
        drops[i] = y > canvas.height && Math.random() > 0.96 ? 0 : y + 12
      })
      raf = requestAnimationFrame(draw)
    }
    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [active])
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />
}

function BinaryColumns() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 font-mono text-cyan-200">
      {[0, 1, 2].map((col) => (
        <div key={col} className="binary-column" style={{ left: `${15 + col * 30}%`, animationDuration: `${8 + col * 3}s` }}>
          {'010110100111001101010011001011010'.repeat(8)}
        </div>
      ))}
    </div>
  )
}

function ChartSvg({ type }) {
  if (type === 'tradebot') {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 400 300">
        {Array.from({ length: 8 }).map((_, index) => (
          <rect key={index} className="candle-bar" x={38 + index * 42} y={80} width="18" height={120} rx="3" fill="#d946ef" style={{ animationDelay: `${index * 180}ms` }} />
        ))}
      </svg>
    )
  }
  return (
    <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 400 300">
      <path className="dash-line" d="M20 210 C80 80 120 240 180 130 S300 70 380 150" fill="none" stroke="#22d3ee" strokeWidth="3" />
    </svg>
  )
}

function ProjectBackground({ id, active }) {
  if (id === 'genesis') return <NeuralCanvas active={active} />
  if (id === 'rag') return <BinaryColumns />
  if (id === 'tradebot' || id === 'maven') return <ChartSvg type={id} />
  if (id === 'vpn') return <MatrixCanvas active={active} />
  return null
}

export default function MissionCard({ project, wide = false }) {
  const [flipped, setFlipped] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div className={`mission-card ${wide ? 'max-w-lg mx-auto w-full' : ''}`}>
      <div className={`mission-card-inner ${flipped ? 'is-flipped' : ''}`}>
        <button
          type="button"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setFlipped(true)}
          className="mission-face mission-front text-left"
          style={{ '--mission-color': project.color }}
        >
          <ProjectBackground id={project.id} active={hovered} />
          <div className="mission-scan" />
          <div className="relative z-10 flex h-full flex-col justify-between p-5">
            <div className="font-mono text-[10px] tracking-widest" style={{ color: project.color }}>
              {project.code}
            </div>
            <div className="text-center font-display text-6xl font-black text-white/15">{project.glyph}</div>
            <div>
              <div className="font-display text-xl font-bold text-white">{project.name}</div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="rounded border border-white/15 px-2 py-1 font-mono text-[10px] text-white/70">{project.status}</span>
                <span className="min-h-11 inline-flex items-center font-mono text-[10px] tracking-widest text-white/80">OPEN FILE &gt;</span>
              </div>
            </div>
          </div>
        </button>

        <div className="mission-face mission-back" style={{ '--mission-color': project.color }}>
          <div className="flex h-full flex-col p-5">
            <div className="font-mono text-[10px] tracking-widest" style={{ color: project.color }}>
              MISSION FILE / {project.code}
            </div>
            <h3 className="mt-2 font-display text-2xl font-bold text-white">{project.name}</h3>
            <p className="text-sm text-white/55">{project.subtitle}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/78">{project.summary}</p>
            <div className="mt-4 font-mono text-[10px] tracking-widest text-white/45">// OBJECTIVES</div>
            <ul className="mt-2 space-y-1.5">
              {project.objectives.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-white/80">
                  <span style={{ color: project.color }}>&gt;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span key={item} className="rounded border border-white/15 bg-white/5 px-2 py-1 font-mono text-[10px] text-white/75">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-auto flex items-center justify-between pt-4">
              <button type="button" onClick={() => setFlipped(false)} className="rounded border border-white/15 px-3 py-2 font-mono text-[10px] text-white/80">
                &lt; BACK
              </button>
              <button type="button" className="rounded px-3 py-2 font-mono text-[10px] text-black" style={{ background: project.color }}>
                TRANSMIT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
