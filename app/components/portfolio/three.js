'use client'

import { useMemo, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, Sparkles, Stars, Line } from '@react-three/drei'
import * as THREE from 'three'

const CANVAS_GL = { antialias: true, alpha: true, powerPreference: 'high-performance' }
const CANVAS_PERFORMANCE = { min: 0.55 }

function SceneCanvas({ children, camera, dpr = [1, 1.35] }) {
  return (
    <Canvas camera={camera} dpr={dpr} gl={CANVAS_GL} performance={CANVAS_PERFORMANCE}>
      {children}
    </Canvas>
  )
}

function AutoOrbitControls(props) {
  return <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} {...props} />
}

function NebulaPoints() {
  const ref = useRef()
  const positions = useMemo(() => {
    const values = new Float32Array(640 * 3)

    for (let index = 0; index < 640; index += 1) {
      values[index * 3] = (Math.random() - 0.5) * 60
      values[index * 3 + 1] = (Math.random() - 0.5) * 40
      values[index * 3 + 2] = (Math.random() - 0.5) * 60
    }

    return values
  }, [])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#67e8f9" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

export function GlobalBackground3D() {
  return (
    <SceneCanvas camera={{ position: [0, 0, 15], fov: 60 }} dpr={[1, 1.2]}>
      <fog attach="fog" args={['#03050a', 12, 40]} />
      <Stars radius={80} depth={50} count={1600} factor={3} saturation={0.6} fade speed={0.45} />
      <NebulaPoints />
    </SceneCanvas>
  )
}

function Crystal() {
  const wire = useRef()
  const core = useRef()

  useFrame((_, delta) => {
    if (wire.current) {
      wire.current.rotation.y += delta * 0.35
      wire.current.rotation.x += delta * 0.12
    }

    if (core.current) {
      core.current.rotation.y -= delta * 0.5
      core.current.rotation.x -= delta * 0.18
    }
  })

  return (
    <group>
      <mesh ref={wire}>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshStandardMaterial
          color="#22d3ee"
          wireframe
          transparent
          opacity={0.55}
          emissive="#22d3ee"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh ref={core} scale={0.9}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color="#0a1628" emissive="#22d3ee" emissiveIntensity={1.1} metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh scale={2.1}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.08} />
      </mesh>
    </group>
  )
}

export function HeroAvatar3D() {
  return (
    <SceneCanvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={2.1} color="#22d3ee" />
      <pointLight position={[-5, -3, -5]} intensity={1.4} color="#d946ef" />
      <pointLight position={[0, 5, -6]} intensity={1.0} color="#fde68a" />
      <Suspense fallback={null}>
        <Float speed={1.35} rotationIntensity={0.6} floatIntensity={0.9}>
          <Crystal />
        </Float>
        <Sparkles count={90} scale={8} size={2.1} speed={0.4} color="#67e8f9" />
      </Suspense>
      <AutoOrbitControls autoRotateSpeed={0.6} />
    </SceneCanvas>
  )
}

function Building({ pos, h, w, d, lit }) {
  return (
    <mesh position={[pos[0], h / 2 - 0.5, pos[1]]}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial
        color="#040813"
        emissive={lit ? '#22d3ee' : '#0e1a2c'}
        emissiveIntensity={lit ? 0.35 : 0.06}
        metalness={0.7}
        roughness={0.5}
      />
    </mesh>
  )
}

function NeuralNet() {
  const group = useRef()
  const nodes = useMemo(
    () =>
      Array.from({ length: 14 }, () => [
        (Math.random() - 0.5) * 18,
        Math.random() * 4 + 3.5,
        (Math.random() - 0.5) * 8,
      ]),
    []
  )
  const edges = useMemo(() => {
    const connections = []

    for (let left = 0; left < nodes.length; left += 1) {
      for (let right = left + 1; right < nodes.length; right += 1) {
        const a = nodes[left]
        const b = nodes[right]
        const distance = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])

        if (distance < 6) connections.push([a, b])
      }
    }

    return connections.slice(0, 28)
  }, [nodes])

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.05
  })

  return (
    <group ref={group}>
      {nodes.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#67e8f9" />
        </mesh>
      ))}
      {edges.map((edge, index) => (
        <Line key={index} points={[edge[0], edge[1]]} color="#22d3ee" lineWidth={1} transparent opacity={0.35} />
      ))}
    </group>
  )
}

