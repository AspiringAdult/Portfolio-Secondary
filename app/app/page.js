'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ChevronRight, Download, ExternalLink, Send, Shield, Zap } from 'lucide-react'
import { CONTACT_PROTOCOLS, HERO, PROJECTS, SECTORS } from '@/components/portfolio/data'
import { ContactDeck, ProtocolCard, ScrollHint, SectionHeading, SideNavigator, TopHUD } from '@/components/portfolio/ui'
import MissionCard from './components/MissionCard'
import SkillRadar from './components/SkillRadar'
import CertWall from './components/CertWall'
import ExperienceComicPanel from './components/ExperienceComicPanel'

const HeroCompanions = dynamic(() => import('./components/HeroCompanions'), { ssr: false })
const GlobalBackground3D = dynamic(() => import('@/components/portfolio/three').then((module) => module.GlobalBackground3D), { ssr: false })
const HeroAvatar3D = dynamic(() => import('@/components/portfolio/three').then((module) => module.HeroAvatar3D), { ssr: false })
const ShadowCity3D = dynamic(() => import('@/components/portfolio/three').then((module) => module.ShadowCity3D), { ssr: false })
const WebGraph3D = dynamic(() => import('@/components/portfolio/three').then((module) => module.WebGraph3D), { ssr: false })
const CyberTunnel3D = dynamic(() => import('@/components/portfolio/three').then((module) => module.CyberTunnel3D), { ssr: false })
const DataLab3D = dynamic(() => import('@/components/portfolio/three').then((module) => module.DataLab3D), { ssr: false })
const ArchiveOrbits3D = dynamic(() => import('@/components/portfolio/three').then((module) => module.ArchiveOrbits3D), { ssr: false })

function useSectorMotion() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.24 })
  return {
    ref,
    contentY: useTransform(smooth, [0, 0.25, 0.75, 1], [56, 0, 0, -40]),
    contentOpacity: useTransform(smooth, [0, 0.18, 0.35, 0.85, 1], [0.18, 0.6, 1, 1, 0.18]),
    sceneOpacity: useTransform(smooth, [0, 0.15, 0.5, 0.85, 1], [0.2, 0.55, 1, 0.55, 0.2]),
  }
}

