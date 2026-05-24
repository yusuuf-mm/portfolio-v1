'use client'

import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const SKILLS = [
  { name: 'SOFTWARE ENG', value: 0.92 },
  { name: 'DATA ENG', value: 0.88 },
  { name: 'MACHINE LEARNING', value: 0.90 },
  { name: 'AI SYSTEMS', value: 0.95 },
  { name: 'OPS RESEARCH', value: 0.93 },
  { name: 'OPTIMIZATION', value: 0.89 },
]

const BRONZE = '#B8935A'
const OUTER_RADIUS = 2.2
const INNER_RADII = [0.8, 1.5, 2.2]
const LABEL_RADIUS = 2.65

// Create hexagon points
function hexagonPoints(radius: number, y = 0): THREE.Vector3[] {
  const points: THREE.Vector3[] = []
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
    points.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius))
  }
  return points
}

// Hexagonal cage rings
function HexRing({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const pts = hexagonPoints(radius)
    pts.push(pts[0].clone()) // Close the loop
    return pts
  }, [radius])

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [points])

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={BRONZE} opacity={0.5} transparent />
    </line>
  )
}

// Radial spokes from center to each vertex
function RadialSpokes() {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = []
    const outerPoints = hexagonPoints(OUTER_RADIUS)
    outerPoints.forEach((pt) => {
      points.push(new THREE.Vector3(0, 0, 0))
      points.push(pt)
    })
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={BRONZE} opacity={0.3} transparent />
    </lineSegments>
  )
}

// Filled skill polygon
function SkillPolygon() {
  const ref = useRef<THREE.Group>(null)

  const { fillGeometry, wireGeometry } = useMemo(() => {
    const points = SKILLS.map((skill, i) => {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
      const r = skill.value * OUTER_RADIUS
      return new THREE.Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r)
    })

    // Create filled shape
    const shape = new THREE.Shape()
    shape.moveTo(points[0].x, points[0].z)
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].z)
    }
    shape.closePath()

    const fillGeo = new THREE.ShapeGeometry(shape)
    fillGeo.rotateX(-Math.PI / 2)

    // Wireframe
    const wirePoints = [...points, points[0].clone()]
    const wireGeo = new THREE.BufferGeometry().setFromPoints(wirePoints)

    return { fillGeometry: fillGeo, wireGeometry: wireGeo }
  }, [])

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.004
    }
  })

  return (
    <group ref={ref}>
      <mesh geometry={fillGeometry}>
        <meshBasicMaterial color={BRONZE} opacity={0.2} transparent side={THREE.DoubleSide} />
      </mesh>
      <line geometry={wireGeometry}>
        <lineBasicMaterial color={BRONZE} opacity={0.65} transparent />
      </line>
    </group>
  )
}

// Center cube
function CenterCube() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.008
      ref.current.rotation.y += 0.012
      ref.current.rotation.z += 0.005
    }
  })

  return (
    <group>
      <mesh ref={ref}>
        <boxGeometry args={[0.35, 0.35, 0.35]} />
        <meshBasicMaterial color={BRONZE} wireframe opacity={0.95} transparent />
      </mesh>
      <pointLight color={BRONZE} intensity={0.6} distance={3} />
    </group>
  )
}

// Pulsing vertex spheres
function VertexSpheres() {
  const refs = useRef<(THREE.Mesh | null)[]>([])
  const positions = useMemo(() => hexagonPoints(OUTER_RADIUS), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    refs.current.forEach((mesh, i) => {
      if (mesh) {
        const scale = 1 + 0.9 * Math.sin(t * 2 + i * (Math.PI / 3))
        mesh.scale.setScalar(scale)
      }
    })
  })

  return (
    <>
      {positions.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => { refs.current[i] = el }}
          position={pos}
        >
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshBasicMaterial color={BRONZE} />
        </mesh>
      ))}
    </>
  )
}

// Skill labels that orbit with the cage
function SkillLabels() {
  const labelPositions = useMemo(() => {
    return SKILLS.map((_, i) => {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
      return new THREE.Vector3(
        Math.cos(angle) * LABEL_RADIUS,
        0,
        Math.sin(angle) * LABEL_RADIUS
      )
    })
  }, [])

  return (
    <>
      {SKILLS.map((skill, i) => (
        <Html
          key={skill.name}
          position={labelPositions[i]}
          distanceFactor={8}
          style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            color: '#6B7280',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {skill.name}
        </Html>
      ))}
    </>
  )
}

// Main rotating group
function RadarScene() {
  const outerGroupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (!hovered && outerGroupRef.current) {
      const t = clock.getElapsedTime()
      outerGroupRef.current.rotation.y += 0.003
      outerGroupRef.current.rotation.x = Math.sin(t * 0.3) * 0.15
    }
  })

  return (
    <group
      ref={outerGroupRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Hexagonal rings */}
      {INNER_RADII.map((r, i) => (
        <HexRing key={i} radius={r} />
      ))}

      {/* Radial spokes */}
      <RadialSpokes />

      {/* Vertex spheres */}
      <VertexSpheres />

      {/* Skill labels orbit with the outer cage */}
      <SkillLabels />

      {/* Inner filled skill polygon (rotates slightly faster for parallax) */}
      <SkillPolygon />

      {/* Center cube */}
      <CenterCube />
    </group>
  )
}

export default function SkillRadar() {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 2.5, 4], fov: 50 }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight color="#ffffff" intensity={0.25} position={[3, 4, 2]} />
        <RadarScene />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          dampingFactor={0.05}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
