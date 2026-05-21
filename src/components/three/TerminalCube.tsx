'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Cubes({ accentColor }: { accentColor: string }) {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (outerRef.current) {
      outerRef.current.rotation.y += 0.004
      outerRef.current.rotation.x += 0.001
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= 0.003
    }
  })

  return (
    <>
      <mesh ref={outerRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial wireframe color={accentColor} />
      </mesh>
      <mesh ref={innerRef}>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshBasicMaterial wireframe color={accentColor} opacity={0.3} transparent />
      </mesh>
    </>
  )
}

export default function TerminalCube({ accentColor = '#B8935A' }: { accentColor?: string }) {
  return (
    <div className="w-full h-full">
      <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <Cubes accentColor={accentColor} />
      </Canvas>
    </div>
  )
}
