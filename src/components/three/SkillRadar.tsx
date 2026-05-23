'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const labels = [
  'Software Engineering',
  'Data Engineering',
  'Machine Learning',
  'AI Systems',
  'Operations Research',
  'Optimization',
]

const values = [0.9, 0.88, 0.92, 0.95, 0.85, 0.9]

function hexagonVertices(radius: number): [number, number, number][] {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2
    return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
  })
}

function HexRing({ vertices, opacity }: { vertices: [number, number, number][]; opacity: number }) {
  const ref = useRef<THREE.Line>(null)

  useEffect(() => {
    if (!ref.current) return
    const points = [...vertices, vertices[0]].map((v) => new THREE.Vector3(...v))
    ref.current.geometry.setFromPoints(points)
  }, [vertices])

  return (
    <line ref={ref as never}>
      <bufferGeometry />
      <lineBasicMaterial color="#B8935A" transparent opacity={opacity} />
    </line>
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
      <lineBasicMaterial color="#B8935A" transparent opacity={opacity} />
    </line>
  )
}

function RadarScene({ inView }: { inView: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovering, setHovering] = useState(false)
  const { invalidate } = useThree()

  const outerHex = useMemo(() => hexagonVertices(2), [])
  const midHex = useMemo(() => hexagonVertices(1.33), [])
  const innerHex = useMemo(() => hexagonVertices(0.67), [])
  const axisLabels = useMemo(() => hexagonVertices(2.5), [])

  const filledShape = useMemo(() => {
    const shape = new THREE.Shape()
    const scaled = values.map((v, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2
      return new THREE.Vector2(Math.cos(angle) * 2 * v, Math.sin(angle) * 2 * v)
    })
    shape.moveTo(scaled[0].x, scaled[0].y)
    for (let i = 1; i < scaled.length; i++) {
      shape.lineTo(scaled[i].x, scaled[i].y)
    }
    shape.closePath()
    return shape
  }, [])

  useEffect(() => {
    if (inView) invalidate()
  }, [inView, invalidate])

  useFrame(({ clock }) => {
    if (!inView && !hovering) return
    if (groupRef.current && !hovering) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.002
    }
    invalidate()
  })

  return (
    <group
      ref={groupRef}
      rotation={[Math.PI / 12, 0, 0]}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      {/* Filled polygon */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <shapeGeometry args={[filledShape]} />
        <meshBasicMaterial color="#B8935A" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      <HexRing vertices={outerHex} opacity={0.6} />
      <HexRing vertices={midHex} opacity={0.1} />
      <HexRing vertices={innerHex} opacity={0.1} />

      {outerHex.map((v, i) => (
        <AxisLine key={'axis-' + i} from={[0, 0, 0]} to={v} opacity={0.15} />
      ))}

      {outerHex.map((v, i) => (
        <mesh key={'dot-' + i} position={v}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#B8935A" transparent opacity={0.8} />
        </mesh>
      ))}

      {axisLabels.map((v, i) => (
        <Html
          key={'label-' + i}
          position={v}
          center
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <span
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '11px',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
            }}
          >
            {labels[i]}
          </span>
        </Html>
      ))}

      {hovering && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
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
        frameloop="demand"
        dpr={[1, 2]}
        gl={{ alpha: true }}
        camera={{ position: [0, 3, 4], fov: 45 }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={0.3} />
        <RadarScene inView={inView} />
      </Canvas>
    </div>
  )
}