export function ShadowCity3D() {
  const buildings = useMemo(() => {
    const values = []
    const columns = 14

    for (let index = 0; index < columns; index += 1) {
      const x = (index - columns / 2) * 1.6 + (Math.random() - 0.5) * 0.8
      const z = (Math.random() - 0.5) * 6
      const h = 1.5 + Math.random() * 5
      const w = 0.7 + Math.random() * 0.6
      const d = 0.7 + Math.random() * 0.6

      values.push({ pos: [x, z], h, w, d, lit: Math.random() > 0.55 })
    }

    for (let index = 0; index < 10; index += 1) {
      const x = (index - 5) * 2 + (Math.random() - 0.5)
      const z = -6 + (Math.random() - 0.5) * 1.5
      const h = 4 + Math.random() * 6

      values.push({ pos: [x, z], h, w: 1, d: 1, lit: Math.random() > 0.4 })
    }

    return values
  }, [])

  return (
    <SceneCanvas camera={{ position: [0, 4, 12], fov: 55 }}>
      <fog attach="fog" args={['#02040a', 10, 32]} />
      <ambientLight intensity={0.12} />
      <pointLight position={[0, 12, 4]} intensity={1.3} color="#22d3ee" />
      <pointLight position={[8, 6, -4]} intensity={1.0} color="#d946ef" />
      <pointLight position={[-8, 6, -4]} intensity={0.9} color="#67e8f9" />
      <Suspense fallback={null}>
        {buildings.map((building, index) => (
          <Building key={index} {...building} />
        ))}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[80, 80]} />
          <meshStandardMaterial color="#03050a" metalness={0.9} roughness={0.4} />
        </mesh>
        <NeuralNet />
        <Sparkles count={60} scale={[24, 6, 12]} position={[0, 4, 0]} size={1.8} speed={0.18} color="#67e8f9" />
      </Suspense>
    </SceneCanvas>
  )
}

function Pulse({ start, end, color, speed, offset }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const progress = (state.clock.elapsedTime * speed + offset) % 1
    ref.current.position.lerpVectors(start, end, progress)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

function TradingGraph() {
  const group = useRef()
  const nodes = useMemo(() => {
    const values = []
    const total = 12

    for (let index = 0; index < total; index += 1) {
      const angle = (index / total) * Math.PI * 2
      const radius = 3 + (index % 3) * 0.6
      values.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(index * 1.3) * 1.2, Math.sin(angle) * radius))
    }

    values.push(new THREE.Vector3(0, 0, 0))
    return values
  }, [])

  const edges = useMemo(() => {
    const values = []
    const center = nodes[nodes.length - 1]

    for (let index = 0; index < nodes.length - 1; index += 1) values.push([center, nodes[index]])
    for (let index = 0; index < nodes.length - 1; index += 1) {
      values.push([nodes[index], nodes[(index + 1) % (nodes.length - 1)]])
    }

    return values
  }, [nodes])

  const pulses = useMemo(
    () =>
      edges.slice(0, 12).map((edge, index) => ({
        edge,
        speed: 0.42 + index * 0.03,
        offset: (index * 0.17) % 1,
        color: index % 2 === 0 ? '#67e8f9' : '#f0abfc',
      })),
    [edges]
  )

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.15
  })

  return (
    <group ref={group}>
      {nodes.map((point, index) => {
        const isHub = index === nodes.length - 1

        return (
          <Float key={index} speed={1 + (index % 3) * 0.4} floatIntensity={0.4} rotationIntensity={0.4}>
            <mesh position={point}>
              <octahedronGeometry args={[isHub ? 0.45 : 0.18, 0]} />
              <meshStandardMaterial
                color={isHub ? '#f0abfc' : '#67e8f9'}
                emissive={isHub ? '#d946ef' : '#22d3ee'}
                emissiveIntensity={1.2}
                metalness={0.6}
                roughness={0.2}
              />
            </mesh>
          </Float>
        )
      })}

      {edges.map((edge, index) => (
        <Line key={index} points={[edge[0], edge[1]]} color={index % 3 === 0 ? '#f0abfc' : '#22d3ee'} lineWidth={1} transparent opacity={0.3} />
      ))}

      {pulses.map((pulse, index) => (
        <Pulse key={index} start={pulse.edge[0]} end={pulse.edge[1]} color={pulse.color} speed={pulse.speed} offset={pulse.offset} />
      ))}
    </group>
  )
}

