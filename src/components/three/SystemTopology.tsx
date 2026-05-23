'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

interface NodeData {
  position: [number, number, number]
  connections: number[]
}

const nodes: NodeData[] = [
  { position: [0, 1.2, 0], connections: [1, 2] },
  { position: [-1.5, -0.4, 0.3], connections: [2, 3] },
  { position: [1.5, -0.4, -0.3], connections: [3] },
  { position: [0, -1.6, 0], connections: [4] },
  { position: [0.8, -2.4, 0.5], connections: [] },
]

function TopologyScene({ inView }: { inView: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRefs = useRef<THREE.Mesh[]>([])
  const materialRefs = useRef<THREE.MeshBasicMaterial[]>([])
  const { invalidate } = useThree()

  const edges = useMemo(() => {
    const result: [number, number][] = []
    nodes.forEach((node, i) => {
      node.connections.forEach((target) => {
        if (target < nodes.length) {
          result.push([i, target])
        }
      })
    })
    return result
  }, [])

  useEffect(() => {
    if (inView) invalidate()
  }, [inView, invalidate])

  useFrame(({ clock }) => {
    if (!inView) return
    const t = clock.getElapsedTime()

    meshRefs.current.forEach((mesh, i) => {
      if (mesh) {
        const scale = 1 + Math.sin(t * 0.8 + i * 1.2) * 0.15
        mesh.scale.setScalar(scale)
      }
    })

    materialRefs.current.forEach((mat, i) => {
      if (mat) {
        mat.opacity = 0.5 + Math.sin(t * 0.6 + i * 0.9) * 0.3
      }
    })

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.1
    }
    invalidate()
  })

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <mesh
          key={i}
          position={node.position}
          ref={(el) => {
            if (el) meshRefs.current[i] = el
          }}
        >
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial
            color="#B8935A"
            transparent
            opacity={0.7}
            ref={(el) => {
              if (el) materialRefs.current[i] = el
            }}
          />
        </mesh>
      ))}

      {edges.map(([from, to], i) => (
        <Line
          key={'edge-' + i}
          points={[nodes[from].position, nodes[to].position]}
          color="#B8935A"
          lineWidth={1}
          transparent
          opacity={0.25}
        />
      ))}
    </group>
  )
}

export default function SystemTopology() {
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
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        gl={{ alpha: true }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <ambientLight intensity={0.5} />
        <TopologyScene inView={inView} />
      </Canvas>
    </div>
  )
}