function SceneViewport({ children, sceneOpacity, priority = false }) {
  const ref = useRef(null)
  const [enabled, setEnabled] = useState(priority)
  useEffect(() => {
    if (priority) return undefined
    const node = ref.current
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => setEnabled(entry.isIntersecting), { rootMargin: '140% 0px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [priority])
  return (
    <motion.div ref={ref} style={{ opacity: sceneOpacity }} className="absolute inset-0 pointer-events-none touch-pan-y">
      {enabled ? children : null}
    </motion.div>
  )
}

function useGlitchTypewriter(text) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(text)
  useEffect(() => {
    if (reduced) return undefined
    setValue('')
    let index = 0
    let timeout = 0
    const symbols = '@#$%&!'
    const type = () => {
      if (index >= text.length) return
      const next = text[index]
      if (Math.random() < 0.3 && next.trim()) {
        setValue(text.slice(0, index) + symbols[Math.floor(Math.random() * symbols.length)])
        timeout = window.setTimeout(() => {
          index += 1
          setValue(text.slice(0, index))
          timeout = window.setTimeout(type, 60)
        }, 40)
      } else {
        index += 1
        setValue(text.slice(0, index))
        timeout = window.setTimeout(type, 60)
      }
    }
    timeout = window.setTimeout(type, 250)
    return () => window.clearTimeout(timeout)
  }, [reduced, text])
  return value
}

function EnergyOrbs() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let pointer = null
    let orbs = []
    const palette = [
      ...Array.from({ length: 6 }, () => ({ color: [34, 211, 238], alpha: 0.4, min: 4, max: 12 })),
      ...Array.from({ length: 4 }, () => ({ color: [217, 70, 239], alpha: 0.35, min: 3, max: 9 })),
      ...Array.from({ length: 2 }, () => ({ color: [245, 158, 11], alpha: 0.3, min: 2, max: 6 })),
    ]
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
      orbs = palette.map((orb) => ({
        ...orb,
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        r: orb.min + Math.random() * (orb.max - orb.min),
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }))
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      orbs.forEach((orb) => {
        if (!reduced) {
          if (pointer) {
            const dx = orb.x - pointer.x
            const dy = orb.y - pointer.y
            const dist = Math.hypot(dx, dy)
            if (dist < 120 && dist > 1) {
              const push = (120 - dist) / 120
              orb.vx += (dx / dist) * push * 0.06
              orb.vy += (dy / dist) * push * 0.06
            }
          }
          orb.x = (orb.x + orb.vx + canvas.offsetWidth) % canvas.offsetWidth
          orb.y = (orb.y + orb.vy + canvas.offsetHeight) % canvas.offsetHeight
          orb.vx *= 0.995
          orb.vy *= 0.995
        }
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r * 4)
        gradient.addColorStop(0, `rgba(${orb.color.join(',')},${orb.alpha})`)
        gradient.addColorStop(1, `rgba(${orb.color.join(',')},0)`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.r * 4, 0, Math.PI * 2)
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    const move = (event) => {
      const point = event.touches?.[0] || event
      const rect = canvas.getBoundingClientRect()
      pointer = { x: point.clientX - rect.left, y: point.clientY - rect.top }
    }
    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('touchmove', move, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('touchmove', move)
    }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 z-0 h-full w-full" />
}

function HeroSection() {
  const { ref, sceneOpacity } = useSectorMotion()
  const name = useGlitchTypewriter(HERO.name)
  const reduced = useReducedMotion()
  const [flash, setFlash] = useState(false)
  const [hideHint, setHideHint] = useState(false)
  const [parallax, setParallax] = useState({ y: 0, opacity: 1 })

  useEffect(() => {
    const update = () => {
      const y = Math.min(window.scrollY, window.innerHeight * 0.6)
      setParallax({ y: -y * 0.4, opacity: Math.max(0, 1 - y / (window.innerHeight * 0.6)) })
      setHideHint(window.scrollY > 50)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const enter = () => {
    setFlash(true)
    window.setTimeout(() => setFlash(false), 600)
    window.setTimeout(() => document.getElementById('shadow')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 260)
  }
  const stats = ['PROJECTS: 05', 'EXPERIENCE: 3 ROLES', 'SKILLS: 9', 'STATUS: ONLINE']

  return (
    <section ref={ref} id="hero" data-sector="hero" className="relative flex min-h-screen w-full items-center overflow-hidden py-24 md:py-32">
      <SceneViewport sceneOpacity={sceneOpacity} priority><HeroAvatar3D /></SceneViewport>
      <EnergyOrbs />
      <div className="absolute inset-0 cyber-grid opacity-50 pointer-events-none" />
      <div className="absolute inset-0 scanlines opacity-35 pointer-events-none" />
      <motion.div animate={reduced ? { opacity: 1 } : { opacity: parallax.opacity, y: parallax.y }} className="relative z-10 container grid items-center gap-10 px-6 md:grid-cols-2 md:px-10">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-xs tracking-[0.4em] text-cyan-300">// CORE IDENTITY CHAMBER / 00</motion.div>
          <h1 className="mt-3 font-display text-4xl font-black leading-[0.95] md:text-6xl lg:text-7xl"><span className="gradient-text">{name}</span></h1>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 px-3 py-1.5 font-mono text-xs tracking-widest text-cyan-100 glass">
            <Zap className="h-3 w-3" /> CALLSIGN: KINGSLAYER
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">{HERO.tagline}</motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }} className="mt-4 max-w-xl text-sm text-white/55">{HERO.bio}</motion.p>
          <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-xs text-white/55">
            {stats.map((stat, index) => (
              <motion.span key={stat} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9 + index * 0.15 }} className="inline-flex items-center gap-2">
                {index > 0 ? <span className="text-white/20">|</span> : null}{stat}{stat.includes('ONLINE') ? <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300 pulse-ring text-cyan-300" /> : null}
              </motion.span>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.3 }} className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={enter} className="group inline-flex items-center gap-2 rounded border border-cyan-300/50 px-5 py-3 font-display text-sm tracking-widest text-cyan-100 hover:border-cyan-200 hover:text-white hover:shadow-[0_0_30px_rgba(34,211,238,.35)] hover:[text-shadow:0_0_12px_#22d3ee]">
              ENTER THE MULTIVERSE <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </button>
            <a href={HERO.contact.resume} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded border border-fuchsia-400/45 px-5 py-3 font-display text-sm tracking-widest text-fuchsia-100 hover:bg-fuchsia-500/10"><Download className="h-4 w-4" /> DOWNLOAD INTEL</a>
          </motion.div>
        </div>
        <div className="hidden md:block" />
      </motion.div>
      <div className={`pointer-events-none fixed inset-0 z-50 bg-white transition-opacity duration-300 ${flash ? 'opacity-80' : 'opacity-0'}`} />
      <AnimatePresence>{hideHint ? null : <ScrollHint />}</AnimatePresence>
    </section>
  )
}

function ProjectSection({ id, code, title, accent, sub, scene, children }) {
  const { ref, contentY, contentOpacity, sceneOpacity } = useSectorMotion()
  return (
    <section ref={ref} id={id} data-sector={id} className="relative min-h-screen w-full overflow-hidden py-24 md:py-32">
      <SceneViewport sceneOpacity={sceneOpacity}>{scene}</SceneViewport>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/75 pointer-events-none" />
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 container px-6 md:px-10">
        <SectionHeading code={code} title={title} accent={accent} sub={sub} />
        <div className="mt-10">{children}</div>
      </motion.div>
    </section>
  )
}

function DataSection() {
  const { ref, contentY, contentOpacity, sceneOpacity } = useSectorMotion()
  return (
    <section ref={ref} id="data" data-sector="data" className="relative min-h-screen w-full overflow-hidden py-24 md:py-32">
      <SceneViewport sceneOpacity={sceneOpacity}><DataLab3D /></SceneViewport>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 container px-6 md:px-10">
        <SectionHeading code="04" title="DATA VISUALIZATION LAB" accent="cyan" sub="An interactive skill radar, diagnostics console, and live-looking data fluency panel." />
        <div className="mt-10"><SkillRadar /></div>
      </motion.div>
    </section>
  )
}

function ExperienceSection() {
  const { ref, contentY, contentOpacity } = useSectorMotion()
  return (
    <section ref={ref} id="experience" data-sector="experience" className="relative min-h-screen w-full overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 container px-6 md:px-10">
        <SectionHeading code="05" title="EXPERIENCE TIMELINE" accent="amber" sub="Work history staged as a comic panel sequence, each role treated as a chapter." />
        <div className="mt-10"><ExperienceComicPanel /></div>
      </motion.div>
    </section>
  )
}

function ArchiveSection() {
  const { ref, contentY, contentOpacity, sceneOpacity } = useSectorMotion()
  return (
    <section ref={ref} id="archive" data-sector="archive" className="relative min-h-screen w-full overflow-hidden py-24 md:py-32">
      <SceneViewport sceneOpacity={sceneOpacity}><ArchiveOrbits3D count={7} /></SceneViewport>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 container px-6 md:px-10">
        <SectionHeading code="06" title="KNOWLEDGE ARCHIVE" accent="magenta" sub="A hologram wall for certifications, disciplines, and academic milestones." />
        <div className="mt-10"><CertWall /></div>
      </motion.div>
    </section>
  )
}

function ContactSection({ onCopyEmail }) {
  const { ref, contentY, contentOpacity } = useSectorMotion()
  return (
    <section ref={ref} id="contact" data-sector="contact" className="relative flex min-h-screen w-full items-center overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 cyber-grid opacity-45 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 container px-6 md:px-10">
        <SectionHeading code="07" title="OPEN A CHANNEL" accent="cyan" sub="Mission briefings, collaborations, product builds, or intelligence drops. When the signal is clear, transmit." />
        <div className="mt-10 grid items-start gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <ContactDeck resumeHref={HERO.contact.resume} onCopyEmail={onCopyEmail} />
            <div className="glass hud-corner rounded p-5">
              <div className="font-mono text-[10px] tracking-widest text-cyan-300">// TRANSMISSION PROTOCOL</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">{CONTACT_PROTOCOLS.map((protocol) => <ProtocolCard key={protocol.title} {...protocol} />)}</div>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={HERO.contact.resume} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded border border-cyan-400/35 px-4 py-2.5 text-cyan-100 hover:bg-cyan-500/10"><Download className="h-4 w-4" /> OPEN DOSSIER</a>
                <button type="button" onClick={onCopyEmail} className="inline-flex items-center gap-2 rounded border border-fuchsia-400/35 px-4 py-2.5 text-fuchsia-100 hover:bg-fuchsia-500/10"><Send className="h-4 w-4" /> COPY EMAIL</button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="glass hud-corner rounded p-5">
              <div className="font-mono text-[10px] tracking-widest text-cyan-300">// MANIFESTO</div>
              <p className="mt-3 text-sm leading-relaxed text-white/80">I build at the intersection of <span className="neon-cyan">logic</span>, <span className="neon-magenta">automation</span>, and <span className="neon-amber">intelligent design</span>.</p>
            </div>
            <div className="glass rounded p-5">
              <div className="font-mono text-[10px] tracking-widest text-amber-300">// COLLABORATION ZONES</div>
              <div className="mt-3 flex flex-wrap gap-2">{SECTORS.slice(1).map((sector) => <span key={sector.id} className="rounded border border-amber-400/25 px-2.5 py-1 font-mono text-xs tracking-wider text-amber-100/90">{sector.label}</span>)}</div>
              <a href={HERO.contact.linkedin} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-white/70 hover:text-cyan-200">Continue on LinkedIn <ExternalLink className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
        <div className="mt-16 text-center font-mono text-[10px] tracking-widest text-white/30">BUILT WITH NEXT.JS / THREE.JS / FRAMER MOTION / {new Date().getFullYear()} DIPTANGKUSH DAS</div>
      </motion.div>
    </section>
  )
}

function KonamiOverlay({ active, onDismiss }) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onDismiss} className="fixed inset-0 z-[70] flex items-center justify-center bg-[radial-gradient(ellipse,#1a0a2e,#000)]">
          <svg className="absolute inset-0 h-full w-full opacity-25" viewBox="0 0 100 100" preserveAspectRatio="none">
            {Array.from({ length: 20 }).map((_, i) => <line key={i} x1="50" y1="50" x2={Math.cos((i / 20) * Math.PI * 2) * 60 + 50} y2={Math.sin((i / 20) * Math.PI * 2) * 60 + 50} stroke="#22d3ee" strokeWidth=".2" />)}
            <circle cx="50" cy="50" r="12" fill="none" stroke="#d946ef" strokeWidth=".4" />
            <circle cx="50" cy="50" r="24" fill="none" stroke="#22d3ee" strokeWidth=".25" />
          </svg>
          <div className="relative z-10 text-center">
            <div className="font-display text-4xl gradient-text">SPIDEY SENSE ACTIVATED</div>
            <div className="mt-3 font-mono text-cyan-300">KINGSLAYER PROTOCOL: UNLOCKED</div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default function App() {
  const [activeSector, setActiveSector] = useState('hero')
  const [sound, setSound] = useState(false)
  const [toast, setToast] = useState(false)
  const [konami, setKonami] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    root.style.scrollBehavior = 'smooth'
    root.style.scrollPaddingTop = '88px'
  }, [])

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('section[data-sector]'))
    let frameId = 0
    const update = () => {
      const center = window.innerHeight * 0.5
      let closest = sections[0]?.dataset.sector || 'hero'
      let distance = Number.POSITIVE_INFINITY
      sections.forEach((section) => {
        const bounds = section.getBoundingClientRect()
        const next = Math.abs(bounds.top + bounds.height / 2 - center)
        if (next < distance) {
          distance = next
          closest = section.dataset.sector || closest
        }
      })
      setActiveSector((current) => (current === closest ? current : closest))
      frameId = 0
    }
    const request = () => { if (!frameId) frameId = window.requestAnimationFrame(update) }
    request()
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
    }
  }, [])

  useEffect(() => {
    const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
    let index = 0
    let timer = 0
    const onKey = (event) => {
      if (konami) {
        setKonami(false)
        return
      }
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      index = key === sequence[index] ? index + 1 : key === sequence[0] ? 1 : 0
      if (index === sequence.length) {
        setKonami(true)
        index = 0
        window.clearTimeout(timer)
        timer = window.setTimeout(() => setKonami(false), 3500)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
    }
  }, [konami])

  const jumpTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const copyEmail = async () => {
    try {
      await navigator.clipboard?.writeText(HERO.contact.email)
    } catch {
      const field = document.createElement('textarea')
      field.value = HERO.contact.email
      field.setAttribute('readonly', '')
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.select()
      document.execCommand('copy')
      document.body.removeChild(field)
    }
    setToast(true)
    window.setTimeout(() => setToast(false), 2000)
  }
  const shadowProjects = useMemo(() => PROJECTS.filter((project) => project.world === 'shadow'), [])
  const webProjects = useMemo(() => PROJECTS.filter((project) => project.world === 'web'), [])
  const vpn = PROJECTS.find((project) => project.id === 'vpn')

  return (
    <main className="relative isolate">
      <div className="fixed inset-0 -z-10 pointer-events-none"><Suspense fallback={null}><GlobalBackground3D /></Suspense></div>
      <TopHUD activeSector={activeSector} sound={sound} toggleSound={() => setSound((current) => !current)} />
      <SideNavigator activeSector={activeSector} onJump={jumpTo} />
      <HeroCompanions activeSector={activeSector} />
      <HeroSection />
      <ProjectSection id="shadow" code="01" title="SHADOW INTELLIGENCE" accent="cyan" sub="AI mission files rebuilt as flip-ready briefing rooms." scene={<ShadowCity3D />}>
        <div className="grid gap-5 lg:grid-cols-2">{shadowProjects.map((project) => <MissionCard key={project.id} project={project} />)}</div>
      </ProjectSection>
      <ProjectSection id="web" code="02" title="WEB OF SYSTEMS" accent="magenta" sub="Trading and dashboard systems with animated signal backgrounds." scene={<WebGraph3D />}>
        <div className="grid gap-5 lg:grid-cols-2">{webProjects.map((project) => <MissionCard key={project.id} project={project} />)}</div>
      </ProjectSection>
      <ProjectSection id="cyber" code="03" title="CYBER DEFENSE ZONE" accent="amber" sub="Encrypted tunnels, packet streams, and secure networking experiments." scene={<CyberTunnel3D />}>
        <div className="mb-6 grid max-w-md grid-cols-3 gap-3">{['PACKETS / SEC: 4.2K', 'ENCRYPTION: AES-256', 'LATENCY: 12MS'].map((stat) => <div key={stat} className="glass rounded p-3 font-mono text-[10px] text-amber-100">{stat}</div>)}</div>
        {vpn ? <MissionCard project={vpn} wide /> : <div className="text-white/60"><Shield className="inline h-4 w-4" /> VPN file unavailable.</div>}
      </ProjectSection>
      <DataSection />
      <ExperienceSection />
      <ArchiveSection />
      <ContactSection onCopyEmail={copyEmail} />
      <AnimatePresence>{toast ? <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded border border-cyan-300/40 bg-black/80 px-4 py-2 font-mono text-xs text-cyan-100">TRANSMISSION COPIED ✓</motion.div> : null}</AnimatePresence>
      <KonamiOverlay active={konami} onDismiss={() => setKonami(false)} />
    </main>
  )
}