export function WebGraph3D() {
  return (
    <SceneCanvas camera={{ position: [0, 2, 9], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[6, 6, 6]} intensity={1.7} color="#f0abfc" />
      <pointLight position={[-6, -3, -6]} intensity={1.3} color="#22d3ee" />
      <Suspense fallback={null}>
        <TradingGraph />
        <Sparkles count={60} scale={12} size={1.5} speed={0.28} color="#f0abfc" />
      </Suspense>
      <AutoOrbitControls autoRotateSpeed={0.4} />
    </SceneCanvas>
  )
}

function TunnelRings() {
  const group = useRef()
  const rings = useMemo(() => Array.from({ length: 20 }, (_, index) => index), [])

  useFrame((_, delta) => {
    if (!group.current) return

    group.current.children.forEach((child) => {
      child.position.z += delta * 6
      if (child.position.z > 4) child.position.z = -34
      child.rotation.z += delta * 0.4
    })
  })

  return (
    <group ref={group}>
      {rings.map((ring) => (
        <mesh key={ring} position={[0, 0, -ring * 1.8]} rotation={[0, 0, Math.random() * Math.PI]}>
          <torusGeometry args={[2.4, 0.04, 8, 48]} />
          <meshStandardMaterial color="#fde68a" emissive="#f59e0b" emissiveIntensity={1.2} />
        </mesh>
      ))}
    </group>
  )
}

function Packets() {
  const group = useRef()
  const packets = useMemo(
    () =>
      Array.from({ length: 44 }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 0.4 + Math.random() * 1.6,
        z: -Math.random() * 36,
        speed: 4 + Math.random() * 4,
        color: Math.random() > 0.5 ? '#67e8f9' : '#f0abfc',
      })),
    []
  )

  useFrame((_, delta) => {
    if (!group.current) return

    group.current.children.forEach((child, index) => {
      const packet = packets[index]
      packet.z += delta * packet.speed
      if (packet.z > 4) packet.z = -36
      child.position.set(Math.cos(packet.angle) * packet.radius, Math.sin(packet.angle) * packet.radius, packet.z)
    })
  })

  return (
    <group ref={group}>
      {packets.map((packet, index) => (
        <mesh key={index}>
          <boxGeometry args={[0.06, 0.06, 0.4]} />
          <meshBasicMaterial color={packet.color} />
        </mesh>
      ))}
    </group>
  )
}

export function CyberTunnel3D() {
  return (
    <SceneCanvas camera={{ position: [0, 0, 4], fov: 60 }}>
      <fog attach="fog" args={['#02040a', 6, 28]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 4]} intensity={1.8} color="#fde68a" />
      <pointLight position={[0, 0, -10]} intensity={1.1} color="#22d3ee" />
      <Suspense fallback={null}>
        <TunnelRings />
        <Packets />
      </Suspense>
    </SceneCanvas>
  )
}

function Bar({ x, z, color, base, offset }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const height = base + Math.abs(Math.sin(state.clock.elapsedTime + offset)) * 1.5
    ref.current.scale.y = height
    ref.current.position.y = height / 2
  })

  return (
    <mesh ref={ref} position={[x, 0.5, z]}>
      <boxGeometry args={[0.45, 1, 0.45]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} metalness={0.4} roughness={0.3} />
    </mesh>
  )
}

export function DataLab3D() {
  const bars = useMemo(() => {
    const values = []
    const columns = 8
    const rows = 6
    const palette = ['#22d3ee', '#67e8f9', '#f0abfc', '#fde68a']

    for (let column = 0; column < columns; column += 1) {
      for (let row = 0; row < rows; row += 1) {
        values.push({
          x: (column - columns / 2 + 0.5) * 0.7,
          z: (row - rows / 2 + 0.5) * 0.7,
          color: palette[(column + row) % palette.length],
          base: 0.55 + Math.random() * 1.4,
          offset: Math.random() * Math.PI * 2,
        })
      }
    }

    return values
  }, [])

  return (
    <SceneCanvas camera={{ position: [0, 5, 9], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 10, 6]} intensity={1.6} color="#67e8f9" />
      <pointLight position={[8, 6, -6]} intensity={1.0} color="#f0abfc" />
      <Suspense fallback={null}>
        <gridHelper args={[16, 16, '#22d3ee', '#0e1a2c']} position={[0, -0.01, 0]} />
        {bars.map((bar, index) => (
          <Bar key={index} {...bar} />
        ))}
      </Suspense>
      <AutoOrbitControls autoRotateSpeed={0.45} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 4} />
    </SceneCanvas>
  )
}

function OrbitGlyph({ index, total, color }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const time = state.clock.elapsedTime * 0.3
    const angle = (index / total) * Math.PI * 2 + time
    const radius = 3.2 + (index % 2) * 0.6
    ref.current.position.set(Math.cos(angle) * radius, Math.sin(angle + index) * 0.8, Math.sin(angle) * radius)
    ref.current.rotation.y += 0.01
  })

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.35, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1} metalness={0.6} roughness={0.2} />
    </mesh>
  )
}

export function ArchiveOrbits3D({ count = 7 }) {
  const palette = ['#22d3ee', '#f0abfc', '#fde68a', '#67e8f9', '#a5f3fc', '#f9a8d4', '#fcd34d']

  return (
    <SceneCanvas camera={{ position: [0, 1, 7], fov: 55 }}>
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 5, 5]} intensity={1.4} color="#67e8f9" />
      <pointLight position={[0, -5, -5]} intensity={1.0} color="#f0abfc" />
      <Suspense fallback={null}>
        <mesh>
          <icosahedronGeometry args={[1.1, 1]} />
          <meshStandardMaterial color="#0a1628" emissive="#22d3ee" emissiveIntensity={0.4} wireframe />
        </mesh>
        {Array.from({ length: count }).map((_, index) => (
          <OrbitGlyph key={index} index={index} total={count} color={palette[index % palette.length]} />
        ))}
        <Sparkles count={48} scale={10} size={1.4} speed={0.3} color="#67e8f9" />
      </Suspense>
    </SceneCanvas>
  )
}
