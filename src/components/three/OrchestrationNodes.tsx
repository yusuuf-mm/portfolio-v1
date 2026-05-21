'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NodeData {
  basePosition: [number, number, number]
  connections: number[]
  speed: [number, number, number]
}

const nodes: NodeData[] = [
  { basePosition: [-2.2, 1.0, 0], connections: [1, 3], speed: [0.3, 0.2, 0.1] },
  { basePosition: [0.5, 1.5, 0.3], connections: [2, 4], speed: [0.2, 0.35, 0.15] },
  { basePosition: [2.5, 0.4, -0.2], connections: [5], speed: [0.15, 0.25, 0.2] },
  { basePosition: [-1.5, -0.8, 0.2], connections: [4, 6], speed: [0.25, 0.15, 0.3] },
  { basePosition: [1.0, -0.3, -0.1], connections: [5, 7], speed: [0.3, 0.2, 0.25] },
  { basePosition: [2.8, -1.2, 0.1], connections: [7], speed: [0.2, 0.3, 0.15] },
  { basePosition: [-0.8, -1.8, 0.3], connections: [7], speed: [0.15, 0.2, 0.3] },
  { basePosition: [0.6, -2.2, -0.2], connections: [], speed: [0.25, 0.15, 0.2] },
]

const edgePairs: [number, number][] = []
nodes.forEach((node, i) => {
  node.connections.forEach((target) => {
    if (target < nodes.length) {
      edgePairs.push([i, target])
    }
  })
})

function OrchestrationScene() {
  const groupRef = useRef<THREE.Group>(null)
  const meshRefs = useRef<THREE.Mesh[]>([])
  const lineRef = useRef<THREE.LineSegments>(null)
  const posAttrRef = useRef<THREE.BufferAttribute>(null)
  const positionsRef = useRef<THREE.Vector3[]>(
    nodes.map((n) => new THREE.Vector3(...n.basePosition))
  )

  useEffect(() => {
    const geom = new THREE.BufferGeometry()
    const arr = new Float32Array(edgePairs.length * 6)
    edgePairs.forEach(([from, to], i) => {
      arr[i * 6] = nodes[from].basePosition[0]
      arr[i * 6 + 1] = nodes[from].basePosition[1]
      arr[i * 6 + 2] = nodes[from].basePosition[2]
      arr[i * 6 + 3] = nodes[to].basePosition[0]
      arr[i * 6 + 4] = nodes[to].basePosition[1]
      arr[i * 6 + 5] = nodes[to].basePosition[2]
    })
    const attr = new THREE.BufferAttribute(arr, 3)
    geom.setAttribute('position', attr)
    posAttrRef.current = attr

    if (lineRef.current) {
      lineRef.current.geometry = geom
    }

    return () => {
      geom.dispose()
    }
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const positions = positionsRef.current

    nodes.forEach((node, i) => {
      positions[i].x = node.basePosition[0] + Math.sin(t * node.speed[0] + i) * 0.3
      positions[i].y = node.basePosition[1] + Math.cos(t * node.speed[1] + i * 0.7) * 0.25
      positions[i].z = node.basePosition[2] + Math.sin(t * node.speed[2] + i * 1.3) * 0.15

      const mesh = meshRefs.current[i]
      if (mesh) {
        mesh.position.copy(positions[i])
      }
    })

    const posAttr = posAttrRef.current
    if (posAttr) {
      const arr = posAttr.array as Float32Array
      edgePairs.forEach(([from, to], i) => {
        arr[i * 6] = positions[from].x
        arr[i * 6 + 1] = positions[from].y
        arr[i * 6 + 2] = positions[from].z
        arr[i * 6 + 3] = positions[to].x
        arr[i * 6 + 4] = positions[to].y
        arr[i * 6 + 5] = positions[to].z
      })
      posAttr.needsUpdate = true
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <mesh
          key={i}
          position={node.basePosition}
          ref={(el) => {
            if (el) meshRefs.current[i] = el
          }}
        >
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#B8935A" transparent opacity={0.35} />
        </mesh>
      ))}

      <lineSegments ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#B8935A" transparent opacity={0.12} />
      </lineSegments>
    </group>
  )
}

export default function OrchestrationNodes() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <OrchestrationScene />
      </Canvas>
    </div>
  )
}
