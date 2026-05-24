'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const labels = [
  'Software Eng',
  'Data Eng',
  'Machine Learning',
  'AI Systems',
  'Op Research',
  'Optimization',
]

const values = [0.92, 0.88, 0.9, 0.95, 0.93, 0.89]

const bronzeColor = '#B8935A'

function hexagonVertices(radius: number): [number, number, number][] {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2
    return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
  })
}

function HexRing({ radius, opacity }: { radius: number; opacity: number }) {
  const ref = useRef<THREE.Line>(null)
  const vertices = useMemo(() => hexagonVertices(radius), [radius])

  useEffect(() => {
    if (!ref.current) return
    const pts = [...vertices, vertices[0]].map((v) => new THREE.Vector3(...v))
    ref.current.geometry.setFromPoints(pts)
  }, [vertices])

  return (
    <line ref={ref as never}>
      <bufferGeometry />
      <lineBasicMaterial color={bronzeColor} transparent opacity={opacity} />
    </line>
  )
}

function AxisLines({ radius, opacity }: { radius: number; opacity: number }) {
  const vertices = useMemo(() => hexagonVertices(radius), [radius])

  return (
    <>
      {vertices.map((v, i) => (
        <AxisLine key={'axis-' + i} from={[0, 0, 0]} to={v} opacity={opacity} />
      ))}
    </>
  )
}

function AxisLine({
  from,
  to,
  opacity,
}: {
  from: [number, number, number]
  to: [number, number, number]
  opacity: number
}) {
  const ref = useRef<THREE.Line>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.geometry.setFromPoints([new THREE.Vector3(...from), new THREE.Vector3(...to)])
  }, [from, to])

  return (
    <line ref={ref as never}>
      <bufferGeometry />
      <lineBasicMaterial color={bronzeColor} transparent opacity={opacity} />
    </line>
  )
}

function FilledPolygon() {
  const meshRef = useRef<THREE.Mesh>(null)
  const lineRef = useRef<THREE.Line>(null)

  useEffect(() => {
    const verts: number[] = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2
      const r = 2.2 * values[i]
      verts.push(Math.cos(angle) * r, 0, Math.sin(angle) * r)
    }
    const triangles: number[] = []
    for (let i = 0; i < 6; i++) {
      const next = (i + 1) % 6
      triangles.push(0, 0, 0)
      triangles.push(verts[i * 3], verts[i * 3 + 1], verts[i * 3 + 2])
      triangles.push(verts[next * 3], verts[next * 3 + 1], verts[next * 3 + 2])
    }
    if (meshRef.current) {
      const geo = meshRef.current.geometry
      geo.setAttribute('position', new THREE.Float32BufferAttribute(triangles, 3))
      geo.computeVertexNormals()
    }
  }, [])

  useEffect(() => {
    if (!lineRef.current) return
    const pts: THREE.Vector3[] = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2
      const r = 2.2 * values[i]
      pts.push(new THREE.Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r))
    }
    pts.push(pts[0].clone())
    lineRef.current.geometry.setFromPoints(pts)
  }, [])

  return (
    <>
      <mesh ref={meshRef}>
        <bufferGeometry />
        <meshBasicMaterial color={bronzeColor} transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
      <line ref={lineRef as never}>
        <bufferGeometry />
        <lineBasicMaterial color={bronzeColor} transparent opacity={0.7} />
      </line>
    </>
  )
}

function PulseSpheres() {
  const vertexPositions = useMemo(() => hexagonVertices(2.2), [])

  return (
    <>
      {vertexPositions.map((pos, i) => (
        <PulseSphere key={'pulse-' + i} position={pos} phaseOffset={i * (Math.PI / 3)} />
      ))}
    </>
  )
}

function PulseSphere({
  position,
  phaseOffset,
}: {
  position: [number, number, number]
  phaseOffset: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const scale = 1 + 0.8 * Math.abs(Math.sin(t * 1.5 + phaseOffset))
    ref.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.06, 12, 12]} />
      <meshBasicMaterial color={bronzeColor} />
    </mesh>
  )
}

function CenterCube() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.x += 0.008
    ref.current.rotation.y += 0.012
    ref.current.rotation.z += 0.005
  })

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshBasicMaterial color={bronzeColor} wireframe opacity={0.9} transparent />
      <pointLight color={bronzeColor} intensity={0.5} distance={3} />
    </mesh>
  )
}

function SkillLabel({ text, position }: { text: string; position: [number, number, number] }) {
  return (
    <Html
      position={position}
      center
      occlude={false}
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      <span
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '11px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
    </Html>
  )
}

function RadarScene({ inView }: { inView: boolean }) {
  const outerShellRef = useRef<THREE.Group>(null)
  const innerPolygonRef = useRef<THREE.Group>(null)
  const [hovering, setHovering] = useState(false)
  const { invalidate } = useThree()

  const labelPositions = useMemo(() => hexagonVertices(2.6), [])

  useEffect(() => {
    if (inView) invalidate()
  }, [inView, invalidate])

  useFrame(() => {
    if (!inView && !hovering) return
    if (!hovering) {
      if (outerShellRef.current) {
        outerShellRef.current.rotation.y += 0.003
      }
      if (innerPolygonRef.current) {
        innerPolygonRef.current.rotation.y += 0.004
      }
    }
    if (outerShellRef.current) {
      outerShellRef.current.rotation.x = Math.sin(Date.now() * 0.0003) * 0.15
    }
    invalidate()
  })

  return (
    <group
      rotation={[Math.PI / 12, 0, 0]}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      {/* Outer hexagonal cage */}
      <group ref={outerShellRef}>
        <HexRing radius={2.2} opacity={0.6} />
        <HexRing radius={1.5} opacity={0.15} />
        <HexRing radius={0.8} opacity={0.1} />
        <AxisLines radius={2.2} opacity={0.15} />
        <PulseSpheres />
        {labelPositions.map((pos, i) => (
          <SkillLabel key={'label-' + i} text={labels[i]} position={pos} />
        ))}
      </group>

      {/* Inner filled polygon */}
      <group ref={innerPolygonRef}>
        <FilledPolygon />
      </group>

      {/* Center cube — independent rotation inside the cube component */}
      <CenterCube />

      {hovering && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          dampingFactor={0.05}
          enableDamping
          maxPolarAngle={Math.PI * 0.75}
          minPolarAngle={Math.PI * 0.25}
        />
      )}
    </group>
  )
}

export default function SkillRadar() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '100px',
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full" aria-hidden="true">
      <Canvas
        frameloop="always"
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 5.5], fov: 50 }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.3} />
        <RadarScene inView={inView} />
      </Canvas>
    </div>
  )
}
