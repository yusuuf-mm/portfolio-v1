'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
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
const BRONZE_BRIGHT = '#D4A96A'

interface SkillRadarProps {
  activeNodes?: number[]
  compact?: boolean
}

function RadarScene({ activeNodes = [], compact = false }: SkillRadarProps) {
  const outerGroupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  const OUTER_RADIUS = compact ? 1.8 : 2.2
  const INNER_RADII = compact ? [0.65, 1.2, 1.8] : [0.8, 1.5, 2.2]
  const LABEL_RADIUS = compact ? 2.2 : 2.65

  // Create hexagon points
  const hexagonPoints = (radius: number, y = 0): THREE.Vector3[] => {
    const points: THREE.Vector3[] = []
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
      points.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius))
    }
    return points
  }

  useFrame(({ clock }) => {
    if (!hovered && outerGroupRef.current) {
      const t = clock.getElapsedTime()
      outerGroupRef.current.rotation.y += 0.003
      outerGroupRef.current.rotation.x = Math.sin(t * 0.3) * 0.12
    }
  })

  // Hex ring component
  const HexRing = ({ radius }: { radius: number }) => {
    const points = useMemo(() => {
      const pts = hexagonPoints(radius)
      pts.push(pts[0].clone())
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

  // Radial spokes
  const RadialSpokes = () => {
    const geometry = useMemo(() => {
      const points: THREE.Vector3[] = []
      const outerPoints = hexagonPoints(OUTER_RADIUS)
      outerPoints.forEach((pt) => {
        points.push(new THREE.Vector3(0, 0, 0))
        points.push(pt)
      })
      return new THREE.BufferGeometry().setFromPoints(points)
    }, [OUTER_RADIUS])

    return (
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={BRONZE} opacity={0.3} transparent />
      </lineSegments>
    )
  }

  // Vertex spheres with flare effect
  const VertexSpheres = () => {
    const refs = useRef<(THREE.Mesh | null)[]>([])
    const materialRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([])
    const positions = useMemo(() => hexagonPoints(OUTER_RADIUS), [OUTER_RADIUS])
    const [flareStates, setFlareStates] = useState<number[]>(new Array(6).fill(0))

    // Update flare states when activeNodes changes
    useEffect(() => {
      if (activeNodes.length > 0) {
        const lastNode = activeNodes[activeNodes.length - 1]
        setFlareStates(prev => {
          const newStates = [...prev]
          newStates[lastNode] = 1
          return newStates
        })
      }
    }, [activeNodes])

    useFrame(({ clock }) => {
      const t = clock.getElapsedTime()
      refs.current.forEach((mesh, i) => {
        if (mesh && materialRefs.current[i]) {
          const isActive = activeNodes.includes(i)
          const flare = flareStates[i]
          
          // Base pulse + flare effect
          const baseScale = 1 + 0.3 * Math.sin(t * 2 + i * (Math.PI / 3))
          const flareScale = isActive ? 1.5 + flare * 2 : 1
          mesh.scale.setScalar(baseScale * flareScale * (compact ? 0.8 : 1))

          // Color intensity
          const material = materialRefs.current[i]
          if (material) {
            const intensity = isActive ? 1.2 : 0.8
            material.color.setStyle(isActive ? BRONZE_BRIGHT : BRONZE)
            material.opacity = intensity
          }
        }
      })

      // Decay flare states
      setFlareStates(prev => prev.map(v => Math.max(0, v - 0.02)))
    })

    return (
      <>
        {positions.map((pos, i) => (
          <mesh
            key={i}
            ref={(el) => { refs.current[i] = el }}
            position={pos}
          >
            <sphereGeometry args={[compact ? 0.045 : 0.055, 16, 16]} />
            <meshBasicMaterial
              ref={(el) => { materialRefs.current[i] = el }}
              color={BRONZE}
              transparent
            />
          </mesh>
        ))}
      </>
    )
  }

  // Skill polygon
  const SkillPolygon = () => {
    const ref = useRef<THREE.Group>(null)

    const { fillGeometry, wireGeometry } = useMemo(() => {
      const points = SKILLS.map((skill, i) => {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
        const r = skill.value * OUTER_RADIUS
        return new THREE.Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r)
      })

      const shape = new THREE.Shape()
      shape.moveTo(points[0].x, points[0].z)
      for (let i = 1; i < points.length; i++) {
        shape.lineTo(points[i].x, points[i].z)
      }
      shape.closePath()

      const fillGeo = new THREE.ShapeGeometry(shape)
      fillGeo.rotateX(-Math.PI / 2)

      const wirePoints = [...points, points[0].clone()]
      const wireGeo = new THREE.BufferGeometry().setFromPoints(wirePoints)

      return { fillGeometry: fillGeo, wireGeometry: wireGeo }
    }, [OUTER_RADIUS])

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
  const CenterCube = () => {
    const ref = useRef<THREE.Mesh>(null)

    useFrame(() => {
      if (ref.current) {
        ref.current.rotation.x += 0.008
        ref.current.rotation.y += 0.012
        ref.current.rotation.z += 0.005
      }
    })

    const size = compact ? 0.28 : 0.35

    return (
      <group>
        <mesh ref={ref}>
          <boxGeometry args={[size, size, size]} />
          <meshBasicMaterial color={BRONZE} wireframe opacity={0.95} transparent />
        </mesh>
        <pointLight color={BRONZE} intensity={0.6} distance={3} />
      </group>
    )
  }

  // Skill labels
  const SkillLabels = () => {
    const labelPositions = useMemo(() => {
      return SKILLS.map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
        return new THREE.Vector3(
          Math.cos(angle) * LABEL_RADIUS,
          0,
          Math.sin(angle) * LABEL_RADIUS
        )
      })
    }, [LABEL_RADIUS])

    if (compact) return null // Hide labels in compact mode

    return (
      <>
        {SKILLS.map((skill, i) => (
          <Html
            key={skill.name}
            position={labelPositions[i]}
            distanceFactor={8}
            style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              color: activeNodes.includes(i) ? BRONZE_BRIGHT : '#6B7280',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              pointerEvents: 'none',
              transition: 'color 0.3s ease',
            }}
          >
            {skill.name}
          </Html>
        ))}
      </>
    )
  }

  return (
    <group
      ref={outerGroupRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {INNER_RADII.map((r, i) => (
        <HexRing key={i} radius={r} />
      ))}
      <RadialSpokes />
      <VertexSpheres />
      <SkillLabels />
      <SkillPolygon />
      <CenterCube />
    </group>
  )
}

export default function SkillRadar({ activeNodes = [], compact = false }: SkillRadarProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, compact ? 2 : 2.5, compact ? 3.2 : 4], fov: 50 }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight color="#ffffff" intensity={0.25} position={[3, 4, 2]} />
        <RadarScene activeNodes={activeNodes} compact={compact} />
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
